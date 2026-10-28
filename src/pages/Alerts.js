// Alerts & Notifications Page View
function renderAlertsPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;

  // Track active severity filter ('all', 'danger', 'warning', 'info')
  if (!window.activeAlertFilter) {
    window.activeAlertFilter = 'all';
  }

  // Filter alerts from global state
  let alerts = window.appState.alerts;
  if (window.activeAlertFilter !== 'all') {
    alerts = alerts.filter(a => a.type === window.activeAlertFilter);
  }

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Header & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          ${t('navAlerts')}
        </h1>
        <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
          ${t('alertsSubtitle')}
        </p>
      </div>

      <!-- Action buttons -->
      ${window.appState.alerts.length > 0 ? `
        <button id="alerts-clear-all" class="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-98 transition-smooth focus:outline-none">
          🗑️ ${t('btnDismissAll')}
        </button>
      ` : ''}
    </div>

    <!-- Severity Filter Tabs -->
    <div class="flex items-center gap-2.5 bg-gray-200/40 dark:bg-emerald-950/20 p-1.5 rounded-2xl border border-[var(--border-card)] w-fit">
      <button id="alert-tab-all" class="px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
        window.activeAlertFilter === 'all' ? 'bg-emerald-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
      }">${t('alertsTabAll')} (${window.appState.alerts.length})</button>
      <button id="alert-tab-danger" class="px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
        window.activeAlertFilter === 'danger' ? 'bg-rose-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
      }">${t('alertsTabCritical')} (${window.appState.alerts.filter(a => a.type === 'danger').length})</button>
      <button id="alert-tab-warning" class="px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
        window.activeAlertFilter === 'warning' ? 'bg-amber-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
      }">${t('alertsTabWarnings')} (${window.appState.alerts.filter(a => a.type === 'warning').length})</button>
      <button id="alert-tab-info" class="px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
        window.activeAlertFilter === 'info' ? 'bg-blue-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
      }">${t('alertsTabInfo')} (${window.appState.alerts.filter(a => a.type === 'info').length})</button>
    </div>

    <!-- Alerts List Feed -->
    <div class="space-y-4">
      ${alerts.length === 0 ? `
        <!-- Empty State -->
        <div class="glass-card p-16 rounded-3xl flex flex-col items-center justify-center text-center border-dashed border-2 border-[var(--border-card)]">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-base font-extrabold text-[var(--text-main)] uppercase tracking-wider">${t('alertsEmptyState')}</h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed mt-2 max-w-sm">
            ${t('alertsEmptyDesc')}
          </p>
        </div>
      ` : alerts.map(alert => {
        const text = currentLang === 'bn' ? alert.messageBn : alert.messageEn;
        
        let severityClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        let severityLabel = currentLang === 'bn' ? 'তথ্য' : 'INFO';
        let icon = 'ℹ️';

        if (alert.type === 'danger') {
          severityClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
          severityLabel = currentLang === 'bn' ? 'গুরুত্বপূর্ণ' : 'CRITICAL';
          icon = '🚨';
        } else if (alert.type === 'warning') {
          severityClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
          severityLabel = currentLang === 'bn' ? 'সতর্কতা' : 'WARNING';
          icon = '⚠️';
        } else if (alert.type === 'success') {
          severityClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
          severityLabel = currentLang === 'bn' ? 'সফল' : 'SUCCESS';
          icon = '✅';
        }

        return `
          <div class="glass-card p-5 rounded-3xl flex items-start gap-4 border border-[var(--border-card)] relative hover:border-emerald-500/20 group">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
              alert.type === 'danger' ? 'bg-rose-500/10 text-rose-500' : alert.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
            }">
              ${icon}
            </div>

            <div class="flex-1 space-y-1.5 pr-8">
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded text-[8px] font-black tracking-wider ${severityClass}">
                  ${severityLabel}
                </span>
                <span class="text-[10px] text-[var(--text-muted)] font-semibold">
                  ${new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p class="text-xs font-semibold text-[var(--text-main)] leading-relaxed">
                ${text}
              </p>
            </div>

            <!-- Dismiss button -->
            <button data-dismiss-alert-page="${alert.id}" class="absolute top-5 right-5 p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-smooth focus:outline-none shrink-0" title="${t('btnDismiss')}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach tab filter actions
  container.querySelector('#alert-tab-all').addEventListener('click', () => {
    window.activeAlertFilter = 'all';
    renderAlertsPage(container);
  });
  container.querySelector('#alert-tab-danger').addEventListener('click', () => {
    window.activeAlertFilter = 'danger';
    renderAlertsPage(container);
  });
  container.querySelector('#alert-tab-warning').addEventListener('click', () => {
    window.activeAlertFilter = 'warning';
    renderAlertsPage(container);
  });
  container.querySelector('#alert-tab-info').addEventListener('click', () => {
    window.activeAlertFilter = 'info';
    renderAlertsPage(container);
  });

  // Attach Dismiss Individual trigger
  container.querySelectorAll('[data-dismiss-alert-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dismiss-alert-page');
      window.appState.dismissAlert(id);
      renderAlertsPage(container); // Repaint
    });
  });

  // Dismiss All trigger
  const clearBtn = container.querySelector('#alerts-clear-all');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      window.appState.clearAllAlerts();
      renderAlertsPage(container);
    });
  }
}

window.renderAlertsPage = renderAlertsPage;
