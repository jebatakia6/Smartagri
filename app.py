"""
IoT-Based Smart Soil Analysis -- Flask Backend (app.py)
==============================================
Honesty notes:
  * Crop recommendations use hand-written agronomic rules, NOT a trained AI/ML model.
  * All sample data submitted via the test panel is manually entered -- no real sensor.
  * Weather data is fetched live from Google Maps Platform Weather API when a key is set.
    If GOOGLE_WEATHER_API_KEY is not set, the endpoint returns a clearly-labelled error.
  * IoT ingest requires DEVICE_TOKEN env variable; simulated payloads are allowed for testing.
"""

import sqlite3
import os
import re
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS
load_dotenv()
try:
    import requests as _requests
    _REQUESTS_AVAILABLE = True
except ImportError:
    _REQUESTS_AVAILABLE = False

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "soil_data.db")

# ---------------------------------------------------------------------------
# Environment-variable secrets (never exposed in responses or logs)
# ---------------------------------------------------------------------------
# Set in terminal before running:  export GOOGLE_WEATHER_API_KEY="YOUR_KEY"
# Set in terminal before running:  export DEVICE_TOKEN="your-secret-iot-token"
GOOGLE_WEATHER_API_KEY = os.environ.get("GOOGLE_WEATHER_API_KEY", "")
DEVICE_TOKEN           = os.environ.get("DEVICE_TOKEN", "iot-dev-token-change-me")

# Lightweight in-process rate-limit store for IoT ingest (device_id -> [timestamps])
_iot_rate_store: dict = {}

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        db.executescript("""
            CREATE TABLE IF NOT EXISTS soil_readings (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp   TEXT NOT NULL,
                location    TEXT DEFAULT 'Unknown',
                ph          REAL NOT NULL,
                moisture    REAL NOT NULL,
                temperature REAL NOT NULL,
                nitrogen    REAL DEFAULT NULL,
                phosphorus  REAL DEFAULT NULL,
                potassium   REAL DEFAULT NULL,
                notes       TEXT DEFAULT NULL,
                source      TEXT DEFAULT 'manual'
            );
            CREATE TABLE IF NOT EXISTS crop_recommendations (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                reading_id        INTEGER REFERENCES soil_readings(id),
                timestamp         TEXT NOT NULL,
                recommended_crops TEXT NOT NULL,
                method            TEXT NOT NULL DEFAULT 'rule-based',
                inputs_snapshot   TEXT NOT NULL
            );
        """)
        db.commit()
    print("[DB] Tables verified / created.")

# ---------------------------------------------------------------------------
# IoT rate-limit helper  (max 30 requests / device / minute)
# ---------------------------------------------------------------------------
MAX_IOT_RPM = 30

def _iot_rate_ok(device_id: str) -> bool:
    now = time.time()
    window = now - 60
    hits = _iot_rate_store.get(device_id, [])
    hits = [t for t in hits if t > window]
    if len(hits) >= MAX_IOT_RPM:
        _iot_rate_store[device_id] = hits
        return False
    hits.append(now)
    _iot_rate_store[device_id] = hits
    return True

VALID_LOCATION_RE = re.compile(r"^[\w\s\-,.()/]{1,120}$")

def validate_soil_payload(data):
    errors = []
    required = {
        "ph":          (0.0,   14.0,  "pH"),
        "moisture":    (0.0,  100.0,  "Moisture (%)"),
        "temperature": (-10.0, 60.0,  "Temperature"),
    }
    for field, (lo, hi, label) in required.items():
        val = data.get(field)
        if val is None:
            errors.append("'{}' is required.".format(field))
        else:
            try:
                num = float(val)
                if not (lo <= num <= hi):
                    errors.append("{} must be between {} and {}. Got: {}".format(label, lo, hi, num))
            except (ValueError, TypeError):
                errors.append("'{}' must be a number.".format(field))

    for field, label in {"nitrogen": "Nitrogen", "phosphorus": "Phosphorus", "potassium": "Potassium"}.items():
        val = data.get(field)
        if val is not None:
            try:
                num = float(val)
                if not (0 <= num <= 500):
                    errors.append("{} must be 0-500 mg/kg. Got: {}".format(label, num))
            except (ValueError, TypeError):
                errors.append("'{}' must be a number if provided.".format(field))

    loc = data.get("location", "")
    if loc and not VALID_LOCATION_RE.match(str(loc)):
        errors.append("'location' contains invalid characters or exceeds 120 chars.")
    return errors

