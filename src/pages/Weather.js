// Weather Forecast Page View
// Connects to GET /api/weather when backend + GOOGLE_WEATHER_API_KEY are available.
// Falls back to mock data with a clear banner when the API key is missing.
function renderWeatherPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;

  // ---- Phase 1: render skeleton + immediately try to load live data ----
  container.className = "space-y-6 fade-in";

  // Header HTML (always shown)
  const headerHtml = `
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
        ${t('weatherTitle')}
      </h1>
      <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
        ${t('weatherDesc')}
      </p>
    </div>
  `;

  // Render page with a loading state first
  container.innerHTML = `
    ${headerHtml}
    <div id="weather-api-banner" class="hidden"></div>
    <div id="weather-current-cards" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Skeleton loading cards -->
      ${[1,2,3,4].map(() => `
        <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl skeleton-shimmer shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/2 rounded skeleton-shimmer"></div>
            <div class="h-6 w-3/4 rounded skeleton-shimmer"></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div id="weather-forecast-panel" class="glass-card p-6 rounded-3xl">
      <div class="h-5 w-32 rounded skeleton-shimmer mb-5"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        ${[1,2,3,4,5].map(() => `
          <div class="p-4 rounded-2xl border border-[var(--border-card)] space-y-3 min-h-[180px]">
            <div class="h-4 w-full rounded skeleton-shimmer"></div>
            <div class="h-8 w-8 rounded-full skeleton-shimmer mx-auto"></div>
            <div class="h-5 w-1/2 rounded skeleton-shimmer mx-auto"></div>
            <div class="h-3 w-full rounded skeleton-shimmer"></div>
            <div class="h-3 w-full rounded skeleton-shimmer"></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Location input for weather lookup -->
    <div class="glass-card p-6 rounded-3xl">
      <div class="flex items-center gap-3.5 mb-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
          📍
        </div>
        <div>
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">
            ${currentLang === 'bn' ? 'আবহাওয়া অবস্থান পরিবর্তন করুন' : 'Change Weather Location'}
          </h3>
          <span class="text-[10px] text-[var(--text-muted)] mt-0.5 block">
            ${currentLang === 'bn' ? 'অক্ষাংশ ও দ্রাঘিমাংশ দিন' : 'Enter latitude and longitude coordinates'}
          </span>
        </div>
      </div>
      <div class="flex gap-3 flex-wrap">
        <input type="number" id="weather-lat" placeholder="Latitude (e.g. 23.8103)" step="0.0001"
          value="23.8103"
          class="flex-1 min-w-[140px] px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
        <input type="number" id="weather-lon" placeholder="Longitude (e.g. 90.4125)" step="0.0001"
          value="90.4125"
          class="flex-1 min-w-[140px] px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
        <button id="weather-fetch-btn"
          class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-smooth shadow-lg shadow-emerald-500/15">
          🔍 ${currentLang === 'bn' ? 'আবহাওয়া দেখুন' : 'Fetch Weather'}
        </button>
      </div>
    </div>
  `;

  // Attach fetch button listener
  const fetchBtn = container.querySelector('#weather-fetch-btn');
  fetchBtn.addEventListener('click', () => {
    const lat = parseFloat(container.querySelector('#weather-lat').value);
    const lon = parseFloat(container.querySelector('#weather-lon').value);
    if (isNaN(lat) || isNaN(lon)) {
      window.appState.triggerToast('danger', 'Please enter valid latitude and longitude values.', 'সঠিক অক্ষাংশ ও দ্রাঘিমাংশ দিন।');
      return;
    }
    loadWeatherData(lat, lon);
  });

  // Auto-load with default coordinates (Dhaka)
  loadWeatherData(23.8103, 90.4125);

  // ----------------------------------------------------------------
  // loadWeatherData: fetches from backend, then renders real or mock
  // ----------------------------------------------------------------
  async function loadWeatherData(lat, lon) {
    const banner = document.getElementById('weather-api-banner');
    const cardsEl = document.getElementById('weather-current-cards');
    const forecastEl = document.getElementById('weather-forecast-panel');
    if (!banner || !cardsEl || !forecastEl) return;

    // Show skeletons again
    cardsEl.innerHTML = [1,2,3,4].map(() => `
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl skeleton-shimmer shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-1/2 rounded skeleton-shimmer"></div>
          <div class="h-6 w-3/4 rounded skeleton-shimmer"></div>
        </div>
      </div>
    `).join('');

    const result = await window.soilApi.getWeather({ lat, lon });

    if (result.ok) {
      // ---- Live Google API data ----
      banner.className = "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2";
      banner.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ${currentLang === 'bn' ? 'লাইভ আবহাওয়া ডেটা (Google Maps Platform Weather API)' : 'Live weather data — Google Maps Platform Weather API'}`;

      renderLiveCurrentCards(cardsEl, result.data.current);
      renderLiveForecast(forecastEl, result.data.forecast_days);
    } else {
      // ---- Fallback to mock data with clear banner ----
      const isMissingKey = result.status === 503;
      const isNetworkErr = result.status === 0;

      banner.className = "p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 flex items-start gap-2";
      let bannerMsg = '';
      if (isMissingKey) {
        bannerMsg = `⚠️ <strong>Simulated weather data</strong> — GOOGLE_WEATHER_API_KEY is not configured on the server. Set it to see live data. (${result.raw?.action || ''})`;
      } else if (isNetworkErr) {
        bannerMsg = `⚠️ <strong>Simulated weather data</strong> — Backend is not reachable. Run <code>python app.py</code> first.`;
      } else {
        bannerMsg = `⚠️ <strong>Simulated weather data</strong> — Weather API error (${result.status}): ${result.error}`;
      }
      banner.innerHTML = bannerMsg;

      // Render mock data
      const f = window.mockData.weatherForecast;
      renderMockCurrentCards(cardsEl, f, currentLang, t);
      renderMockForecast(forecastEl, f, currentLang, t);
    }
  }

  // ---- Live current conditions renderer ----
  function renderLiveCurrentCards(el, current) {
    if (!current) { el.innerHTML = '<p class="text-xs text-[var(--text-muted)] col-span-4">No current conditions data.</p>'; return; }

    const temp    = current.temperature?.degrees ?? '—';
    const humid   = current.relativeHumidity ?? '—';
    const wind    = current.wind?.speed?.value ?? '—';
    const windUnit= current.wind?.speed?.unit ?? 'km/h';
    const precip  = current.precipitation?.probability?.percent ?? '—';
    const cond    = current.weatherCondition?.description?.text ?? current.weatherCondition?.type ?? '—';
    const icon    = condIcon(current.weatherCondition?.type);

    el.innerHTML = `
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 text-xl">🌡️</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('airTemperature')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${temp}°C</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">${cond}</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xl">🌧️</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('rainChance')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${precip}%</span>
          <span class="text-[9px] font-extrabold text-blue-500 block mt-0.5 uppercase tracking-widest">${icon}</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 text-xl">💧</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('humidity')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${humid}%</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">Relative Humidity</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gray-500/10 text-gray-400 flex items-center justify-center shrink-0 text-xl">💨</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('windSpeed')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${wind} ${windUnit}</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">${t('weatherDirection')}</span>
        </div>
      </div>
    `;
  }

  function renderLiveForecast(el, forecastDays) {
    if (!forecastDays || forecastDays.length === 0) {
      el.innerHTML = '<p class="text-xs text-[var(--text-muted)] p-6">No forecast data available.</p>';
      return;
    }
    el.innerHTML = `
      <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-5">${t('weeklyForecast')} (Live)</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        ${forecastDays.map((day, idx) => {
          const maxT = day.maxTemperature?.degrees ?? '—';
          const minT = day.minTemperature?.degrees ?? '—';
          const cond = day.daytimeForecast?.weatherCondition?.description?.text ?? '—';
          const precip = day.daytimeForecast?.precipitation?.probability?.percent ?? '—';
          const icon  = condIcon(day.daytimeForecast?.weatherCondition?.type);
          const dateStr = day.interval?.startTime ? new Date(day.interval.startTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : `Day ${idx + 1}`;
          const isToday = idx === 0;
          return `
            <div class="p-4 rounded-2xl border ${isToday ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-100/50 dark:bg-emerald-950/5 border-[var(--border-card)]'} flex flex-col justify-between min-h-[180px] hover:border-emerald-500/20 transition-smooth">
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-black text-[var(--text-main)]">${isToday ? 'Today' : dateStr}</span>
                  <span class="text-[10px] text-[var(--text-muted)] font-bold">${precip}% 🌧</span>
                </div>
                <div class="text-2xl py-1 text-center">${icon}</div>
                <div class="text-center">
                  <span class="text-sm font-extrabold text-[var(--text-main)] block">${maxT}°C</span>
                  <span class="text-[10px] text-[var(--text-muted)] block mt-0.5">${t('weatherLow')}: ${minT}°C</span>
                </div>
                <div class="text-center px-1 py-0.5 rounded bg-gray-200/50 dark:bg-emerald-950/20 text-[9px] font-bold text-[var(--text-muted)] truncate">${cond}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ---- Mock data renderers (fallback) ----
  function renderMockCurrentCards(el, f, lang, t) {
    el.innerHTML = `
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 text-xl">🌡️</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('airTemperature')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${f[0].tempMax}°C</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">${t('weatherLow')}: ${f[0].tempMin}°C</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xl">🌧️</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('rainChance')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${f[0].rainProb}%</span>
          <span class="text-[9px] font-extrabold text-blue-500 block mt-0.5 uppercase tracking-widest">${lang === 'bn' ? f[0].condBn : f[0].condEn}</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 text-xl">💧</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('humidity')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">${f[0].humidity}%</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">${t('evapotranspirationHigh')}</span>
        </div>
      </div>
      <div class="glass-card p-5 rounded-3xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gray-500/10 text-gray-400 flex items-center justify-center shrink-0 text-xl">💨</div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('windSpeed')}</span>
          <span class="text-2xl font-black text-[var(--text-main)] block mt-0.5">14 km/h</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-0.5">${t('weatherDirection')}</span>
        </div>
      </div>
    `;
  }

  function renderMockForecast(el, f, lang, t) {
    el.innerHTML = `
      <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-5">${t('weeklyForecast')} <span class="text-amber-400 text-[10px] normal-case font-bold">(Simulated)</span></h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        ${f.map((day, idx) => {
          const dayTitle = lang === 'bn' ? day.dayBn : day.dayEn;
          const cond = lang === 'bn' ? day.condBn : day.condEn;
          const advice = lang === 'bn' ? day.adviceBn : day.adviceEn;
          const isToday = idx === 0;
          const icon = day.icon === 'sun' ? '☀️' : day.icon === 'cloud-sun' ? '⛅' : day.icon === 'cloud-rain' ? '🌦️' : day.icon === 'cloud-showers-heavy' ? '⛈️' : '🌧️';
          return `
            <div class="p-4.5 rounded-2xl border ${isToday ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-100/50 dark:bg-emerald-950/5 border-[var(--border-card)]'} flex flex-col justify-between min-h-[220px] hover:border-emerald-500/20 transition-smooth">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-black text-[var(--text-main)]">${dayTitle}</span>
                  <span class="text-[10px] text-[var(--text-muted)] font-bold">${day.date}</span>
                </div>
                <div class="text-2xl py-1 text-center">${icon}</div>
                <div class="text-center">
                  <span class="text-sm font-extrabold text-[var(--text-main)] block">${day.tempMax}°C</span>
                  <span class="text-[10px] text-[var(--text-muted)] block mt-0.5">${t('weatherLow')}: ${day.tempMin}°C</span>
                </div>
                <div class="text-center px-1 py-0.5 rounded bg-gray-200/50 dark:bg-emerald-950/20 text-[9px] font-bold text-[var(--text-muted)] truncate">${cond}</div>
              </div>
              <div class="border-t border-[var(--border-card)]/50 pt-2.5 mt-4 text-[9px] leading-relaxed text-[var(--text-muted)] font-semibold">${advice}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Map Google weatherCondition type to emoji
  function condIcon(type) {
    if (!type) return '🌤️';
    type = type.toUpperCase();
    if (type.includes('CLEAR') || type.includes('SUNNY')) return '☀️';
    if (type.includes('CLOUD') && type.includes('PART')) return '⛅';
    if (type.includes('OVERCAST') || type.includes('CLOUDY')) return '☁️';
    if (type.includes('THUNDER') || type.includes('STORM')) return '⛈️';
    if (type.includes('RAIN') || type.includes('SHOWER')) return '🌧️';
    if (type.includes('DRIZZLE')) return '🌦️';
    if (type.includes('SNOW')) return '❄️';
    if (type.includes('FOG') || type.includes('MIST')) return '🌫️';
    return '🌤️';
  }
}

window.renderWeatherPage = renderWeatherPage;
