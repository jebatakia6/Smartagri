// Real-Time Soil Monitoring Page View
function renderMonitoringPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;
  const s = window.appState.sensors;
  
  // Track active time filter ('day', 'week', 'month')
  if (!window.activeTimeFilter) {
    window.activeTimeFilter = 'day';
  }

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Row: Headers, Filtering & Export Buttons -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          ${t('navMonitoring')}
        </h1>
        <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
          ${t('monitoringSubtitle')}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 self-start md:self-auto flex-wrap">
        <!-- Date filters -->
        <div class="flex items-center bg-gray-200/50 dark:bg-emerald-950/20 p-1 rounded-xl border border-[var(--border-card)]">
          <button id="filter-day" class="px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${
            window.activeTimeFilter === 'day' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }">${t('filterDay')}</button>
          <button id="filter-week" class="px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${
            window.activeTimeFilter === 'week' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }">${t('filterWeek')}</button>
          <button id="filter-month" class="px-3 py-1.5 text-xs font-bold rounded-lg transition-smooth ${
            window.activeTimeFilter === 'month' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }">${t('filterMonth')}</button>
        </div>
        
        <!-- Refresh & Export -->
        <button id="mon-refresh-btn" class="relative group overflow-hidden p-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-gray-500 hover:text-emerald-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center focus:outline-none">
          <!-- Glowing hover shine sweep -->
          <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
          
          <!-- Active heartbeat telemetry light -->
          <span class="absolute top-1 right-1 flex h-1.5 w-1.5 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>

          <svg id="mon-refresh-icon" class="w-4.5 h-4.5 text-emerald-500 group-hover:rotate-180 transition-transform duration-700 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.77"></path>
          </svg>
        </button>

        <button id="mon-export-btn" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-smooth focus:outline-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>${t('btnExportCSV')}</span>
        </button>
      </div>
    </div>

    <!-- Live Telemetry Status and Dials -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- Moisture Dial Card -->
      <div class="glass-card p-5 rounded-2xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path></svg>
        </div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('sensorMoisture')}</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">${s.moisture}%</span>
          <span class="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest mt-1 block">${t('optimalRange')}</span>
        </div>
      </div>

      <!-- Temperature Dial Card -->
      <div class="glass-card p-5 rounded-2xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" clip-rule="evenodd"></path></svg>
        </div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('sensorTemp')}</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">${s.temperature}°C</span>
          <span class="text-[9px] font-extrabold text-orange-500 uppercase tracking-widest mt-1 block">${t('healthySoilTemp')}</span>
        </div>
      </div>

      <!-- pH Dial Card -->
      <div class="glass-card p-5 rounded-2xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547"></path></svg>
        </div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('sensorPH')}</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">${s.ph}</span>
          <span class="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest mt-1 block">${t('neutralPhRange')}</span>
        </div>
      </div>

      <!-- Humidity Dial Card -->
      <div class="glass-card p-5 rounded-2xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999"></path></svg>
        </div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('airHumidity')}</span>
          <span class="text-xl font-black text-[var(--text-main)] block mt-0.5">${s.humidity}%</span>
          <span class="text-[9px] font-extrabold text-teal-400 uppercase tracking-widest mt-1 block">${t('transpirationActive')}</span>
        </div>
      </div>

      <!-- IoT Device Status Card -->
      <div class="glass-card p-5 rounded-2xl flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-400 status-pulse-online"></span>
        </div>
        <div>
          <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">${t('iotSensorNode')}</span>
          <span class="text-xs font-black text-[var(--text-main)] block mt-0.5">${t('statusConnected')}</span>
          <span class="text-[9px] text-[var(--text-muted)] block mt-1">MAC: 00:1A:2B:3C</span>
        </div>
      </div>

    </div>

    <!-- Charts and health circular layouts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Chart Left 2 columns -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Detailed Moisture Timeline -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('moistureTempTrends')}</h3>
          <div class="h-64 relative">
            <canvas id="monitoring-line-chart"></canvas>
          </div>
        </div>

        <!-- Nutrient Diagnostic Bars -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('npkNutritionalProfile')}</h3>
          <div class="h-64 relative">
            <canvas id="monitoring-bar-chart"></canvas>
          </div>
        </div>

      </div>

      <!-- Right 1 Column: circular health indicators and telemetry stats -->
      <div class="space-y-6">
        
        <!-- Circular Health Progress Widget -->        <div class="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-6">${t('soilHealthIndex')}</h3>
          
          <!-- SVG Circular progress indicator -->
          <div class="relative w-40 h-40 flex items-center justify-center">
            <svg class="w-full h-full radial-progress" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle class="text-gray-200 dark:text-emerald-950/20" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
              <!-- Foreground circle with dynamic stroke-dasharray -->
              <circle class="text-emerald-500 transition-all duration-1000" stroke-width="8" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * s.healthScore) / 100}" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-3xl font-black text-[var(--text-main)]">${s.healthScore}%</span>
              <span class="text-[9px] text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-0.5">${t('perfect')}</span>
            </div>
          </div>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed mt-6 max-w-xs">
            ${t('soilHealthReportDesc')}
          </p>
        </div>

        <!-- Live Telemetry Log stream -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('activityPanelTitle')}</h3>
          <div class="space-y-3.5">
            <div class="flex gap-3 text-xs leading-relaxed">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
              <div class="flex-1">
                <span class="text-[var(--text-main)] font-semibold">${currentLang === 'bn' ? 'সেন্সর নোড ম্যাক ক্যালিব্রেশন সম্পন্ন' : 'Sensor Node MAC calibration complete'}</span>
                <span class="text-[9px] text-[var(--text-muted)] font-bold block uppercase tracking-widest mt-0.5">${currentLang === 'bn' ? '২ মিনিট আগে' : '2 minutes ago'}</span>
              </div>
            </div>
            <div class="flex gap-3 text-xs leading-relaxed">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5"></span>
              <div class="flex-1">
                <span class="text-[var(--text-main)] font-semibold">${currentLang === 'bn' ? 'ডাটা প্যাকেট টেলিমিত্রি প্রেরণ: ২২টি রেকর্ড পাঠানো হয়েছে' : 'Data packet telemetry push: 22 records sent'}</span>
                <span class="text-[9px] text-[var(--text-muted)] font-bold block uppercase tracking-widest mt-0.5">${currentLang === 'bn' ? '১৪ মিনিট আগে' : '14 minutes ago'}</span>
              </div>
            </div>
            <div class="flex gap-3 text-xs leading-relaxed">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></span>
              <div class="flex-1">
                <span class="text-[var(--text-main)] font-semibold text-rose-400">${currentLang === 'bn' ? 'জোন বি-তে মাটির আর্দ্রতা থ্রেশহোল্ড হ্রাস পেয়েছে' : 'Soil moisture threshold drop in Zone B'}</span>
                <span class="text-[9px] text-[var(--text-muted)] font-bold block uppercase tracking-widest mt-0.5">${currentLang === 'bn' ? '৪২ মিনিট আগে' : '42 minutes ago'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach dynamic day/week/month filter listeners
  container.querySelector('#filter-day').addEventListener('click', () => {
    window.activeTimeFilter = 'day';
    renderMonitoringPage(container);
  });
  container.querySelector('#filter-week').addEventListener('click', () => {
    window.activeTimeFilter = 'week';
    renderMonitoringPage(container);
  });
  container.querySelector('#filter-month').addEventListener('click', () => {
    window.activeTimeFilter = 'month';
    renderMonitoringPage(container);
  });

  // Attach refreshing actions
  const monRefreshBtn = container.querySelector('#mon-refresh-btn');
  const monRefreshIcon = container.querySelector('#mon-refresh-icon');
  monRefreshBtn.addEventListener('click', () => {
    monRefreshBtn.disabled = true;
    monRefreshIcon.classList.add('animate-spin');
    
    setTimeout(() => {
      monRefreshBtn.disabled = false;
      monRefreshIcon.classList.remove('animate-spin');
      
      // Randomize values slightly for simulation
      window.appState.updateSensor('moisture', +(window.appState.sensors.moisture + (Math.random() - 0.5) * 2).toFixed(1));
      window.appState.updateSensor('temperature', +(window.appState.sensors.temperature + (Math.random() - 0.5) * 1).toFixed(1));
      window.appState.updateSensor('ph', +(window.appState.sensors.ph + (Math.random() - 0.5) * 0.1).toFixed(2));
      window.appState.updateSensor('humidity', +(window.appState.sensors.humidity + (Math.random() - 0.5) * 1.5).toFixed(1));
      
      window.appState.triggerToast('success', 'Soil sensors telemetries updated successfully.', 'মাটির সেন্সর ডাটা সফলভাবে আপডেট করা হয়েছে।');
      renderMonitoringPage(container); // Repaint
    }, 1000);
  });

  // Attach CSV exporting trigger
  container.querySelector('#mon-export-btn').addEventListener('click', () => {
    window.appState.triggerToast('info', 'Historic soil logs prepared! CSV download initialized.', 'ঐতিহাসিক মাটির লগ ফাইল প্রস্তুত! CSV ডাউনলোড শুরু হয়েছে।');
  });

  // Mount Chart.js figures
  initMonitoringCharts();
}