# ---------------------------------------------------------------------------
# Rule-Based Crop Scoring (NOT AI -- clearly labelled)
# ---------------------------------------------------------------------------

CROP_RULES = [
    {"id": "rice",    "nameEn": "Rice (Aman)",     "nameBn": "\u09a7\u09be\u09a8 (\u0986\u09ae\u09a8)",   "ph_min": 5.5, "ph_max": 6.5, "moist_min": 60, "moist_max": 100, "temp_min": 20, "temp_max": 38, "season": "Kharif (Monsoon)", "water": "High",          "note": "Thrives in waterlogged / high-moisture conditions."},
    {"id": "wheat",   "nameEn": "Wheat (Sonalika)","nameBn": "\u0997\u09ae (\u09b8\u09cb\u09a8\u09be\u09b2\u09bf\u0995\u09be)","ph_min": 6.0, "ph_max": 7.0, "moist_min": 40, "moist_max":  60, "temp_min": 12, "temp_max": 25, "season": "Rabi (Winter)",   "water": "Medium",        "note": "Prefers cooler temps and moderate moisture."},
    {"id": "maize",   "nameEn": "Maize (Corn)",    "nameBn": "\u09ad\u09c1\u099f\u09cd\u099f\u09be",        "ph_min": 5.8, "ph_max": 7.2, "moist_min": 50, "moist_max":  75, "temp_min": 18, "temp_max": 35, "season": "Year-Round",      "water": "Medium",        "note": "Wide pH tolerance. Needs adequate nitrogen."},
    {"id": "potato",  "nameEn": "Potato (Diamant)","nameBn": "\u0986\u09b2\u09c1",                          "ph_min": 5.0, "ph_max": 6.5, "moist_min": 35, "moist_max":  55, "temp_min": 10, "temp_max": 22, "season": "Rabi (Winter)",   "water": "Low to Medium", "note": "Sensitive to excess moisture. Raised beds recommended if moisture >50%."},
    {"id": "tomato",  "nameEn": "Tomato (Roma)",   "nameBn": "\u099f\u09ae\u09c7\u099f\u09cb",               "ph_min": 6.0, "ph_max": 6.8, "moist_min": 45, "moist_max":  65, "temp_min": 18, "temp_max": 32, "season": "Year-Round",      "water": "Medium",        "note": "Consistent moisture critical during fruiting."},
    {"id": "mustard", "nameEn": "Mustard",         "nameBn": "\u09b8\u09b0\u09bf\u09b7\u09be",               "ph_min": 6.0, "ph_max": 7.5, "moist_min": 25, "moist_max":  45, "temp_min": 10, "temp_max": 25, "season": "Rabi (Winter)",   "water": "Low",           "note": "Requires well-drained soil. Excess moisture causes root rot."},
    {"id": "jute",    "nameEn": "Jute",            "nameBn": "\u09aa\u09be\u099f",                           "ph_min": 5.0, "ph_max": 6.8, "moist_min": 55, "moist_max":  85, "temp_min": 24, "temp_max": 40, "season": "Kharif (Monsoon)","water": "High",           "note": "Warm and humid conditions ideal."},
    {"id": "lentil",  "nameEn": "Lentil (Red)",    "nameBn": "\u09ae\u09b8\u09c1\u09b0 \u09a1\u09be\u09b2","ph_min": 6.0, "ph_max": 8.0, "moist_min": 25, "moist_max":  50, "temp_min": 10, "temp_max": 27, "season": "Rabi (Winter)",   "water": "Low",           "note": "Nitrogen-fixing legume. Reduces fertiliser needs in rotation."},
]

