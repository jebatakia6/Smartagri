/**
 * api.js — Backend API Client
 * ============================
 * Connects the frontend SPA to the Flask backend via fetch().
 * This file does NOT modify any existing frontend code.
 *
 * Usage (after backend is running on http://127.0.0.1:5000):
 *   window.soilApi.checkHealth()
 *   window.soilApi.submitReading({ph, moisture, temperature, ...})
 *   window.soilApi.getReadings({limit, location})
 *   window.soilApi.getReadingById(id)
 *   window.soilApi.getCropRecommendation({ph, moisture, temperature, ...})
 *   window.soilApi.getWeather({lat, lon})
 *   window.soilApi.getFertilizerAdvice({nitrogen, phosphorus, potassium})
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------
  const API_BASE = "http://127.0.0.1:5000";

  // ---------------------------------------------------------------------------
  // Internal helper: perform a fetch and return a normalised result object.
  // Always resolves (never throws) so callers get a consistent shape.
  // ---------------------------------------------------------------------------
  async function _request(method, path, body) {
    const url = API_BASE + path;
    const opts = {
      method,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
    };
    if (body !== undefined) {
      opts.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, opts);
      let json;
      try {
        json = await response.json();
      } catch (_) {
        json = { error: "Server returned a non-JSON response." };
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: json.error || "Unknown API error.",
          details: json.details || [],
          raw: json,
        };
      }

      return { ok: true, status: response.status, data: json };

    } catch (networkErr) {
      // This fires when the backend is not reachable at all.
      return {
        ok: false,
        status: 0,
        error: "Cannot connect to backend. Is the Flask server running? (python app.py)",
        details: [networkErr.message],
        raw: null,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Public API surface — attached to window.soilApi
  // ---------------------------------------------------------------------------
  const soilApi = {

    /**
     * GET /api/health
     * Returns true if backend is up. Safe to call on page load.
     */
    async checkHealth() {
      return _request("GET", "/api/health");
    },

    /**
     * GET /api/routes
     * Lists all available API endpoints.
     */
    async listRoutes() {
      return _request("GET", "/api/routes");
    },

    /**
     * POST /api/soil-data
     * Submit a new soil sensor reading.
     *
     * @param {object} reading
     *   Required: ph (number), moisture (number), temperature (number)
     *   Optional: location (string), nitrogen, phosphorus, potassium (numbers),
     *             notes (string), source ('manual'|'iot'|'test')
     */
    async submitReading(reading) {
      return _request("POST", "/api/soil-data", reading);
    },

    /**
     * GET /api/soil-data
     * Retrieve stored soil readings.
     *
     * @param {object} [options]
     *   limit    (number, default 50, max 200)
     *   location (string) — partial match filter
     */
    async getReadings(options = {}) {
      const params = new URLSearchParams();
      if (options.limit)    params.set("limit",    options.limit);
      if (options.location) params.set("location", options.location);
      const qs = params.toString() ? "?" + params.toString() : "";
      return _request("GET", "/api/soil-data" + qs);
    },

    /**
     * GET /api/soil-data/<id>
     * Retrieve a single reading by its database ID.
     */
    async getReadingById(id) {
      return _request("GET", "/api/soil-data/" + id);
    },

    /**
     * POST /api/crop-recommendation
     * Get rule-based crop recommendations.
     *
     * NOTE: This is NOT an AI model. The backend clearly labels its responses
     * as rule-based. Display the disclaimer to users.
     *
     * @param {object} inputs
     *   Required: ph, moisture, temperature
     *   Optional: nitrogen, phosphorus, potassium, location
     *   Optional: save (boolean) — if true, reading is also saved to DB
     */
    async getCropRecommendation(inputs) {
      return _request("POST", "/api/crop-recommendation", inputs);
    },

    /**
     * GET /api/weather
     * Retrieve current weather + 5-day forecast via Google Maps Platform Weather API.
     * The API key is kept server-side and never exposed to the frontend.
     *
     * @param {object} options
     *   lat (number) — latitude  e.g. 23.8103 for Dhaka
     *   lon (number) — longitude e.g. 90.4125
     *
     * @returns {object}
     *   ok: true  → data.current, data.forecast_days (from Google)
     *   ok: false → if GOOGLE_WEATHER_API_KEY not set, status 503 with clear error
     */
    async getWeather({ lat, lon } = {}) {
      if (lat == null || lon == null) {
        return { ok: false, status: 0, error: "lat and lon are required." };
      }
      const params = new URLSearchParams({ lat, lon });
      return _request("GET", "/api/weather?" + params.toString());
    },

    /**
     * GET /api/fertilizer-advice
     * Preliminary fertilizer guidance based on N, P, K levels.
     *
     * @param {object} options
     *   nitrogen   (number, mg/kg) — optional
     *   phosphorus (number, mg/kg) — optional
     *   potassium  (number, mg/kg) — optional
     */
    async getFertilizerAdvice({ nitrogen, phosphorus, potassium } = {}) {
      const params = new URLSearchParams();
      if (nitrogen   != null) params.set("nitrogen",   nitrogen);
      if (phosphorus != null) params.set("phosphorus", phosphorus);
      if (potassium  != null) params.set("potassium",  potassium);
      return _request("GET", "/api/fertilizer-advice?" + params.toString());
    },
  };

  // ---------------------------------------------------------------------------
  // Expose globally
  // ---------------------------------------------------------------------------
  window.soilApi = soilApi;

  // ---------------------------------------------------------------------------
  // On load: silently ping the backend health endpoint so the dashboard
  // can show a backend connection badge without blocking startup.
  // ---------------------------------------------------------------------------
  window.addEventListener("load", async () => {
    const result = await soilApi.checkHealth();
    window._backendOnline = result.ok;

    if (result.ok) {
      console.info("[SoilAPI] Backend connected ✓", result.data);
    } else {
      console.warn("[SoilAPI] Backend NOT reachable.", result.error);
      console.warn("[SoilAPI] Run: cd 'Project Ampata jorajora 4' && python app.py");
    }
  });

})();
