// Sidebar Component Generator
function renderSidebar(container) {
  if (!container) return;

  const currentTab = window.appState.activePage;
  const t = window.i18n.t;

  // If user is not logged in, hide sidebar entirely
  if (!window.appState.isLoggedIn) {
    container.innerHTML = '';
    container.className = 'hidden';
    return;
  }

  // Sidebar structure (responsive classes)
  container.className = "fixed inset-y-0 left-0 z-40 w-64 bg-[var(--bg-sidebar)] text-gray-300 transition-transform duration-300 transform md:translate-x-0 -translate-x-full md:sticky md:h-screen flex flex-col border-r border-emerald-950";
  container.id = "app-sidebar";

  // Navigation Links configuration
  const menuItems = [
    { id: 'landing', labelKey: 'navHome', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>` },
    { id: 'dashboard', labelKey: 'navDashboard', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>` },
    { id: 'monitoring', labelKey: 'navMonitoring', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"></path></svg>` },
    { id: 'recommendation', labelKey: 'navCropRecommendation', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>` },
    { id: 'fertilizer', labelKey: 'navFertilizer', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>` },
    { id: 'alerts', labelKey: 'navAlerts', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>` },
    { id: 'history', labelKey: 'navHistory', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
    { id: 'weather', labelKey: 'navWeather', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>` },
    { id: 'settings', labelKey: 'navSettings', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>` },
    { id: 'testpanel', labelKey: 'navTestPanel', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"></path></svg>` }
  ];

  // Map active warnings count
  const activeAlerts = window.appState.alerts.filter(a => !a.read).length;

  container.innerHTML = `
    <!-- Top Brand Area -->
    <div class="h-20 flex items-center justify-between px-6 border-b border-emerald-950/60 bg-emerald-950/20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div>
          <h2 class="font-extrabold text-white text-base tracking-wide uppercase">${t('projectTitle')}</h2>
          <span class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse-online"></span>
            ${t('statusConnected')}
          </span>
        </div>
      </div>
      <!-- Mobile Close Trigger -->
      <button id="mobile-sidebar-close" class="md:hidden text-gray-400 hover:text-white transition-colors focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Navigation Menu Items -->
    <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
      ${menuItems.map(item => {
        const isActive = currentTab === item.id;
        const isAlerts = item.id === 'alerts';
        return `
          <button data-page="${item.id}" class="sidebar-link w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-smooth group text-left ${
            isActive 
              ? 'bg-emerald-500/10 text-emerald-400 active' 
              : 'text-gray-400 hover:bg-emerald-950/30 hover:text-gray-100'
          }">
            <div class="flex items-center gap-3.5 text-left">
              <span class="${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400 transition-colors'}">
                ${item.icon}
              </span>
              <span class="text-left">${t(item.labelKey)}</span>
            </div>
            ${isAlerts && activeAlerts > 0 ? `
              <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white animate-bounce">
                ${activeAlerts}
              </span>
            ` : ''}
          </button>
        `;
      }).join('')}
    </nav>

    <!-- Footer - Logout Area -->
    <div class="p-4 border-t border-emerald-950/60 bg-emerald-950/10">
      <button id="sidebar-logout" class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-smooth group text-left">
        <svg class="w-5 h-5 text-rose-400/70 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span class="text-left">${t('navLogout')}</span>
      </button>
    </div>
  `;

  // Attach button triggers
  const links = container.querySelectorAll('[data-page]');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const page = link.getAttribute('data-page');
      window.appState.setPage(page);
      
      // Auto-close drawer on mobile
      const sidebar = document.getElementById('app-sidebar');
      if (sidebar) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });

  // Logout Trigger
  const logoutBtn = container.querySelector('#sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.appState.logout();
    });
  }

  // Mobile Drawer Close Trigger
  const closeBtn = container.querySelector('#mobile-sidebar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.classList.add('-translate-x-full');
    });
  }
}

window.renderSidebar = renderSidebar;