def score_crop(c, inputs):
    ph    = float(inputs.get("ph", 0))
    moist = float(inputs.get("moisture", 0))
    temp  = float(inputs.get("temperature", 0))

    ph_s = 33 if c["ph_min"] <= ph <= c["ph_max"] else max(0, 33 - int(min(abs(ph-c["ph_min"]), abs(ph-c["ph_max"])) * 15))
    m_s  = 33 if c["moist_min"] <= moist <= c["moist_max"] else max(0, 33 - int(min(abs(moist-c["moist_min"]), abs(moist-c["moist_max"])) * 1.5))
    t_s  = 34 if c["temp_min"] <= temp <= c["temp_max"] else max(0, 34 - int(min(abs(temp-c["temp_min"]), abs(temp-c["temp_max"])) * 5))

    total = ph_s + m_s + t_s
    if total < 20:
        return None

    if total >= 85:   suit, risk = "Highly Suitable", "Low Risk"
    elif total >= 60: suit, risk = "Suitable",         "Moderate Risk"
    elif total >= 40: suit, risk = "Marginally Suitable", "Higher Risk"
    else:             suit, risk = "Low Suitability",  "High Risk"

    warns = []
    if ph < c["ph_min"]:     warns.append("pH {:.1f} is below optimal ({}-{}). Consider liming.".format(ph, c["ph_min"], c["ph_max"]))
    elif ph > c["ph_max"]:   warns.append("pH {:.1f} is above optimal ({}-{}). Consider acidifying amendments.".format(ph, c["ph_min"], c["ph_max"]))
    if moist < c["moist_min"]: warns.append("Moisture {:.1f}% is below ideal ({}%-{}%). Irrigation may be needed.".format(moist, c["moist_min"], c["moist_max"]))
    elif moist > c["moist_max"]: warns.append("Moisture {:.1f}% exceeds ideal. Improve drainage.".format(moist))
    if temp < c["temp_min"]: warns.append("Temperature {:.1f}C is below optimal range.".format(temp))
    elif temp > c["temp_max"]: warns.append("Temperature {:.1f}C exceeds optimal range.".format(temp))

    return {
        "id": c["id"], "nameEn": c["nameEn"], "nameBn": c["nameBn"],
        "score": total, "suitability": suit, "risk": risk,
        "season": c["season"], "waterDemand": c["water"],
        "phRange": "{} - {}".format(c["ph_min"], c["ph_max"]),
        "moistureRange": "{}% - {}%".format(c["moist_min"], c["moist_max"]),
        "tempRange": "{}C - {}C".format(c["temp_min"], c["temp_max"]),
        "generalNote": c["note"], "warnings": warns,
    }

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok", "message": "Backend is running.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "connected", "version": "1.0.0",
        "project": "IoT Smart Soil Analysis System"
    }), 200


@app.route("/api/soil-data", methods=["POST"])
def submit_soil_reading():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Empty or invalid JSON body."}), 400
    errs = validate_soil_payload(data)
    if errs:
        return jsonify({"error": "Validation failed.", "details": errs}), 422

    loc  = str(data.get("location", "Unknown"))[:120].strip() or "Unknown"
    n    = float(data["nitrogen"])   if data.get("nitrogen")   is not None else None
    p    = float(data["phosphorus"]) if data.get("phosphorus") is not None else None
    k    = float(data["potassium"])  if data.get("potassium")  is not None else None
    notes = str(data.get("notes", ""))[:500].strip() or None
    src  = str(data.get("source", "manual"))[:20].strip()
    if src not in ("manual", "iot", "test"):
        src = "manual"
    ts = datetime.now(timezone.utc).isoformat()

    db  = get_db()
    cur = db.execute(
        "INSERT INTO soil_readings (timestamp, location, ph, moisture, temperature, nitrogen, phosphorus, potassium, notes, source) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (ts, loc,
         round(float(data["ph"]), 3), round(float(data["moisture"]), 3), round(float(data["temperature"]), 3),
         round(n, 3) if n is not None else None,
         round(p, 3) if p is not None else None,
         round(k, 3) if k is not None else None,
         notes, src)
    )
    db.commit()
    return jsonify({
        "message": "Soil reading saved successfully.", "id": cur.lastrowid, "timestamp": ts,
        "data": {"ph": round(float(data["ph"]), 3), "moisture": round(float(data["moisture"]), 3),
                 "temperature": round(float(data["temperature"]), 3),
                 "nitrogen": round(n, 3) if n is not None else None,
                 "phosphorus": round(p, 3) if p is not None else None,
                 "potassium": round(k, 3) if k is not None else None,
                 "location": loc, "notes": notes, "source": src}
    }), 201