function initMonitoringCharts() {
  const lineCtx = document.getElementById('monitoring-line-chart');
  const barCtx = document.getElementById('monitoring-bar-chart');
  if (!lineCtx || !barCtx) return;

  const isDark = window.appState.theme === 'dark';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? 'rgba(52, 211, 153, 0.05)' : 'rgba(16, 185, 129, 0.08)';

  // Scale dataset according to the selected filter tab ('day', 'week', 'month')
  let maxHistory = 10;
  if (window.activeTimeFilter === 'week') maxHistory = 18;
  else if (window.activeTimeFilter === 'month') maxHistory = 28;

  const logs = [...window.mockData.historyLogs].slice(0, maxHistory).reverse();
  
  // Format dates appropriately
  const lineLabels = logs.map(l => {
    if (window.activeTimeFilter === 'day') {
      return l.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return l.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  });

  const moistureData = logs.map(l => l.moisture);
  const tempData = logs.map(l => l.temperature);

  // Clear previous line chart
  if (window.monLineInstance) window.monLineInstance.destroy();

  window.monLineInstance = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [
        {
          label: window.appState.language === 'bn' ? 'আর্দ্রতা (%)' : 'Moisture (%)',
          data: moistureData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderWidth: 3,
          tension: 0.45,
          fill: true
        },
        {
          label: window.appState.language === 'bn' ? 'তাপমাত্রা (°C)' : 'Temperature (°C)',
          data: tempData,
          borderColor: '#f97316',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.45,
          borderDash: [4, 4]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter', size: 10, weight: 'bold' } } }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 9 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 9 } }, min: 10, max: 95 }
      }
    }
  });

  // Clear previous NPK bar chart
  if (window.monBarInstance) window.monBarInstance.destroy();

  // NPK bar chart rendering
  const s = window.appState.sensors;
  window.monBarInstance = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: [
        window.appState.language === 'bn' ? 'নাইট্রোজেন (N)' : 'Nitrogen (N)',
        window.appState.language === 'bn' ? 'ফসফরাস (P)' : 'Phosphorus (P)',
        window.appState.language === 'bn' ? 'পটাশিয়াম (K)' : 'Potassium (K)'
      ],
      datasets: [{
        label: currentLang === 'bn' ? 'সক্রিয় মাত্রা (mg/kg)' : 'Active Levels (mg/kg)',
        data: [s.nitrogen, s.phosphorus, s.potassium],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)', // Green N
          'rgba(45, 212, 191, 0.75)', // Teal P
          'rgba(251, 146, 60, 0.75)'  // Orange K
        ],
        borderColor: [
          '#10b981',
          '#2dd4bf',
          '#fb923c'
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10, weight: 'bold' } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 9 } }, min: 0, max: 100 }
      }
    }
  });
}

window.renderMonitoringPage = renderMonitoringPage;
