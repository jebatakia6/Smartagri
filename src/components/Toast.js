// Toast Alert Component
function initToastContainer() {
  let container = document.getElementById('toast-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-notification-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0';
    document.body.appendChild(container);
  }
  return container;
}

function showToastNotification(toast) {
  const container = initToastContainer();
  if (!toast) return;

  const currentLang = window.appState.language;
  const message = currentLang === 'bn' ? toast.messageBn || toast.textBn : toast.messageEn || toast.textEn;

  // Create toast element
  const toastEl = document.createElement('div');
  toastEl.className = 'pointer-events-auto flex items-center gap-3 p-4 rounded-2xl glass-card shadow-2xl border border-[var(--border-card)] transform translate-y-10 opacity-0 transition-smooth scale-95';
  
  // Custom theme colors for alerts
  let iconColor = 'text-emerald-400 bg-emerald-500/10';
  let svgIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  
  if (toast.type === 'danger') {
    iconColor = 'text-rose-400 bg-rose-500/10';
    svgIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  } else if (toast.type === 'warning') {
    iconColor = 'text-amber-400 bg-amber-500/10';
    svgIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  } else if (toast.type === 'info') {
    iconColor = 'text-sky-400 bg-sky-500/10';
    svgIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  toastEl.innerHTML = `
    <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}">
      ${svgIcon}
    </div>
    <div class="flex-1 text-xs font-semibold text-[var(--text-main)] pr-2 leading-relaxed">
      ${message}
    </div>
    <button class="toast-close-btn p-1 text-[var(--text-muted)] hover:text-emerald-500 transition-colors focus:outline-none shrink-0">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  container.appendChild(toastEl);

  // Trigger Slide In
  setTimeout(() => {
    toastEl.classList.remove('translate-y-10', 'opacity-0', 'scale-95');
  }, 50);

  // Auto-Dismiss after 4.5 seconds
  const dismissTimer = setTimeout(() => {
    dismissToastEl(toastEl);
  }, 4500);

  // Manual Close click
  toastEl.querySelector('.toast-close-btn').addEventListener('click', () => {
    clearTimeout(dismissTimer);
    dismissToastEl(toastEl);
  });
}

function dismissToastEl(toastEl) {
  toastEl.classList.add('translate-y-10', 'opacity-0', 'scale-95');
  setTimeout(() => {
    toastEl.remove();
  }, 300);
}

// Global hook subscription
window.appState.subscribe((event, data) => {
  if (event === 'toast' && data) {
    showToastNotification(data);
  }
});
