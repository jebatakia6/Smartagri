// Landing / Project Home Page View
function renderLandingPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;
  const isDark = window.appState.theme === 'dark';
  const s = window.appState.sensors;
  const isLoggedIn = window.appState.isLoggedIn;
  
  const launchText = t('btnSignIn');
  
  const heroLaunchText = t('landingCTA');

  // Outer container setup
  // Apply base visual styles (router handles display/visibility)
  container.style.backgroundColor = 'var(--bg-primary)';
  container.style.color = 'var(--text-main)';
  container.style.position = 'relative';
  container.style.overflowY = 'auto';
  container.style.overflowX = 'hidden';
  container.style.height = '100vh';


  
  // Renders the entire Landing HTML shell
  container.innerHTML = `
    <!-- Top Decorative Blur Elements -->
    <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute top-[20%] -right-40 w-[500px] h-[500px] rounded-full bg-teal-400/5 blur-[120px] pointer-events-none"></div>

    <!-- 1. Hero Sticky Navbar -->
    <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-card)]/50 transition-smooth">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <!-- Logo Branding -->
        <div class="flex items-center gap-2.5 cursor-pointer" id="nav-brand-logo">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
            <svg class="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h1 class="font-extrabold text-sm tracking-wide uppercase text-[var(--text-main)]">${t('projectTitle')}</h1>
            <span class="text-[9px] text-emerald-500 font-bold uppercase tracking-widest block">${t('statusConnected')}</span>
          </div>
        </div>

        <!-- Navigation Links (Desktop) -->
        <nav class="hidden md:flex items-center gap-8 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
          <a href="#hero-section" class="hover:text-emerald-500 transition-colors">${t('navHome')}</a>
          <a href="#features-section" class="hover:text-emerald-500 transition-colors">${t('navFeatures')}</a>
          <a href="#stats-section" class="hover:text-emerald-500 transition-colors">${t('navTechStack')}</a>
        </nav>

        <!-- Right: Lang, Theme, and Console Button -->
        <div class="flex items-center gap-4">
          <!-- Language Toggle -->
          <div class="flex items-center bg-gray-200/50 dark:bg-emerald-950/20 p-0.5 rounded-xl border border-[var(--border-card)]">
            <button id="landing-lang-en" class="px-2 py-1 text-[10px] font-bold rounded-lg transition-smooth ${
              currentLang === 'en' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }">EN</button>
            <button id="landing-lang-bn" class="px-2 py-1 text-[10px] font-bold rounded-lg transition-smooth ${
              currentLang === 'bn' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }">বাং</button>
          </div>

          <!-- Theme Switcher -->
          <button id="landing-theme-toggle" class="p-2 rounded-xl bg-gray-200/40 dark:bg-emerald-950/20 text-gray-500 hover:text-emerald-500 border border-[var(--border-card)] focus:outline-none transition-smooth">
            ${isDark 
              ? `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`
              : `<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`
            }
          </button>

          <!-- Launch Console Button Dropdown Container or Profile -->
          ${isLoggedIn ? `
            <!-- User Profile Thumbnail (shown when logged in) -->
            <div class="flex items-center gap-3 border-l border-[var(--border-card)] pl-4 cursor-pointer" id="landing-profile-redirect" title="${currentLang === 'bn' ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard'}">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-white text-sm shadow-sm shrink-0">
                F
              </div>
              <div class="hidden sm:block text-left">
                <h4 class="text-xs font-bold text-[var(--text-main)] leading-none">${currentLang === 'bn' ? 'কৃষক আবদুর রহমান' : 'Farmer Abdur Rahman'}</h4>
                <span class="text-[9px] text-[var(--text-muted)] font-medium block mt-0.5">${currentLang === 'bn' ? 'কুমিল্লা কৃষি-স্টেশন' : 'Cumilla Ag-Station'}</span>
              </div>
            </div>
          ` : `
            <div class="relative inline-block text-left" id="landing-auth-dropdown">
              <button id="landing-launch-btn" class="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-smooth focus:outline-none flex items-center gap-2">
                <span>${launchText}</span>
                <svg class="w-4 h-4 transition-transform duration-200" id="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown Menu Box -->
              <div id="landing-launch-dropdown" class="hidden absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-[var(--border-card)] shadow-xl p-5 z-50 text-center space-y-4">
                <button id="dropdown-signin-btn" class="w-full px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase transition-smooth focus:outline-none shadow-md">
                  ${launchText}
                </button>
                <div class="text-xs text-[var(--text-muted)] font-bold">
                  ${currentLang === 'bn' ? 'অথবা' : 'or'} 
                  <a href="#" id="dropdown-register-btn" class="text-emerald-500 hover:text-emerald-600 hover:underline ml-1">
                    ${currentLang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
                  </a>
                </div>
              </div>
            </div>
          `}
        </div>

      </div>
    </header>

    <!-- 2. Hero Section -->
    <section id="hero-section" class="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Left Hero Column -->
      <div class="space-y-6 lg:space-y-8 text-center lg:text-left">
        <span class="px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 uppercase inline-block animate-pulse">
          🌾 Final Year Project 2026
        </span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-wide text-[var(--text-main)]">
          ${t('landingTitle')}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
          ${t('landingDesc')}
        </p>
        
        <!-- CTA buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <button id="hero-launch-btn" class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-widest uppercase shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/25 active:scale-98 transition-smooth focus:outline-none">
            ${heroLaunchText}
          </button>
          <a href="#features-section" class="w-full sm:w-auto text-center px-7 py-4 rounded-2xl border border-[var(--border-card)] hover:bg-emerald-500/5 text-[var(--text-main)] font-extrabold text-xs tracking-widest uppercase transition-smooth">
            ${t('landingCTA2')}
          </a>
        </div>
      </div>

      <!-- Right Hero Column (Interactive Telemetry Live Preview) -->
      <div class="flex justify-center items-center">
        <div class="glass-card p-6 sm:p-8 rounded-[36px] w-full max-w-md border border-[var(--border-card)] shadow-2xl relative group overflow-hidden">
          <div class="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-colors pointer-events-none"></div>
          
          <div class="flex justify-between items-center pb-4 mb-6 border-b border-[var(--border-card)]/50">
            <h3 class="text-xs font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 status-pulse-online"></span>
              ${t('liveSensorTitle')}
            </h3>
            <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Active Node #01</span>
          </div>

          <!-- Real-Time Metrics Dials -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Moisture dial -->
            <div class="p-4 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)] hover:border-emerald-500/25 transition-smooth">
              <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('sensorMoisture')}</span>
              <span id="landing-metric-moisture" class="text-xl font-black text-blue-500 block mt-1.5">${s.moisture}%</span>
            </div>
            <!-- pH dial -->
            <div class="p-4 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)] hover:border-emerald-500/25 transition-smooth">
              <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('sensorPH')}</span>
              <span id="landing-metric-ph" class="text-xl font-black text-emerald-500 block mt-1.5">${s.ph}</span>
            </div>
            <!-- Temp dial -->
            <div class="p-4 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)] hover:border-emerald-500/25 transition-smooth">
              <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('sensorTemp')}</span>
              <span id="landing-metric-temp" class="text-xl font-black text-orange-500 block mt-1.5">${s.temperature}°C</span>
            </div>
            <!-- Health Score -->
            <div class="p-4 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)] hover:border-emerald-500/25 transition-smooth">
              <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('sensorHealth')}</span>
              <span id="landing-metric-health" class="text-xl font-black text-teal-400 block mt-1.5">${s.healthScore}%</span>
            </div>
          </div>

          <!-- NPK status preview -->
          <div class="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] space-y-1.5 font-semibold text-[var(--text-main)]">
            <span class="text-[9px] text-emerald-500 font-extrabold uppercase tracking-widest block">${t('npkStatus')}</span>
            <div class="flex justify-between items-center">
              <span>Nitrogen (N)</span>
              <span class="font-bold text-emerald-500">${s.nitrogen} mg/kg</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Phosphorus (P)</span>
              <span class="font-bold text-teal-400">${s.phosphorus} mg/kg</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Potassium (K)</span>
              <span class="font-bold text-orange-400">${s.potassium} mg/kg</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Features Section -->
    <section id="features-section" class="w-full bg-gray-200/20 dark:bg-emerald-950/5 border-y border-[var(--border-card)]/50 py-16 lg:py-24 relative z-10">
      <div class="max-w-7xl mx-auto px-6 space-y-12">
        <div class="text-center space-y-3 max-w-xl mx-auto">
          <h2 class="text-2xl lg:text-3xl font-black text-[var(--text-main)] uppercase tracking-wide">
            ${t('landingFeaturesTitle')}
          </h2>
          <p class="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
            ${t('landingFeaturesSubtitle')}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="glass-card p-6 rounded-3xl border border-[var(--border-card)] space-y-4 hover:-translate-y-1 transition-smooth">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl text-emerald-500">
              📡
            </div>
            <h3 class="text-sm font-extrabold text-[var(--text-main)] uppercase tracking-wider">${t('landingFeature1Title')}</h3>
            <p class="text-xs text-[var(--text-muted)] font-medium leading-relaxed">${t('landingFeature1Desc')}</p>
          </div>

          <!-- Feature 2 -->
          <div class="glass-card p-6 rounded-3xl border border-[var(--border-card)] space-y-4 hover:-translate-y-1 transition-smooth">
            <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl text-teal-400">
              🧠
            </div>
            <h3 class="text-sm font-extrabold text-[var(--text-main)] uppercase tracking-wider">${t('landingFeature2Title')}</h3>
            <p class="text-xs text-[var(--text-muted)] font-medium leading-relaxed">${t('landingFeature2Desc')}</p>
          </div>

          <!-- Feature 3 -->
          <div class="glass-card p-6 rounded-3xl border border-[var(--border-card)] space-y-4 hover:-translate-y-1 transition-smooth">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xl text-sky-400">
              🚰
            </div>
            <h3 class="text-sm font-extrabold text-[var(--text-main)] uppercase tracking-wider">${t('landingFeature3Title')}</h3>
            <p class="text-xs text-[var(--text-muted)] font-medium leading-relaxed">${t('landingFeature3Desc')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Statistics Metrics Highlight Section -->
    <section id="stats-section" class="max-w-7xl w-full mx-auto px-6 py-16 lg:py-24 space-y-12 relative z-10">
      <div class="text-center space-y-3 max-w-xl mx-auto">
        <h2 class="text-2xl lg:text-3xl font-black text-[var(--text-main)] uppercase tracking-wide">
          ${t('landingStatsTitle')}
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Stat 1 -->
        <div class="glass-card p-8 rounded-3xl border border-[var(--border-card)] text-center space-y-2">
          <span class="text-3xl sm:text-4xl font-black text-emerald-500 block">98.4%</span>
          <span class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider block">${t('landingStat1')}</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed block">Tested against local regional soil data sheets</span>
        </div>
        <!-- Stat 2 -->
        <div class="glass-card p-8 rounded-3xl border border-[var(--border-card)] text-center space-y-2">
          <span class="text-3xl sm:text-4xl font-black text-teal-400 block">35%</span>
          <span class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider block">${t('landingStat2')}</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed block">Conserved by threshold pump triggers</span>
        </div>
        <!-- Stat 3 -->
        <div class="glass-card p-8 rounded-3xl border border-[var(--border-card)] text-center space-y-2">
          <span class="text-3xl sm:text-4xl font-black text-orange-400 block">&lt; 2.5s</span>
          <span class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider block">${t('landingStat3')}</span>
          <span class="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed block">Push intervals between soil node and dashboard console</span>
        </div>
      </div>
    </section>

    <!-- 6. Footer -->
    <footer class="w-full py-8 border-t border-[var(--border-card)]/50 bg-[var(--bg-primary)] text-center relative z-10 transition-smooth">
      <div class="max-w-7xl mx-auto px-6 text-[10px] text-[var(--text-muted)] font-bold tracking-wider uppercase flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>${t('landingFooter')}</span>
        <span>Version 1.0.0 Production Console</span>
      </div>
    </footer>
  `;

  // Attach language toggle handlers
  container.querySelector('#landing-lang-en').addEventListener('click', () => {
    window.appState.setLanguage('en');
  });
  container.querySelector('#landing-lang-bn').addEventListener('click', () => {
    window.appState.setLanguage('bn');
  });

  // Attach theme switcher
  container.querySelector('#landing-theme-toggle').addEventListener('click', () => {
    const nextTheme = window.appState.theme === 'dark' ? 'light' : 'dark';
    window.appState.setTheme(nextTheme);
  });

  // Attach Launch Console actions for Dropdown
  const landingLaunchBtn = container.querySelector('#landing-launch-btn');
  const landingLaunchDropdown = container.querySelector('#landing-launch-dropdown');
  const dropdownArrow = container.querySelector('#dropdown-arrow');

  if (landingLaunchBtn && landingLaunchDropdown) {
    landingLaunchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = landingLaunchDropdown.classList.contains('hidden');
      if (isHidden) {
        landingLaunchDropdown.classList.remove('hidden');
        if (dropdownArrow) dropdownArrow.style.transform = 'rotate(180deg)';
      } else {
        landingLaunchDropdown.classList.add('hidden');
        if (dropdownArrow) dropdownArrow.style.transform = 'rotate(0deg)';
      }
    });

    // Click outside to close dropdown
    document.addEventListener('click', (e) => {
      if (!landingLaunchDropdown.contains(e.target) && e.target !== landingLaunchBtn && !landingLaunchBtn.contains(e.target)) {
        landingLaunchDropdown.classList.add('hidden');
        if (dropdownArrow) dropdownArrow.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Inside Dropdown Sign In Button
  const dropdownSigninBtn = container.querySelector('#dropdown-signin-btn');
  if (dropdownSigninBtn) {
    dropdownSigninBtn.addEventListener('click', () => {
      window.appState.setPage('login');
    });
  }

  // Inside Dropdown Register/Create Account link
  const dropdownRegisterBtn = container.querySelector('#dropdown-register-btn');
  if (dropdownRegisterBtn) {
    dropdownRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.appState.setPage('register');
    });
  }

  // Hero launch CTA
  container.querySelector('#hero-launch-btn').addEventListener('click', () => {
    window.appState.setPage(window.appState.isLoggedIn ? 'dashboard' : 'login');
  });

  // Redirect to Dashboard if Profile clicked
  const landingProfileRedirect = container.querySelector('#landing-profile-redirect');
  if (landingProfileRedirect) {
    landingProfileRedirect.addEventListener('click', () => {
      window.appState.setPage('dashboard');
    });
  }

  // Real-time telemetry subscription to update dials dynamically on landing page!
  const unsub = window.appState.subscribe((event, data) => {
    if (event === 'sensorUpdate') {
      const metricMoisture = container.querySelector('#landing-metric-moisture');
      const metricPh = container.querySelector('#landing-metric-ph');
      const metricTemp = container.querySelector('#landing-metric-temp');
      const metricHealth = container.querySelector('#landing-metric-health');

      if (metricMoisture) metricMoisture.innerText = `${data.moisture}%`;
      if (metricPh) metricPh.innerText = data.ph;
      if (metricTemp) metricTemp.innerText = `${data.temperature}°C`;
      if (metricHealth) metricHealth.innerText = `${data.healthScore}%`;
    }
  });

  // Store unsub callback in container node to clear event listeners when removed (prevents memory leak)
  container.unsubFromState = unsub;
}

window.renderLandingPage = renderLandingPage;
