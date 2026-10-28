// Reusable Modal Component
function renderModalContainer(modalState) {
  let modalWrapper = document.getElementById('global-modal-overlay');
  
  if (!modalState) {
    if (modalWrapper) {
      modalWrapper.classList.add('opacity-0');
      modalWrapper.querySelector('.modal-content-panel').classList.add('scale-95', 'translate-y-4');
      setTimeout(() => {
        modalWrapper.remove();
      }, 300);
    }
    return;
  }

  // Create new modal overlay
  if (!modalWrapper) {
    modalWrapper = document.createElement('div');
    modalWrapper.id = 'global-modal-overlay';
    modalWrapper.className = 'fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-emerald-950/40 dark:bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 pointer-events-auto';
    document.body.appendChild(modalWrapper);
  }

  const { type, config } = modalState;
  const t = window.i18n.t;
  const currentLang = window.appState.language;

  let modalBodyHtml = '';
  let title = config.title || 'Notification';

  // 1. Render Crop detail modal
  if (type === 'cropDetail') {
    const crop = config.crop;
    title = currentLang === 'bn' ? crop.nameBn : crop.nameEn;
    const desc = currentLang === 'bn' ? crop.explanationBn : crop.explanationEn;
    const water = currentLang === 'bn' ? crop.waterDemandBn : crop.waterDemandEn;
    const yields = currentLang === 'bn' ? crop.yieldBn : crop.yieldEn;
    
    modalBodyHtml = `
      <div class="space-y-5">
        <div class="h-44 rounded-2xl overflow-hidden relative shadow-inner">
          <img class="w-full h-full object-cover" src="${crop.image}" alt="${title}">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <div>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">${currentLang === 'bn' ? crop.seasonBn : crop.seasonEn}</span>
              <h3 class="text-xl font-bold text-white mt-1.5">${title}</h3>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-3.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
            <span class="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">${t('soilComp')}</span>
            <span class="text-base font-extrabold text-emerald-500 mt-1 block">${crop.compatibility}%</span>
          </div>
          <div class="p-3.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
            <span class="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">${t('sensorPH')}</span>
            <span class="text-base font-extrabold text-[var(--text-main)] mt-1 block">${crop.phRange}</span>
          </div>
          <div class="p-3.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
            <span class="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">${t('waterDemand')}</span>
            <span class="text-xs font-extrabold text-[var(--text-main)] mt-1 block">${water}</span>
          </div>
          <div class="p-3.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
            <span class="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">${t('expectedYield')}</span>
            <span class="text-xs font-extrabold text-[var(--text-main)] mt-1 block">${yields}</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 leading-relaxed">
          <h4 class="text-xs font-bold text-emerald-500 mb-1.5 uppercase tracking-wide">${t('navCropRecommendation')} ${t('modalAdvisoryTitle')}</h4>
          <p class="text-xs text-[var(--text-main)] font-medium leading-relaxed">${desc}</p>
        </div>
      </div>
    `;
  } 
  // 2. Render Calibration modal
  else if (type === 'calibrate') {
    title = t('btnCalibrate');
    modalBodyHtml = `
      <div class="space-y-4">
        <p class="text-xs text-[var(--text-muted)] leading-relaxed">
          ${t('modalCalibrationDesc')}
        </p>
        <div class="space-y-3.5 pt-2">
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('moistureCalibOffset')}</label>
            <input type="number" id="calib-moisture" value="0.0" step="0.1" class="w-full px-4 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          </div>
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('phCalibOffset')}</label>
            <input type="number" id="calib-ph" value="0.12" step="0.01" class="w-full px-4 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          </div>
        </div>
        <div class="flex gap-3 pt-4 border-t border-[var(--border-card)]">
          <button id="modal-cancel-btn" class="flex-1 py-3 text-xs font-bold rounded-xl border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-emerald-950/20 transition-smooth">
            ${t('btnDismiss')}
          </button>
          <button id="modal-calibrate-submit" class="flex-1 py-3 text-xs font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-smooth">
            ${t('btnCalibrate')}
          </button>
        </div>
      </div>
    `;
  }

  modalWrapper.innerHTML = `
    <!-- Modal Backdrop -->
    <div class="modal-content-panel w-full max-w-md glass-card rounded-3xl shadow-2xl border border-[var(--border-card)] overflow-hidden transform scale-95 translate-y-4 transition-all duration-300 flex flex-col pointer-events-auto">
      
      <!-- Top Title Bar -->
      <div class="px-6 py-5 border-b border-[var(--border-card)] flex items-center justify-between">
        <h3 class="text-base font-extrabold text-[var(--text-main)] tracking-wide uppercase">${title}</h3>
        <button id="modal-close-icon-btn" class="p-1 rounded-lg text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 transition-smooth focus:outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Inner Body Workspace -->
      <div class="p-6 overflow-y-auto max-h-[80vh] scrollbar-thin">
        ${modalBodyHtml}
      </div>

    </div>
  `;

  // Animate Open
  setTimeout(() => {
    modalWrapper.classList.remove('opacity-0');
    modalWrapper.querySelector('.modal-content-panel').classList.remove('scale-95', 'translate-y-4');
  }, 50);

  // Close handlers
  const closeIconBtn = modalWrapper.querySelector('#modal-close-icon-btn');
  if (closeIconBtn) closeIconBtn.addEventListener('click', () => window.appState.closeModal());

  const cancelBtn = modalWrapper.querySelector('#modal-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', () => window.appState.closeModal());

  const submitCalib = modalWrapper.querySelector('#modal-calibrate-submit');
  if (submitCalib) {
    submitCalib.addEventListener('click', () => {
      const phOffset = +modalWrapper.querySelector('#calib-ph').value || 0;
      const moistureOffset = +modalWrapper.querySelector('#calib-moisture').value || 0;
      
      window.appState.closeModal();
      window.appState.triggerToast('success', 
        `IoT node calibration success! pH offset: ${phOffset}, Moisture offset: ${moistureOffset}`,
        `আইওটি নোড ক্যালিব্রেশন সফল! পিএইচ অফসেট: ${phOffset}, আর্দ্রতা অফসেট: ${moistureOffset}`
      );
    });
  }

  // Close on backdrop click
  modalWrapper.addEventListener('click', (e) => {
    if (e.target === modalWrapper) {
      window.appState.closeModal();
    }
  });
}

// Global modal state observer
window.appState.subscribe((event, data) => {
  if (event === 'modal') {
    renderModalContainer(data);
  }
});