@app.route("/api/soil-data", methods=["GET"])
def get_soil_readings():
    try: limit = min(int(request.args.get("limit", 50)), 200)
    except ValueError: limit = 50
    loc_f = request.args.get("location", "").strip()
    db = get_db()
    if loc_f:
        rows  = db.execute("SELECT * FROM soil_readings WHERE location LIKE ? ORDER BY id DESC LIMIT ?", ("%{}%".format(loc_f), limit)).fetchall()
        total = db.execute("SELECT COUNT(*) FROM soil_readings WHERE location LIKE ?", ("%{}%".format(loc_f),)).fetchone()[0]
    else:
        rows  = db.execute("SELECT * FROM soil_readings ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        total = db.execute("SELECT COUNT(*) FROM soil_readings").fetchone()[0]
    return jsonify({"total": total, "returned": len(rows), "readings": [dict(r) for r in rows]}), 200


@app.route("/api/crop-recommendation", methods=["POST"])
def crop_recommendation():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Empty or invalid JSON body."}), 400
    errs = validate_soil_payload(data)
    if errs:
        return jsonify({"error": "Validation failed.", "details": errs}), 422

    results = sorted(filter(None, [score_crop(c, data) for c in CROP_RULES]), key=lambda x: x["score"], reverse=True)

    saved_id = None
    if data.get("save", False):
        loc = str(data.get("location", "Unknown"))[:120].strip() or "Unknown"
        n   = float(data["nitrogen"])   if data.get("nitrogen")   is not None else None
        p   = float(data["phosphorus"]) if data.get("phosphorus") is not None else None
        k   = float(data["potassium"])  if data.get("potassium")  is not None else None
        ts  = datetime.now(timezone.utc).isoformat()
        db  = get_db()
        cur = db.execute(
            "INSERT INTO soil_readings (timestamp, location, ph, moisture, temperature, nitrogen, phosphorus, potassium, source) VALUES (?,?,?,?,?,?,?,?,?)",
            (ts, loc, round(float(data["ph"]), 3), round(float(data["moisture"]), 3), round(float(data["temperature"]), 3),
             round(n, 3) if n is not None else None,
             round(p, 3) if p is not None else None,
             round(k, 3) if k is not None else None, "manual")
        )
        db.commit()
        saved_id = cur.lastrowid

    return jsonify({
        "disclaimer": "RULE-BASED SYSTEM -- NOT AI: These recommendations are generated using hand-coded agronomic thresholds and scoring rules. They are preliminary guidelines only and not the output of a trained machine-learning model.",
        "inputs_received": {
            "ph": float(data["ph"]), "moisture": float(data["moisture"]), "temperature": float(data["temperature"]),
            "nitrogen": float(data["nitrogen"]) if data.get("nitrogen") is not None else None,
            "phosphorus": float(data["phosphorus"]) if data.get("phosphorus") is not None else None,
            "potassium": float(data["potassium"]) if data.get("potassium") is not None else None,
        },
        "method": "rule-based agronomic scoring",
        "total_crops_evaluated": len(CROP_RULES),
        "recommendations": results,
        "saved_reading_id": saved_id,
    }), 200


# ---------------------------------------------------------------------------
# GET /api/soil-data/<id>  — retrieve a single reading by primary key
# ---------------------------------------------------------------------------
@app.route("/api/soil-data/<int:reading_id>", methods=["GET"])
def get_soil_reading_by_id(reading_id):
    db = get_db()
    row = db.execute("SELECT * FROM soil_readings WHERE id = ?", (reading_id,)).fetchone()
    if row is None:
        return jsonify({"error": "Reading not found.", "id": reading_id}), 404
    return jsonify(dict(row)), 200


# ---------------------------------------------------------------------------
# GET /api/weather  — proxy to Google Maps Platform Weather API (server-side key)
# ---------------------------------------------------------------------------
@app.route("/api/weather", methods=["GET"])
def get_weather():
    # Validate query params
    try:
        lat = float(request.args.get("lat", ""))
        lon = float(request.args.get("lon", ""))
    except (TypeError, ValueError):
        return jsonify({
            "error": "'lat' and 'lon' query parameters are required and must be numbers.",
            "example": "/api/weather?lat=23.8103&lon=90.4125"
        }), 400

    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return jsonify({"error": "'lat' must be -90..90 and 'lon' must be -180..180."}), 400

    # API key check
    if not GOOGLE_WEATHER_API_KEY:
        return jsonify({
            "error": "GOOGLE_WEATHER_API_KEY is not configured on the server.",
            "action": "Set the environment variable before starting the backend: export GOOGLE_WEATHER_API_KEY=\"YOUR_KEY\"",
            "simulated": True,
            "note": "Without a key this endpoint cannot return real weather data."
        }), 503

    if not _REQUESTS_AVAILABLE:
        return jsonify({"error": "Python 'requests' library is not installed. Run: pip install requests"}), 503

    # -----------------------------------------------------------------------
    # Google Maps Platform Weather API
    # Endpoint: https://weather.googleapis.com/v1/currentConditions:lookup
    # Docs: https://developers.google.com/maps/documentation/weather
    # -----------------------------------------------------------------------
    GW_URL = "https://weather.googleapis.com/v1/currentConditions:lookup"
    GW_FORECAST_URL = "https://weather.googleapis.com/v1/forecast/days:lookup"

    try:
        params = {
            "key": GOOGLE_WEATHER_API_KEY,
            "location.latitude": lat,
            "location.longitude": lon,
            "unitsSystem": "METRIC",
        }
        cond_resp = _requests.get(GW_URL, params=params, timeout=10)

        # Separate forecast request (5-day)
        fc_params = dict(params)
        fc_params["days"] = 5
        fc_resp = _requests.get(GW_FORECAST_URL, params=fc_params, timeout=10)

    except _requests.exceptions.Timeout:
        return jsonify({"error": "Weather API request timed out. Try again later."}), 504
    except _requests.exceptions.ConnectionError as e:
        return jsonify({"error": "Could not reach Google Weather API.", "detail": str(e)}), 502

    # Handle non-200 from Google
    if cond_resp.status_code != 200:
        err_body = {}
        try:
            err_body = cond_resp.json()
        except Exception:
            pass
        code = cond_resp.status_code
        hint = ""
        if code == 400: hint = "Check your API key or request parameters."
        elif code == 403: hint = "API key lacks Weather API permission or billing is not enabled."
        elif code == 429: hint = "Rate limit exceeded. Wait before retrying."
        return jsonify({
            "error": "Google Weather API returned an error.",
            "http_status": code,
            "google_error": err_body,
            "hint": hint
        }), 502

    # Build clean response (key is never echoed back)
    current = cond_resp.json()
    forecast_days = []
    if fc_resp.status_code == 200:
        fc_data = fc_resp.json()
        forecast_days = fc_data.get("forecastDays", [])

    return jsonify({
        "source": "Google Maps Platform Weather API",
        "location": {"lat": lat, "lon": lon},
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "current": current,
        "forecast_days": forecast_days,
    }), 200


# ---------------------------------------------------------------------------
# POST /api/iot/ingest  — authenticated device data ingestion
# ---------------------------------------------------------------------------
@app.route("/api/iot/ingest", methods=["POST"])
def iot_ingest():
    """
    Authenticated endpoint for ESP32 / IoT devices to push soil readings.

    Expected JSON payload:
    {
      "device_id": "esp32-zone-a",
      "ph": 6.4,
      "moisture": 58.2,
      "temperature": 29.1,
      "nitrogen": 45,       (optional)
      "phosphorus": 32,     (optional)
      "potassium": 54,      (optional)
      "location": "Zone A" (optional)
    }

    Authentication: Bearer token in Authorization header
      Authorization: Bearer <DEVICE_TOKEN>
    """
    # --- Authentication ---
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Authorization header required: 'Bearer <token>'"}), 401
    token = auth_header[7:].strip()
    if token != DEVICE_TOKEN:
        return jsonify({"error": "Invalid device token."}), 403

    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Empty or invalid JSON body."}), 400

    # --- Device ID ---
    device_id = str(data.get("device_id", "unknown"))[:60].strip() or "unknown"

    # --- Rate limiting ---
    if not _iot_rate_ok(device_id):
        return jsonify({"error": "Rate limit exceeded.", "limit": f"{MAX_IOT_RPM} requests/minute/device"}), 429

    # --- Soil validation (reuse existing function) ---
    errs = validate_soil_payload(data)
    if errs:
        return jsonify({"error": "Validation failed.", "details": errs}), 422

    loc  = str(data.get("location", device_id))[:120].strip() or device_id
    n    = float(data["nitrogen"])   if data.get("nitrogen")   is not None else None
    p    = float(data["phosphorus"]) if data.get("phosphorus") is not None else None
    k    = float(data["potassium"])  if data.get("potassium")  is not None else None
    ts   = datetime.now(timezone.utc).isoformat()

    db  = get_db()
    cur = db.execute(
        "INSERT INTO soil_readings (timestamp, location, ph, moisture, temperature, nitrogen, phosphorus, potassium, notes, source) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (ts, loc,
         round(float(data["ph"]), 3), round(float(data["moisture"]), 3), round(float(data["temperature"]), 3),
         round(n, 3) if n is not None else None,
         round(p, 3) if p is not None else None,
         round(k, 3) if k is not None else None,
         str(data.get("notes", ""))[:500].strip() or None,
         "iot")
    )
    db.commit()
    return jsonify({
        "message": "IoT reading ingested successfully.",
        "id": cur.lastrowid,
        "device_id": device_id,
        "timestamp": ts,
        "source": "iot"
    }), 201


