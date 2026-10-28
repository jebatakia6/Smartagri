// Settings & Node Calibration Page View
function renderSettingsPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;
  const currentTheme = window.appState.theme;

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
        ${t('navSettings')}
      </h1>
      <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
        ${t('settingsDesc')}
      </p>
    </div>

    <!-- Main Settings Form Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left 2 Columns: Config Panels -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Profile Config -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('profileSection')}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('nameLabel')}</label>
              <input type="text" id="set-profile-name" value="Farmer Abdur Rahman" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('locationLabel')}</label>
              <input type="text" id="set-profile-loc" value="Cumilla Agronomy District, Zone A" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
            </div>
          </div>
        </div>

        <!-- Node & Calibration Config -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('deviceSection')} ${currentLang === 'bn' ? 'সেটিংস' : 'Settings'}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('deviceID')}</label>
              <input type="text" readonly value="00:1A:2B:3C:4D:5E" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-gray-200/50 dark:bg-emerald-950/20 text-[var(--text-muted)] text-xs font-mono focus:outline-none">
            </div>
            <div>
              <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('connectionInterval')}</label>
              <select class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
                <option value="5">${t('settingsTelemetryInterval5s')}</option>
                <option value="60">${t('settingsTelemetryInterval1m')}</option>
                <option value="900">${t('settingsTelemetryInterval15m')}</option>
                <option value="3600">${t('settingsTelemetryInterval1h')}</option>
              </select>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 class="text-xs font-bold text-[var(--text-main)]">${t('calibrateSection')}</h4>
              <p class="text-[10px] text-[var(--text-muted)] mt-1">${t('settingsCalibDesc')}</p>
            </div>
            <button id="set-calibrate-btn" class="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-smooth focus:outline-none">
              ⚙️ ${t('btnCalibrate')}
            </button>
          </div>
        </div>

        <!-- Notification Warning Preferences -->
        <div class="glass-card p-6 rounded-3xl">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('settingsWarningThresholds')}</h3>
          <div class="space-y-4 text-xs font-semibold text-[var(--text-main)]">
            <!-- T 1 -->
            <div class="flex items-center justify-between">
              <div>
                <h4>${t('settingsMoistureTitle')}</h4>
                <p class="text-[9px] text-[var(--text-muted)] font-medium mt-0.5">${t('settingsMoistureDesc')}</p>
              </div>
              <input type="checkbox" checked class="h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
            </div>
            <!-- T 2 -->
            <div class="flex items-center justify-between border-t border-[var(--border-card)]/50 pt-4">
              <div>
                <h4>${t('settingsTempTitle')}</h4>
                <p class="text-[9px] text-[var(--text-muted)] font-medium mt-0.5">${t('settingsTempDesc')}</p>
              </div>
              <input type="checkbox" checked class="h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
            </div>
            <!-- T 3 -->
            <div class="flex items-center justify-between border-t border-[var(--border-card)]/50 pt-4">
              <div>
                <h4>${t('settingsPhTitle')}</h4>
                <p class="text-[9px] text-[var(--text-muted)] font-medium mt-0.5">${t('settingsPhDesc')}</p>
              </div>
              <input type="checkbox" checked class="h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
            </div>
          </div>
        </div>

      </div>

      <!-- Right 1 Column: Language & Theme Config Cards -->
      <div class="space-y-6">
        
        <!-- App Settings Config -->
        <div class="glass-card p-6 rounded-3xl space-y-5">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('settingsLocalizationPreferences')}</h3>
          
          <!-- Lang Selector -->
          <div class="space-y-2">
            <span class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">${t('langSelect')}</span>
            <div class="flex items-center bg-gray-200/50 dark:bg-emerald-950/20 p-1.5 rounded-2xl border border-[var(--border-card)]">
              <button id="set-lang-en" class="flex-1 py-2 text-xs font-bold rounded-xl transition-smooth ${
                currentLang === 'en' ? 'bg-emerald-500 text-white shadow' : 'text-[var(--text-muted)]'
              }">English (EN)</button>
              <button id="set-lang-bn" class="flex-1 py-2 text-xs font-bold rounded-xl transition-smooth ${
                currentLang === 'bn' ? 'bg-emerald-500 text-white shadow' : 'text-[var(--text-muted)]'
              }">বাংলা (BN)</button>
            </div>
          </div>

          <!-- Theme Selector -->
          <div class="space-y-2">
            <span class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">${t('themeLabel')}</span>
            <select id="set-theme-select" class="w-full px-4 py-3 rounded-2xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
              <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>${t('themeLight')}</option>
              <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>${t('themeDark')}</option>
            </select>
          </div>
        </div>

        <!-- Action Card -->
        <div class="glass-card p-6 rounded-3xl flex flex-col gap-3">
          <h4 class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wide">${t('settingsSaveConfig')}</h4>
          <p class="text-[10px] text-[var(--text-muted)] leading-relaxed">${t('settingsSaveConfigDesc')}</p>
          <button id="set-save-btn" class="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-smooth focus:outline-none">
            💾 ${t('btnSaveSettings')}
          </button>
        </div>

      </div>

    </div>
  `;

  // Attach calibration modal trigger
  container.querySelector('#set-calibrate-btn').addEventListener('click', () => {
    window.appState.openModal('calibrate');
  });

  // Attach language triggers
  container.querySelector('#set-lang-en').addEventListener('click', () => {
    window.appState.setLanguage('en');
    renderSettingsPage(container); // Repaint settings
  });
  container.querySelector('#set-lang-bn').addEventListener('click', () => {
    window.appState.setLanguage('bn');
    renderSettingsPage(container); // Repaint settings
  });

  // Attach theme trigger
  const themeSelect = container.querySelector('#set-theme-select');
  themeSelect.addEventListener('change', (e) => {
    window.appState.setTheme(e.target.value);
  });

  // Save Settings
  container.querySelector('#set-save-btn').addEventListener('click', () => {
    const newName = container.querySelector('#set-profile-name').value || 'Farmer Abdur Rahman';
    window.appState.triggerToast('success', 
      `Profile saved! Welcome ${newName}. Configuration cached successfully.`,
      `কৃষক প্রোফাইল সংরক্ষিত! স্বাগতম ${newName}। সেটিংস সংরক্ষণ করা হয়েছে।`
    );
  });
}

window.renderSettingsPage = renderSettingsPage;
