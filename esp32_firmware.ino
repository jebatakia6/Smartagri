/*
 * ESP32 Soil Sensor Firmware — Smart Soil Analysis System
 * =========================================================
 * Target Hardware (identify yours before uploading):
 *   - Microcontroller : ESP32 (any variant: WROOM, WROVER, etc.)
 *   - pH Sensor       : Analog pH sensor module (e.g. DFRobot SEN0161)
 *   - Moisture Sensor : Capacitive soil moisture sensor (e.g. v1.2 or v2.0)
 *   - Temperature     : DS18B20 waterproof probe OR DHT22 ambient
 *
 * IMPORTANT: Inspect and adapt pin numbers (PH_PIN, MOISTURE_PIN, ONE_WIRE_BUS)
 * to match your specific wiring before flashing.
 *
 * Libraries required (install via Arduino Library Manager):
 *   - WiFi.h              (bundled with ESP32 Arduino core)
 *   - HTTPClient.h        (bundled with ESP32 Arduino core)
 *   - ArduinoJson         (version 6.x — search "ArduinoJson" by Benoit Blanchon)
 *   - OneWire             (search "OneWire" by Paul Stoffregen)
 *   - DallasTemperature   (search "DallasTemperature" by Miles Burton)
 *
 * Honesty note: This firmware sends real sensor readings to the backend.
 * The backend endpoint /api/iot/ingest validates the Bearer token and
 * stores the reading in SQLite. No data is fabricated.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// =============================================================================
// CONFIGURATION — edit these before flashing
// =============================================================================

// Wi-Fi credentials
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API URL (replace with your server IP if not running on localhost)
// When testing from ESP32 on the same LAN, use your Mac's local IP, e.g.:
//   http://192.168.1.100:5000/api/iot/ingest
const char* SERVER_URL    = "http://192.168.1.100:5000/api/iot/ingest";

// Device authentication token — must match DEVICE_TOKEN env variable on server
// Default server value is "iot-dev-token-change-me". Change BOTH for production.
const char* DEVICE_TOKEN  = "iot-dev-token-change-me";

// Device identifier (shown in database, max 60 chars)
const char* DEVICE_ID     = "esp32-zone-a";

// Field location label (max 120 chars)
const char* LOCATION      = "Zone A - Field 1";

// How often to send a reading (milliseconds). 60000 = 1 minute.
const unsigned long SEND_INTERVAL_MS = 60000;

// =============================================================================
// PIN ASSIGNMENTS — check against your actual wiring
// =============================================================================

// Analog pH sensor output → GPIO 34 (ADC1_CH6, input-only on ESP32)
const int PH_PIN          = 34;

// Capacitive moisture sensor output → GPIO 35 (ADC1_CH7, input-only)
const int MOISTURE_PIN    = 35;

// DS18B20 data pin → GPIO 4 (needs 4.7k pull-up to 3.3V)
const int ONE_WIRE_BUS    = 4;

// (Optional) Onboard LED for status blinks
const int LED_PIN         = 2;

// =============================================================================
// SENSOR CALIBRATION — adjust to your actual sensor readings
// =============================================================================

// pH sensor calibration:
//   Measure ADC value in pH 7 buffer and pH 4 buffer.
//   Set PH_VOLTAGE_AT_7 and PH_VOLTAGE_AT_4 accordingly.
//   Formula: pH = 7 + (V_at_7 - V_measured) / (V_at_7 - V_at_4) * (7 - 4)
const float PH_VOLTAGE_AT_7  = 2.50;   // Volts at pH 7 buffer
const float PH_VOLTAGE_AT_4  = 3.05;   // Volts at pH 4 buffer (higher voltage = lower pH)

// Capacitive moisture calibration:
//   ADC value in dry air (0% moisture) and submerged (100%)
const int   MOISTURE_DRY  = 3400;      // ADC reading in dry air
const int   MOISTURE_WET  = 1200;      // ADC reading submerged in water

// =============================================================================
// GLOBALS
// =============================================================================
OneWire            oneWire(ONE_WIRE_BUS);
DallasTemperature  tempSensor(&oneWire);
unsigned long      lastSendTime = 0;

// =============================================================================
// SETUP
// =============================================================================
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  tempSensor.begin();

  // Connect to Wi-Fi
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP: " + WiFi.localIP().toString());
    // Blink LED 3 times = connected
    for (int i = 0; i < 3; i++) { digitalWrite(LED_PIN, HIGH); delay(200); digitalWrite(LED_PIN, LOW); delay(200); }
  } else {
    Serial.println("\n[WiFi] FAILED to connect. Check SSID/password.");
  }
}

// =============================================================================
// SENSOR READING FUNCTIONS
// =============================================================================

float readPH() {
  // Average 10 ADC samples to reduce noise
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(PH_PIN);
    delay(10);
  }
  float raw = sum / 10.0;
  // Convert ADC (0-4095 for 12-bit) to voltage (ESP32 ADC ref ≈ 3.3V)
  float voltage = raw * (3.3 / 4095.0);
  // Linear interpolation between calibration points
  float ph = 7.0 + (PH_VOLTAGE_AT_7 - voltage) / (PH_VOLTAGE_AT_7 - PH_VOLTAGE_AT_4) * 3.0;
  ph = constrain(ph, 0.0, 14.0);
  Serial.printf("[Sensor] pH raw=%.0f, V=%.3f, pH=%.2f\n", raw, voltage, ph);
  return round(ph * 100.0) / 100.0;
}

float readMoisture() {
  int raw = analogRead(MOISTURE_PIN);
  // Map ADC to 0-100%: DRY=0%, WET=100%
  float moisture = map(raw, MOISTURE_DRY, MOISTURE_WET, 0, 100);
  moisture = constrain(moisture, 0.0, 100.0);
  Serial.printf("[Sensor] Moisture raw=%d, pct=%.1f%%\n", raw, moisture);
  return round(moisture * 10.0) / 10.0;
}

float readTemperature() {
  tempSensor.requestTemperatures();
  float temp = tempSensor.getTempCByIndex(0);
  if (temp == DEVICE_DISCONNECTED_C) {
    Serial.println("[Sensor] DS18B20 not found or disconnected!");
    return -999.0;  // Sentinel value; backend validation will reject it
  }
  Serial.printf("[Sensor] Temperature=%.2f°C\n", temp);
  return round(temp * 100.0) / 100.0;
}

// =============================================================================
// HTTP POST to backend
// =============================================================================
void sendReading(float ph, float moisture, float temperature) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected. Skipping send.");
    return;
  }

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["device_id"]   = DEVICE_ID;
  doc["location"]    = LOCATION;
  doc["ph"]          = ph;
  doc["moisture"]    = moisture;
  doc["temperature"] = temperature;
  // Nitrogen, phosphorus, potassium are optional.
  // Add them here if you have NPK sensors attached.
  // doc["nitrogen"]    = 45.0;
  // doc["phosphorus"]  = 32.0;
  // doc["potassium"]   = 54.0;

  String jsonBody;
  serializeJson(doc, jsonBody);

  Serial.println("[HTTP] Sending reading to: " + String(SERVER_URL));
  Serial.println("[HTTP] Payload: " + jsonBody);

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "application/json");
  http.addHeader("Authorization", "Bearer " + String(DEVICE_TOKEN));

  int httpCode = http.POST(jsonBody);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[HTTP] Response %d: %s\n", httpCode, response.c_str());
    if (httpCode == 201) {
      Serial.println("[HTTP] ✓ Reading saved successfully.");
      // Short blink = success
      digitalWrite(LED_PIN, HIGH); delay(100); digitalWrite(LED_PIN, LOW);
    } else {
      Serial.println("[HTTP] ✗ Server returned error. Check token and payload.");
    }
  } else {
    Serial.printf("[HTTP] Connection failed. Error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

// =============================================================================
// MAIN LOOP
// =============================================================================
void loop() {
  unsigned long now = millis();

  if (now - lastSendTime >= SEND_INTERVAL_MS || lastSendTime == 0) {
    lastSendTime = now;

    Serial.println("\n--- Reading sensors ---");
    float ph          = readPH();
    float moisture    = readMoisture();
    float temperature = readTemperature();

    // Validate before sending (basic sanity check on device)
    if (ph < 0 || ph > 14 || moisture < 0 || moisture > 100 || temperature == -999.0) {
      Serial.println("[Validation] Invalid sensor reading. Skipping send.");
    } else {
      sendReading(ph, moisture, temperature);
    }
  }

  delay(1000);  // 1-second heartbeat loop
}