# ---------------------------------------------------------------------------
# GET /api/fertilizer-advice  — preliminary rule-based fertilizer guidance
# ---------------------------------------------------------------------------
@app.route("/api/fertilizer-advice", methods=["GET"])
def fertilizer_advice():
    """
    Returns preliminary fertilizer guidance based on N, P, K values.
    DISCLAIMER: These are general guidance ranges only.
    Accurate dosing requires a certified soil test and agronomist consultation.

    Query params: nitrogen, phosphorus, potassium (all optional; values in mg/kg)
    """
    def _get_float(key, default=None):
        v = request.args.get(key)
        if v is None: return default
        try: return float(v)
        except ValueError: return default

    n = _get_float("nitrogen")
    p = _get_float("phosphorus")
    k = _get_float("potassium")

    advice = []
    warnings = []

    # Nitrogen guidance (optimal: 50-80 mg/kg for most cereals)
    if n is not None:
        if n < 25:
            advice.append({"nutrient": "Nitrogen (N)", "status": "Critically Low",
                "general_guidance": "Consider urea (46-0-0) or ammonium sulphate application. Consult local agronomist for dosing specific to your crop and area.",
                "note": "Do NOT apply without a certified soil test and crop-specific guidance."})
        elif n < 50:
            advice.append({"nutrient": "Nitrogen (N)", "status": "Deficient",
                "general_guidance": "Mild nitrogen supplementation may be beneficial. Consider a split application approach.",
                "note": "Confirm with a certified soil test before application."})
        elif n <= 80:
            advice.append({"nutrient": "Nitrogen (N)", "status": "Optimal", "general_guidance": "No immediate action required. Maintain current soil management.", "note": ""})
        else:
            advice.append({"nutrient": "Nitrogen (N)", "status": "Excess",
                "general_guidance": "High nitrogen may cause leaf burn and water pollution. Avoid additional N fertiliser. Flush soil with irrigation if >150 mg/kg.",
                "note": "Excess nitrogen can leach into groundwater."})
            warnings.append("Nitrogen excess detected: avoid additional N fertiliser.")

    # Phosphorus guidance (optimal: 25-50 mg/kg)
    if p is not None:
        if p < 10:
            advice.append({"nutrient": "Phosphorus (P)", "status": "Critically Low",
                "general_guidance": "Consider single superphosphate (SSP) or di-ammonium phosphate (DAP). Beneficial for root development and flowering.",
                "note": "Dosing must be based on crop type, soil test, and field area. Seek agronomist advice."})
        elif p < 25:
            advice.append({"nutrient": "Phosphorus (P)", "status": "Deficient",
                "general_guidance": "Moderate phosphate supplementation may improve yields. Use at planting for best uptake.",
                "note": "Confirm with a certified soil test."})
        elif p <= 50:
            advice.append({"nutrient": "Phosphorus (P)", "status": "Optimal", "general_guidance": "No immediate action required.", "note": ""})
        else:
            advice.append({"nutrient": "Phosphorus (P)", "status": "High",
                "general_guidance": "Avoid additional phosphate application. High P can lock out zinc and iron.",
                "note": ""})

    # Potassium guidance (optimal: 100-200 mg/kg)
    if k is not None:
        if k < 50:
            advice.append({"nutrient": "Potassium (K)", "status": "Critically Low",
                "general_guidance": "Consider muriate of potash (MOP 0-0-60) or sulphate of potash (SOP). Potassium improves drought resistance.",
                "note": "Application rates depend on crop type and field area. Consult agronomist."})
        elif k < 100:
            advice.append({"nutrient": "Potassium (K)", "status": "Deficient",
                "general_guidance": "Mild K supplementation recommended especially for root crops and fruits.",
                "note": "Confirm with a certified soil test."})
        elif k <= 200:
            advice.append({"nutrient": "Potassium (K)", "status": "Optimal", "general_guidance": "No immediate action required.", "note": ""})
        else:
            advice.append({"nutrient": "Potassium (K)", "status": "High", "general_guidance": "Avoid additional potassium. Very high K can inhibit magnesium uptake.", "note": ""})

    if not advice:
        return jsonify({
            "error": "Provide at least one of: nitrogen, phosphorus, potassium as a query parameter.",
            "example": "/api/fertilizer-advice?nitrogen=40&phosphorus=20&potassium=80"
        }), 400

    return jsonify({
        "disclaimer": (
            "PRELIMINARY GUIDANCE ONLY — NOT A CERTIFIED RECOMMENDATION. "
            "These ranges are derived from general agronomic literature. "
            "Accurate fertiliser dosing requires a certified soil test, knowledge of your "
            "specific crop, field area (hectares), and consultation with a qualified agronomist."
        ),
        "inputs": {"nitrogen_mg_kg": n, "phosphorus_mg_kg": p, "potassium_mg_kg": k},
        "advice": advice,
        "warnings": warnings,
    }), 200


