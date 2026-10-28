/**
 * TestPanel.js -- Backend Integration Test Panel Page
 * =====================================================
 * Renders a dedicated "Backend Test Panel" page inside the SPA.
 * Allows manual submission and testing of all API endpoints
 * before real IoT hardware is connected.
 *
 * This file does NOT modify any existing frontend code.
 * It is registered into the router in index.html via a small script tag addition.
 */

function renderTestPanelPage(container) {
  if (!container) return;
  container.className = "space-y-6 fade-in";

  container.innerHTML = `
    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight flex items-center gap-3">
        <span class="p-2 rounded-xl bg-blue-500/10 text-blue-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"></path>
          </svg>
        </span>
        Backend API Test Panel
      </h1>
      <p class="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
        Use this panel to manually submit soil readings and test each backend endpoint before real IoT hardware is connected.
        All data entered here is labelled <strong>source: "test"</strong> in the database.
      </p>

      <!-- Backend Status Badge -->
      <div id="tp-status-badge" class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold">
        <span class="w-2 h-2 rounded-full bg-gray-400"></span>
        <span>Checking backend...</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- LEFT: Submit Soil Reading (POST /api/soil-data) -->
      <div class="glass-card p-6 rounded-3xl space-y-4">
        <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider border-b border-[var(--border-card)] pb-3">
          POST /api/soil-data
          <span class="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 normal-case">Save a Sensor Reading</span>
        </h2>

        <form id="tp-submit-form" class="space-y-3" onsubmit="return false;">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">pH *</label>
              <input type="number" id="tp-ph" value="6.5" min="0" max="14" step="0.1" required
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Moisture % *</label>
              <input type="number" id="tp-moisture" value="55" min="0" max="100" step="0.1" required
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Temp °C *</label>
              <input type="number" id="tp-temp" value="28" min="-10" max="60" step="0.1" required
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">N (mg/kg)</label>
              <input type="number" id="tp-n" value="45" min="0" max="500"
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">P (mg/kg)</label>
              <input type="number" id="tp-p" value="32" min="0" max="500"
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">K (mg/kg)</label>
              <input type="number" id="tp-k" value="54" min="0" max="500"
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Location</label>
            <input type="text" id="tp-location" value="Zone A - Test" maxlength="120"
              class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Notes</label>
            <input type="text" id="tp-notes" placeholder="Optional notes about this reading..." maxlength="500"
              class="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>

          <div class="flex gap-3">
            <button id="tp-autofill-btn" type="button"
              class="flex-1 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl text-xs font-bold border border-blue-500/20 transition-smooth">
              ⚡ Auto-fill from live sensor
            </button>
            <button id="tp-submit-btn" type="submit"
              class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/15 transition-smooth">
              Submit Reading →
            </button>
          </div>
        </form>

        <!-- Submit Result -->
        <div id="tp-submit-result" class="hidden"></div>
      </div>

      <!-- RIGHT: Column with Health + GET Readings + Recommendation -->
      <div class="space-y-4">

        <!-- GET /api/health -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider flex items-center justify-between">
            <span>GET /api/health</span>
            <button id="tp-health-btn"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-smooth">
              Ping
            </button>
          </h2>
          <div id="tp-health-result" class="text-xs text-[var(--text-muted)]">Click "Ping" to test.</div>
        </div>

        <!-- GET /api/soil-data -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider flex items-center justify-between">
            <span>GET /api/soil-data</span>
            <button id="tp-get-btn"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-smooth">
              Fetch
            </button>
          </h2>
          <div id="tp-get-result" class="text-xs text-[var(--text-muted)]">Click "Fetch" to retrieve saved readings.</div>
        </div>

        <!-- POST /api/crop-recommendation -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">
            POST /api/crop-recommendation
          </h2>
          <p class="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            ⚠ RULE-BASED — NOT AI. Uses the same values from the form above.
          </p>
          <button id="tp-recom-btn"
            class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-smooth">
            Get Recommendations
          </button>
          <div id="tp-recom-result" class="text-xs text-[var(--text-muted)]">Click above to test the recommendation engine.</div>
        </div>

        <!-- GET /api/weather -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider flex items-center justify-between">
            <span>GET /api/weather</span>
            <button id="tp-weather-btn"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-smooth">
              Fetch
            </button>
          </h2>
          <p class="text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
            Requires GOOGLE_WEATHER_API_KEY env variable. Returns 503 with clear error if not set.
          </p>
          <div class="flex gap-2">
            <input type="number" id="tp-weather-lat" value="23.8103" step="0.0001" placeholder="Latitude"
              class="flex-1 px-2 py-2 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <input type="number" id="tp-weather-lon" value="90.4125" step="0.0001" placeholder="Longitude"
              class="flex-1 px-2 py-2 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div id="tp-weather-result" class="text-xs text-[var(--text-muted)]">Click "Fetch" to test the weather endpoint.</div>
        </div>

        <!-- GET /api/fertilizer-advice -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider flex items-center justify-between">
            <span>GET /api/fertilizer-advice</span>
            <button id="tp-fert-btn"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-smooth">
              Fetch
            </button>
          </h2>
          <p class="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            ⚠ PRELIMINARY GUIDANCE ONLY. Uses N/P/K values from the form above.
          </p>
          <div id="tp-fert-result" class="text-xs text-[var(--text-muted)]">Click "Fetch" to get fertilizer guidance.</div>
        </div>

        <!-- POST /api/iot/ingest (simulated) -->
        <div class="glass-card p-5 rounded-3xl space-y-3">
          <h2 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">
            POST /api/iot/ingest
            <span class="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 normal-case">Simulated IoT Device</span>
          </h2>
          <p class="text-[10px] text-[var(--text-muted)] leading-relaxed">
            Simulates an ESP32 sending a soil reading. Uses Bearer token auth from <code class="bg-gray-200/50 dark:bg-emerald-950/20 px-1 rounded">DEVICE_TOKEN</code> env var (default: <code class="bg-gray-200/50 dark:bg-emerald-950/20 px-1 rounded">iot-dev-token-change-me</code>).
          </p>
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Device Token</label>
            <input type="text" id="tp-iot-token" value="iot-dev-token-change-me" maxlength="120"
              class="w-full px-3 py-2 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <button id="tp-iot-btn"
            class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-smooth">
            📡 Simulate IoT Ingest
          </button>
          <div id="tp-iot-result" class="text-xs text-[var(--text-muted)]">Click above to simulate an ESP32 payload submission.</div>
        </div>

      </div>
    </div>
  `;

  // -------------------------------------------------------------------------
  // Helper: render a response box
  // -------------------------------------------------------------------------
  function showResult(containerId, result) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.classList.remove("hidden");

    const bg   = result.ok ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20";
    const badge = result.ok
      ? '<span class="text-emerald-500 font-black">✓ ' + result.status + ' OK</span>'
      : '<span class="text-red-400 font-black">✗ ' + (result.status || "Network Error") + '</span>';
    const raw = JSON.stringify(result.data || result.raw || { error: result.error, details: result.details }, null, 2);

    el.innerHTML = `
      <div class="rounded-xl border ${bg} p-3 space-y-2">
        <div class="flex items-center justify-between">
          ${badge}
          <span class="text-[10px] text-[var(--text-muted)]">${new Date().toLocaleTimeString()}</span>
        </div>
        <pre class="text-[10px] text-[var(--text-main)] overflow-auto max-h-48 whitespace-pre-wrap leading-relaxed">${raw.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Backend status badge
  // -------------------------------------------------------------------------
  async function updateStatusBadge() {
    const badge = document.getElementById("tp-status-badge");
    if (!badge) return;
    const r = await window.soilApi.checkHealth();
    if (r.ok) {
      badge.className = "mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span>Backend Online — ' + API_BASE_LABEL + '</span>';
    } else {
      badge.className = "mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold border-red-500/30 bg-red-500/10 text-red-400";
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-400"></span><span>Backend Offline — Run: python app.py</span>';
    }
  }
  const API_BASE_LABEL = "http://127.0.0.1:5000";
  updateStatusBadge();

  // -------------------------------------------------------------------------
  // Collect form values helper
  // -------------------------------------------------------------------------
  function getFormValues() {
    return {
      ph:          parseFloat(document.getElementById("tp-ph").value),
      moisture:    parseFloat(document.getElementById("tp-moisture").value),
      temperature: parseFloat(document.getElementById("tp-temp").value),
      nitrogen:    parseFloat(document.getElementById("tp-n").value)   || undefined,
      phosphorus:  parseFloat(document.getElementById("tp-p").value)   || undefined,
      potassium:   parseFloat(document.getElementById("tp-k").value)   || undefined,
      location:    document.getElementById("tp-location").value.trim() || "Unknown",
      notes:       document.getElementById("tp-notes").value.trim()    || undefined,
      source:      "test",
    };
  }

  // -------------------------------------------------------------------------
  // Auto-fill from live sensor data
  // -------------------------------------------------------------------------
  document.getElementById("tp-autofill-btn").addEventListener("click", () => {
    const s = window.appState.sensors;
    document.getElementById("tp-ph").value       = s.ph;
    document.getElementById("tp-moisture").value = s.moisture;
    document.getElementById("tp-temp").value     = s.temperature;
    document.getElementById("tp-n").value        = s.nitrogen;
    document.getElementById("tp-p").value        = s.phosphorus;
    document.getElementById("tp-k").value        = s.potassium;
    window.appState.triggerToast("success", "Live sensor values loaded into the test form.", "লাইভ সেন্সর ডেটা ফর্মে লোড করা হয়েছে।");
  });

  // -------------------------------------------------------------------------
  // Submit reading (POST /api/soil-data)
  // -------------------------------------------------------------------------
  document.getElementById("tp-submit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("tp-submit-btn");
    btn.disabled = true;
    btn.textContent = "Submitting…";

    const result = await window.soilApi.submitReading(getFormValues());
    showResult("tp-submit-result", result);

    if (result.ok) {
      window.appState.triggerToast("success", "Reading saved to database! ID: " + result.data.id, "ডেটা ডেটাবেজে সংরক্ষিত হয়েছে।");
    } else {
      window.appState.triggerToast("danger", "Submit failed: " + result.error, "সাবমিট ব্যর্থ হয়েছে।");
    }

    btn.disabled = false;
    btn.textContent = "Submit Reading →";
  });

  // -------------------------------------------------------------------------
  // Health check (GET /api/health)
  // -------------------------------------------------------------------------
  document.getElementById("tp-health-btn").addEventListener("click", async () => {
    const r = await window.soilApi.checkHealth();
    showResult("tp-health-result", r);
    updateStatusBadge();
  });

  // -------------------------------------------------------------------------
  // Get readings (GET /api/soil-data)
  // -------------------------------------------------------------------------
  document.getElementById("tp-get-btn").addEventListener("click", async () => {
    const r = await window.soilApi.getReadings({ limit: 10 });
    showResult("tp-get-result", r);
  });

  // -------------------------------------------------------------------------
  // Crop recommendation (POST /api/crop-recommendation)
  // -------------------------------------------------------------------------
  document.getElementById("tp-recom-btn").addEventListener("click", async () => {
    const btn = document.getElementById("tp-recom-btn");
    btn.disabled = true;
    btn.textContent = "Running…";

    const vals = getFormValues();
    const r = await window.soilApi.getCropRecommendation(vals);
    showResult("tp-recom-result", r);

    btn.disabled = false;
    btn.textContent = "Get Recommendations";
  });

  // -------------------------------------------------------------------------
  // Weather (GET /api/weather)
  // -------------------------------------------------------------------------
  document.getElementById("tp-weather-btn").addEventListener("click", async () => {
    const btn = document.getElementById("tp-weather-btn");
    btn.disabled = true;
    btn.textContent = "Loading…";

    const lat = parseFloat(document.getElementById("tp-weather-lat").value);
    const lon = parseFloat(document.getElementById("tp-weather-lon").value);
    const r = await window.soilApi.getWeather({ lat, lon });
    showResult("tp-weather-result", r);

    btn.disabled = false;
    btn.textContent = "Fetch";
  });

  // -------------------------------------------------------------------------
  // Fertilizer advice (GET /api/fertilizer-advice)
  // -------------------------------------------------------------------------
  document.getElementById("tp-fert-btn").addEventListener("click", async () => {
    const btn = document.getElementById("tp-fert-btn");
    btn.disabled = true;
    btn.textContent = "Loading…";

    const vals = getFormValues();
    const r = await window.soilApi.getFertilizerAdvice({
      nitrogen:   vals.nitrogen,
      phosphorus: vals.phosphorus,
      potassium:  vals.potassium,
    });
    showResult("tp-fert-result", r);

    btn.disabled = false;
    btn.textContent = "Fetch";
  });

  // -------------------------------------------------------------------------
  // IoT Ingest (POST /api/iot/ingest) — simulated device payload
  // -------------------------------------------------------------------------
  document.getElementById("tp-iot-btn").addEventListener("click", async () => {
    const btn = document.getElementById("tp-iot-btn");
    btn.disabled = true;
    btn.textContent = "Submitting…";

    const token = document.getElementById("tp-iot-token").value.trim();
    const vals  = getFormValues();
    const payload = {
      device_id:   "esp32-sim-001",
      ph:          vals.ph,
      moisture:    vals.moisture,
      temperature: vals.temperature,
      nitrogen:    vals.nitrogen,
      phosphorus:  vals.phosphorus,
      potassium:   vals.potassium,
      location:    vals.location || "Simulated Zone A",
      notes:       "Simulated payload from TestPanel",
    };

    try {
      const url = "http://127.0.0.1:5000/api/iot/ingest";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });
      let json;
      try { json = await response.json(); } catch (_) { json = { error: "Non-JSON response" }; }
      const r = response.ok
        ? { ok: true,  status: response.status, data: json }
        : { ok: false, status: response.status, error: json.error || "API error", raw: json };
      showResult("tp-iot-result", r);
      if (r.ok) {
        window.appState.triggerToast("success", "IoT payload ingested! ID: " + (r.data.id || "?"), "IoT ডেটা সংরক্ষিত হয়েছে।");
      }
    } catch (err) {
      showResult("tp-iot-result", { ok: false, status: 0, error: err.message, raw: null });
    }

    btn.disabled = false;
    btn.textContent = "📡 Simulate IoT Ingest";
  });
}

window.renderTestPanelPage = renderTestPanelPage;
