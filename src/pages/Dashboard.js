// Dashboard Home Page View
function renderDashboardPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;
  const s = window.appState.sensors;
  const unreadAlerts = window.appState.alerts.filter(a => !a.read).slice(0, 3);

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Row: Welcome & Dynamic Summary Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          ${currentLang === 'bn' ? 'খামার ওভারভিউ ড্যাশবোর্ড' : 'Agricultural Telemetry Dashboard'}
        </h1>
        <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
          ${t('projectSubtitle')}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button id="db-refresh-btn" class="relative group overflow-hidden px-5 py-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-xs font-extrabold text-[var(--text-main)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-3 focus:outline-none">
          <!-- Glowing hover shine sweep -->
          <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
          
          <!-- Active heartbeat telemetry light -->
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <!-- Text & Icon container -->
          <div class="flex items-center gap-2 relative z-10">
            <svg id="refresh-icon" class="w-3.5 h-3.5 text-emerald-500 group-hover:rotate-180 transition-transform duration-700 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.77"></path>
            </svg>
            <span id="refresh-text" class="tracking-wider uppercase font-extrabold text-[10px] text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">${t('btnRefresh')}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Overview Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      
      <!-- Moisture -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorMoisture')}</span>
          <span class="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
          </span>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-black text-[var(--text-main)]">${s.moisture}%</span>
          <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-blue-500 h-full transition-all duration-1000" style="width: ${s.moisture}%"></div>
          </div>
        </div>
      </div>

      <!-- pH Level -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorPH')}</span>
          <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547"></path></svg>
          </span>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-black text-[var(--text-main)]">${s.ph}</span>
          <span class="text-[10px] font-bold ml-1.5 text-emerald-500 uppercase tracking-widest">${s.ph < 6.0 ? t('phAcidic') : s.ph > 7.2 ? t('phAlkaline') : t('phOptimal')}</span>
          <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-emerald-500 h-full transition-all duration-1000" style="width: ${(s.ph / 14) * 100}%"></div>
          </div>
        </div>
      </div>

      <!-- Temp -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorTemp')}</span>
          <span class="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
          </span>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-black text-[var(--text-main)]">${s.temperature}°C</span>
          <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-orange-500 h-full transition-all duration-1000" style="width: ${(s.temperature / 50) * 100}%"></div>
          </div>
        </div>
      </div>

      <!-- Soil Health -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorHealth')}</span>
          <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </span>
        </div>
        <div class="mt-2">
          <span class="text-2xl font-black text-[var(--text-main)]">${s.healthScore}%</span>
          <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-teal-500 h-full transition-all duration-1000" style="width: ${s.healthScore}%"></div>
          </div>
        </div>
      </div>

      <!-- Irrigation Status -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorIrrigation')}</span>
          <span class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547"></path></svg>
          </span>
        </div>
        <div class="mt-2 flex flex-col justify-end">
          <span class="text-lg font-black text-[var(--text-main)] truncate uppercase tracking-wide">
            ${s.irrigation === 'active' ? t('statusActive') : t('statusIdle')}
          </span>
          <span class="text-[9px] font-bold text-sky-400 uppercase tracking-widest mt-1 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full ${s.irrigation === 'active' ? 'bg-sky-400 animate-ping' : 'bg-gray-400'}"></span>
            ${s.irrigation === 'active' ? t('irrigationPumpConnected') : t('irrigationValveReady')}
          </span>
        </div>
      </div>

      <!-- AI Status -->
      <div class="glass-card p-4 rounded-2xl flex flex-col justify-between min-h-[120px]">
        <div class="flex justify-between items-center text-[var(--text-muted)]">
          <span class="text-[10px] font-bold uppercase tracking-wider">${t('sensorAIStatus')}</span>
          <span class="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707"></path></svg>
          </span>
        </div>
        <div class="mt-2">
          <span class="text-lg font-black text-[var(--text-main)] uppercase tracking-wide truncate">
            ${s.aiStatus === 'calculating' ? t('statusAnalyzing') : t('statusOptimal')}
          </span>
          <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 block">
            ${t('advisoryModelVersion')}
          </span>
        </div>
      </div>

    </div>

    <!-- Main Widget Section Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left 2 Columns: Live Charts and Nutrient Diagnostics -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Live Chart Card -->
        <div class="glass-card p-6 rounded-3xl">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('soilAnalyticsTitle')}</h3>
              <span class="text-[10px] text-[var(--text-muted)] mt-1 block">${t('soilAnalyticsSubtitle')}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-gray-200/40 dark:bg-emerald-950/20 p-0.5 rounded-xl border border-[var(--border-card)]">
              <button class="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500 text-white shadow-sm">${t('moistureTempTab')}</button>
            </div>
          </div>

          <!-- Chart canvas viewport -->
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="dashboard-main-chart"></canvas>
          </div>
        </div>

        <!-- Nutrient diagnostics and NPK Status -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <!-- NPK values status meters -->
          <div class="glass-card p-6 rounded-3xl">
            <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('npkStatus')}</h3>
            <div class="space-y-4">
              <!-- N -->
              <div>
                <div class="flex justify-between items-center text-xs font-bold text-[var(--text-main)] mb-1.5">
                  <span class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    ${t('nitrogen')}
                  </span>
                  <span>${s.nitrogen} mg/kg</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full" style="width: ${(s.nitrogen / 100) * 100}%"></div>
                </div>
              </div>
              <!-- P -->
              <div>
                <div class="flex justify-between items-center text-xs font-bold text-[var(--text-main)] mb-1.5">
                  <span class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                    ${t('phosphorus')}
                  </span>
                  <span>${s.phosphorus} mg/kg</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-2 rounded-full overflow-hidden">
                  <div class="bg-teal-400 h-full" style="width: ${(s.phosphorus / 100) * 100}%"></div>
                </div>
              </div>
              <!-- K -->
              <div>
                <div class="flex justify-between items-center text-xs font-bold text-[var(--text-main)] mb-1.5">
                  <span class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                    ${t('potassium')}
                  </span>
                  <span>${s.potassium} mg/kg</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-2 rounded-full overflow-hidden">
                  <div class="bg-orange-400 h-full" style="width: ${(s.potassium / 100) * 100}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fertilizer Suggestion Widget -->
          <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-2">${t('colFertilizer')} ${t('preview')}</h3>
              <p class="text-[11px] text-[var(--text-muted)] leading-relaxed mb-4">${t('fertiPreviewSubtitle')}</p>
              
              <!-- Content pill -->
              <div class="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/2 border border-emerald-500/10 flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-[var(--text-main)]">${currentLang === 'bn' ? window.mockData.fertilizerRules.nitrogenDeficit.nameBn : window.mockData.fertilizerRules.nitrogenDeficit.nameEn}</h4>
                  <span class="text-[9px] font-bold text-emerald-500 mt-0.5 block uppercase tracking-widest">${t('fertilizerQty')}: ${currentLang === 'bn' ? window.mockData.fertilizerRules.nitrogenDeficit.qtyBn : window.mockData.fertilizerRules.nitrogenDeficit.qtyEn}</span>
                </div>
              </div>
            </div>
            
            <button id="db-fertilizer-view-btn" class="w-full mt-4 py-2.5 text-center text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
              ${t('btnDetails')} (${t('navFertilizer')}) →
            </button>
          </div>

        </div>

      </div>

      <!-- Right 1 Column: Crop Suggestions & System Alert Feed -->
      <div class="space-y-6">
        
        <!-- Crop Suggestion Card -->
        <div class="glass-card p-6 rounded-3xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('cropSuggestPreview')}</h3>
            <button id="db-recom-view-btn" class="text-xs text-emerald-500 hover:text-emerald-600 font-bold transition-colors">${t('btnDetails')}</button>
          </div>
          
          <div class="space-y-3.5">
            ${window.mockData.cropsDb.slice(0, 3).map(crop => {
              const name = currentLang === 'bn' ? crop.nameBn : crop.nameEn;
              const season = currentLang === 'bn' ? crop.seasonBn : crop.seasonEn;
              return `
                <div class="p-3 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/5 border border-[var(--border-card)] flex items-center justify-between hover:border-emerald-500/30 transition-smooth cursor-pointer" data-crop-card-id="${crop.id}">
                  <div class="flex items-center gap-3">
                    <img class="w-10 h-10 rounded-xl object-cover" src="${crop.image}" alt="${name}">
                    <div>
                      <h4 class="text-xs font-extrabold text-[var(--text-main)]">${name}</h4>
                      <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5 block">${season}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-extrabold text-emerald-500 block">${crop.compatibility}%</span>
                    <span class="text-[8px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">${t('confidence')}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Weather summary card -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-3.5">${t('navWeather')} ${t('preview')}</h3>
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-400/5 border border-emerald-500/10">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-emerald-500 animate-pulse">☀️</span>
              <div>
                <h4 class="text-xs font-bold text-[var(--text-main)]">${currentLang === 'bn' ? window.mockData.weatherForecast[0].dayBn : window.mockData.weatherForecast[0].dayEn} ${t('forecast')}</h4>
                <span class="text-[10px] text-[var(--text-muted)] leading-relaxed mt-0.5 block">${currentLang === 'bn' ? window.mockData.weatherForecast[0].condBn : window.mockData.weatherForecast[0].condEn}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-sm font-black text-[var(--text-main)] block">${window.mockData.weatherForecast[0].tempMax}°C</span>
              <span class="text-[9px] text-[var(--text-muted)] font-bold block uppercase tracking-widest">${t('rain')}: ${window.mockData.weatherForecast[0].rainProb}%</span>
            </div>
          </div>
          <button id="db-weather-view-btn" class="w-full mt-3.5 py-2.5 text-center text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
            ${t('btnWeatherStation')}
          </button>
        </div>

        <!-- Recent Alerts widget -->
        <div class="glass-card p-6 rounded-3xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('recentAlertsTitle')}</h3>
            <button id="db-alerts-view-btn" class="text-xs text-emerald-500 hover:text-emerald-600 font-bold transition-colors">${t('btnDetails')}</button>
          </div>
          
          <div class="space-y-3">
            ${unreadAlerts.length === 0 ? `
              <div class="text-center py-6 text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                🎉 ${t('noAlerts')}
              </div>
            ` : unreadAlerts.map(alert => {
              const bgBadge = alert.type === 'danger' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20';
              const text = currentLang === 'bn' ? alert.messageBn : alert.messageEn;
              return `
                <div class="p-3 rounded-2xl ${bgBadge} border flex items-center justify-between gap-2.5 text-[11px]">
                  <p class="text-[var(--text-main)] font-semibold leading-relaxed">${text}</p>
                  <button data-dismiss-alert-id="${alert.id}" class="p-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-emerald-950/20 text-[var(--text-muted)] hover:text-rose-500 transition-colors shrink-0">
                    ✕
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach navigation triggers
  container.querySelector('#db-recom-view-btn').addEventListener('click', () => window.appState.setPage('recommendation'));
  container.querySelector('#db-fertilizer-view-btn').addEventListener('click', () => window.appState.setPage('fertilizer'));
  container.querySelector('#db-weather-view-btn').addEventListener('click', () => window.appState.setPage('weather'));
  container.querySelector('#db-alerts-view-btn').addEventListener('click', () => window.appState.setPage('alerts'));

  // Attach Crop detail modal triggers
  container.querySelectorAll('[data-crop-card-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-crop-card-id');
      const crop = window.mockData.cropsDb.find(c => c.id === id);
      if (crop) {
        window.appState.openModal('cropDetail', { crop });
      }
    });
  });

  // Individual Alert Dismiss Trigger
  container.querySelectorAll('[data-dismiss-alert-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dismiss-alert-id');
      window.appState.dismissAlert(id);
      renderDashboardPage(container); // Repaint
    });
  });

  // Manual dashboard refreshing trigger
  const refreshBtn = container.querySelector('#db-refresh-btn');
  const refreshIcon = container.querySelector('#refresh-icon');
  const refreshText = container.querySelector('#refresh-text');
  
  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    refreshIcon.classList.add('animate-spin');
    refreshText.innerText = t('btnRefreshing');
    
    setTimeout(() => {
      refreshBtn.disabled = false;
      refreshIcon.classList.remove('animate-spin');
      refreshText.innerText = t('btnRefresh');
      
      // Randomize values slightly for simulation
      window.appState.updateSensor('moisture', +(window.appState.sensors.moisture + (Math.random() - 0.5) * 2).toFixed(1));
      window.appState.updateSensor('temperature', +(window.appState.sensors.temperature + (Math.random() - 0.5) * 1).toFixed(1));
      window.appState.updateSensor('ph', +(window.appState.sensors.ph + (Math.random() - 0.5) * 0.1).toFixed(2));
      
      window.appState.triggerToast('success', 'IoT Telemetry data updated successfully!', 'আইওটি টেলিমিত্রি তথ্য সফলভাবে আপডেট করা হয়েছে!');
      renderDashboardPage(container); // Repaint
    }, 1200);
  });

  // Mount Chart.js line charts
  initDashboardCharts();
}