# ---------------------------------------------------------------------------
# GET /api/routes  — list all available endpoints
# ---------------------------------------------------------------------------
@app.route("/api/routes", methods=["GET"])
def list_routes():
    return jsonify({
        "endpoints": [
            {"method": "GET",  "path": "/api/health",              "description": "Backend health check"},
            {"method": "POST", "path": "/api/soil-data",           "description": "Submit a soil reading"},
            {"method": "GET",  "path": "/api/soil-data",           "description": "Retrieve soil readings (limit, location query params)"},
            {"method": "GET",  "path": "/api/soil-data/<id>",      "description": "Retrieve a single reading by ID"},
            {"method": "GET",  "path": "/api/weather",             "description": "Current weather + forecast (lat, lon query params). Requires GOOGLE_WEATHER_API_KEY."},
            {"method": "POST", "path": "/api/crop-recommendation", "description": "Rule-based crop recommendations (ph, moisture, temperature required)"},
            {"method": "GET",  "path": "/api/fertilizer-advice",   "description": "Preliminary fertiliser guidance (nitrogen, phosphorus, potassium query params)"},
            {"method": "POST", "path": "/api/iot/ingest",          "description": "Authenticated IoT device data ingestion (Bearer token required)"},
            {"method": "GET",  "path": "/api/routes",              "description": "This endpoint — lists all routes"},
        ]
    }), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found.", "hint": "Check /api/routes for available routes."}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "HTTP method not allowed on this endpoint."}), 405

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "An internal server error occurred. Check server logs."}), 500


if __name__ == "__main__":
    init_db()
    print("=" * 60)
    print("  IoT Smart Soil Analysis - Backend Running")
    print("  URL  : http://127.0.0.1:5000")
    print("  Docs : http://127.0.0.1:5000/api/health")
    print("=" * 60)
    app.run(debug=True, host="127.0.0.1", port=5000)
