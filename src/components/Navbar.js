// Navbar Component Generator
function renderNavbar(container) {
  if (!container) return;

  const t = window.i18n.t;
  const isDark = window.appState.theme === 'dark';
  const currentLang = window.appState.language;

  // If user is not logged in, hide navbar entirely
  if (!window.appState.isLoggedIn) {
    container.innerHTML = '';
    container.className = 'hidden';
    return;
  }

  // Navbar Layout Classes
  container.className = "sticky top-0 z-30 h-20 w-full glass-card border-b border-[var(--border-card)] shadow-sm px-6 flex items-center justify-between";
  container.id = "app-navbar";

  const unreadAlerts = window.appState.alerts.filter(a => !a.read);
  const activeAlertsCount = unreadAlerts.length;

  container.innerHTML = `
    <!-- Left: Mobile Toggle & Page Indicator -->
    <div class="flex items-center gap-4">
      <button id="mobile-sidebar-toggle" class="md:hidden p-2 rounded-xl text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 focus:outline-none transition-smooth">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <div class="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
        <span class="text-emerald-500">${t('projectTitle')}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <span class="text-[var(--text-main)] font-semibold uppercase tracking-wider">${t('nav' + window.appState.activePage.charAt(0).toUpperCase() + window.appState.activePage.slice(1))}</span>
      </div>
    </div>

    <!-- Right: Search, Language, Theme, Alerts, User Profile -->
    <div class="flex items-center gap-3.5 sm:gap-5">
      
      <!-- Home Button -->
      <button id="nav-home-btn" class="p-2.5 rounded-xl bg-gray-200/40 dark:bg-emerald-950/20 text-gray-500 hover:text-emerald-500 border border-[var(--border-card)] focus:outline-none transition-smooth" title="${currentLang === 'bn' ? 'হোম পেইজে যান' : 'Go to Home Page'}">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      </button>

      <!-- Language Switch (Toggle Pill) -->
      <div class="flex items-center bg-gray-200/50 dark:bg-emerald-950/20 p-1 rounded-xl border border-[var(--border-card)]">
        <button id="lang-en" class="px-2.5 py-1 text-xs font-bold rounded-lg transition-smooth ${
          currentLang === 'en' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }">EN</button>
        <button id="lang-bn" class="px-2.5 py-1 text-xs font-bold rounded-lg transition-smooth ${
          currentLang === 'bn' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }">বাং</button>
      </div>

      <!-- Theme Switch Icon -->
      <button id="theme-toggle" class="p-2.5 rounded-xl bg-gray-200/40 dark:bg-emerald-950/20 text-gray-500 hover:text-emerald-500 border border-[var(--border-card)] focus:outline-none transition-smooth">
        ${isDark 
          ? `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`
          : `<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`
        }
      </button>

      <!-- Alert Notification Bell Dropdown -->
      <div class="relative">
        <button id="alerts-dropdown-btn" class="relative p-2.5 rounded-xl bg-gray-200/40 dark:bg-emerald-950/20 text-gray-500 hover:text-emerald-500 border border-[var(--border-card)] focus:outline-none transition-smooth">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          ${activeAlertsCount > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          ` : ''}
        </button>

        <!-- Dropdown panel (Hidden initially) -->
        <div id="alerts-dropdown-panel" class="hidden absolute right-0 mt-3.5 w-80 sm:w-96 glass-card rounded-2xl shadow-xl border border-[var(--border-card)] py-4 overflow-hidden flex flex-col">
          <div class="px-5 pb-3 border-b border-[var(--border-card)] flex items-center justify-between">
            <span class="font-bold text-sm text-[var(--text-main)]">${t('recentAlertsTitle')} (${activeAlertsCount})</span>
            ${activeAlertsCount > 0 ? `
              <button id="dismiss-all-alerts" class="text-xs text-rose-400 hover:text-rose-500 font-semibold transition-colors focus:outline-none">
                ${t('btnDismissAll')}
              </button>
            ` : ''}
          </div>
          <div class="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-[var(--border-card)]/50">
            ${unreadAlerts.length === 0 ? `
              <div class="py-10 px-5 text-center text-xs text-[var(--text-muted)]">
                <svg class="w-8 h-8 text-emerald-500/35 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ${t('noAlerts')}
              </div>
            ` : unreadAlerts.map(alert => {
              const bgBadge = alert.type === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : alert.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
              const text = currentLang === 'bn' ? alert.messageBn : alert.messageEn;
              return `
                <div class="p-4 hover:bg-emerald-500/5 transition-colors flex gap-3 text-xs">
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <span class="px-2 py-0.5 rounded text-[9px] font-bold ${bgBadge}">
                        ${alert.type.toUpperCase()}
                      </span>
                      <span class="text-[10px] text-[var(--text-muted)]">${new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p class="text-[var(--text-main)] font-medium leading-relaxed">${text}</p>
                  </div>
                  <button data-dismiss-alert="${alert.id}" class="self-start p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors focus:outline-none">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
          <div class="px-5 pt-3 border-t border-[var(--border-card)] text-center">
            <button id="alert-view-all-btn" class="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
              ${t('btnDetails')} (${t('navAlerts')})
            </button>
          </div>
        </div>
      </div>

      <!-- User Profile Thumbnail -->
      <div class="flex items-center gap-3 border-l border-[var(--border-card)] pl-4">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-white text-sm shadow-sm">
          F
        </div>
        <div class="hidden lg:block text-left">
          <h4 class="text-xs font-bold text-[var(--text-main)] leading-none">${currentLang === 'bn' ? 'কৃষক আবদুর রহমান' : 'Farmer Abdur Rahman'}</h4>
          <span class="text-[10px] text-[var(--text-muted)] font-medium">${currentLang === 'bn' ? 'কুমিল্লা কৃষি-স্টেশন' : 'Cumilla Ag-Station'}</span>
        </div>
      </div>

    </div>
  `;

  // Attach button triggers
  const mobileToggle = container.querySelector('#mobile-sidebar-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('app-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
      }
    });
  }

  // Language Change Trigger
  container.querySelector('#lang-en').addEventListener('click', () => {
    window.appState.setLanguage('en');
  });
  container.querySelector('#lang-bn').addEventListener('click', () => {
    window.appState.setLanguage('bn');
  });

  // Home Button Trigger
  const navHomeBtn = container.querySelector('#nav-home-btn');
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => {
      window.appState.setPage('landing');
    });
  }

  // Theme Toggle Trigger
  container.querySelector('#theme-toggle').addEventListener('click', () => {
    const nextTheme = window.appState.theme === 'dark' ? 'light' : 'dark';
    window.appState.setTheme(nextTheme);
  });

  // Alerts Dropdown Toggle
  const dropdownBtn = container.querySelector('#alerts-dropdown-btn');
  const dropdownPanel = container.querySelector('#alerts-dropdown-panel');
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownPanel.classList.toggle('hidden');
  });

  // Dismiss Individual Alert
  const dismissAlertBtns = container.querySelectorAll('[data-dismiss-alert]');
  dismissAlertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const alertId = btn.getAttribute('data-dismiss-alert');
      window.appState.dismissAlert(alertId);
    });
  });

  // Dismiss All Alerts
  const dismissAllBtn = container.querySelector('#dismiss-all-alerts');
  if (dismissAllBtn) {
    dismissAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.appState.clearAllAlerts();
    });
  }

  // Alerts View All Redirect
  container.querySelector('#alert-view-all-btn').addEventListener('click', () => {
    window.appState.setPage('alerts');
  });

  // Click outside to close notification dropdown panel
  document.addEventListener('click', () => {
    if (dropdownPanel && !dropdownPanel.classList.contains('hidden')) {
      dropdownPanel.classList.add('hidden');
    }
  });
}

window.renderNavbar = renderNavbar;