function initDashboardCharts() {
  const ctx = document.getElementById('dashboard-main-chart');
  if (!ctx) return;

  // Use raw data history logs
  const logs = [...window.mockData.historyLogs].slice(0, 10).reverse();
  const labels = logs.map(l => l.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const moistureData = logs.map(l => l.moisture);
  const tempData = logs.map(l => l.temperature);

  const isDark = window.appState.theme === 'dark';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? 'rgba(52, 211, 153, 0.05)' : 'rgba(16, 185, 129, 0.08)';

  // Destroy previous charts instances to prevent memory leak / overlap
  if (window.dbChartInstance) {
    window.dbChartInstance.destroy();
  }

  // Renders the combined dual-axis Chart.js line plot
  window.dbChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: window.appState.language === 'bn' ? 'মাটির আর্দ্রতা (%)' : 'Moisture (%)',
          data: moistureData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: window.appState.language === 'bn' ? 'তাপমাত্রা (°C)' : 'Temperature (°C)',
          data: tempData,
          borderColor: '#f97316',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          borderDash: [5, 5],
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: 'Inter', size: 10, weight: 'bold' }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          padding: 10,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 9 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 9 } },
          min: 15,
          max: 95
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: textColor, font: { size: 9 } },
          min: 10,
          max: 45
        }
      }
    }
  });
}

window.renderDashboardPage = renderDashboardPage;
