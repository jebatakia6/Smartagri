// AI Crop Recommendation Page View
// Connects to POST /api/crop-recommendation for RULE-BASED analysis (clearly labelled).
function renderRecommendationPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;

  // Initial local state for recommendation analyzer page
  if (!window.recommendationState) {
    window.recommendationState = {
      isAnalyzing: false,
      hasAnalyzed: false,
      backendError: null,
      disclaimer: null,
      inputs: {
        moisture: 42,
        ph: 6.5,
        nitrogen: 50,
        phosphorus: 40,
        potassium: 55,
        temperature: 28
      },
      results: []
    };
  }

  const state = window.recommendationState;

  container.className = "space-y-6 fade-in";
  
  let headerHtml = `
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
        ${t('navCropRecommendation')}
      </h1>
      <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
        ${t('recomSubtitle')}
      </p>
    </div>
    <!-- Static Rice Showcase -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="glass-card p-4 rounded-2xl flex flex-col items-center">
        <img src="https://images.unsplash.com/photo-1559666096-8155319db5a4?auto=format&fit=crop&q=80&w=250" alt="আমান ধান" class="w-full h-32 object-cover rounded-md" />
        <span class="mt-2 text-sm font-bold text-[var(--text-main)]">আমান ধান</span>
      </div>
      <div class="glass-card p-4 rounded-2xl flex flex-col items-center">
        <img src="https://images.unsplash.com/photo-1603880832083-1f544b5be8f8?auto=format&fit=crop&q=80&w=250" alt="বোরো ধান" class="w-full h-32 object-cover rounded-md" />
        <span class="mt-2 text-sm font-bold text-[var(--text-main)]">বোরো ধান</span>
      </div>
      <div class="glass-card p-4 rounded-2xl flex flex-col items-center">
        <img src="https://images.unsplash.com/photo-1584422368448-7fcce13e8f2e?auto=format&fit=crop&q=80&w=250" alt="অস ধান" class="w-full h-32 object-cover rounded-md" />
        <span class="mt-2 text-sm font-bold text-[var(--text-main)]">অস ধান</span>
      </div>
    </div>
  `;

  // Render Skeleton loaders during analysis
  let resultsContentHtml = '';
  if (state.isAnalyzing) {
    resultsContentHtml = `
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">${t('statusAnalyzing')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Skeleton Card 1 -->
          <div class="glass-card p-5 rounded-3xl space-y-4 border border-[var(--border-card)]">
            <div class="h-36 rounded-2xl skeleton-shimmer w-full"></div>
            <div class="h-4 w-1/3 rounded skeleton-shimmer"></div>
            <div class="h-6 w-2/3 rounded skeleton-shimmer"></div>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
            </div>
          </div>
          <!-- Skeleton Card 2 -->
          <div class="glass-card p-5 rounded-3xl space-y-4 border border-[var(--border-card)]">
            <div class="h-36 rounded-2xl skeleton-shimmer w-full"></div>
            <div class="h-4 w-1/3 rounded skeleton-shimmer"></div>
            <div class="h-6 w-2/3 rounded skeleton-shimmer"></div>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
            </div>
          </div>
          <!-- Skeleton Card 3 -->
          <div class="glass-card p-5 rounded-3xl space-y-4 border border-[var(--border-card)]">
            <div class="h-36 rounded-2xl skeleton-shimmer w-full"></div>
            <div class="h-4 w-1/3 rounded skeleton-shimmer"></div>
            <div class="h-6 w-2/3 rounded skeleton-shimmer"></div>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
              <div class="h-8 rounded-xl skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  } 
  // Render calculated crop list results
  else if (state.hasAnalyzed && state.backendError) {
    resultsContentHtml = `
      <div class="glass-card p-8 rounded-3xl border border-red-500/20 bg-red-500/5 flex flex-col items-center text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 text-2xl">⚠️</div>
        <h3 class="text-sm font-bold text-red-400 uppercase tracking-wider">Backend Error</h3>
        <p class="text-xs text-[var(--text-muted)] mt-2 max-w-sm">${state.backendError}</p>
        <p class="text-[10px] text-[var(--text-muted)] mt-2">Make sure the Flask server is running: <code class="bg-gray-200/50 dark:bg-emerald-950/20 px-1 rounded">python app.py</code></p>
      </div>
    `;
  }
  // Render calculated crop list results
  else if (state.hasAnalyzed) {
    const crops = state.results;
    
    resultsContentHtml = `
      <div class="space-y-6">
        <!-- Rule-based disclaimer -->
        <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400 leading-relaxed">
          ⚠️ <strong>RULE-BASED SYSTEM — NOT AI:</strong> ${state.disclaimer || 'These recommendations are generated using agronomic threshold scoring, not a trained ML model. They are preliminary guidelines only.'}
        </div>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">
            ${currentLang === 'bn' ? 'ফসল সামঞ্জস্য বিশ্লেষণ ফলাফল' : 'Rule-Based Crop Analysis Results'} (${crops.length})
          </h3>
          <span class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
            ${currentLang === 'bn' ? 'সর্বোত্তম ফলাফল' : 'Top Results'}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${crops.map((crop, idx) => {
            // Support both backend API response format and mock data format
            const name  = currentLang === 'bn' ? (crop.nameBn || crop.nameEn) : (crop.nameEn || crop.nameBn);
            // Compatibility % — backend gives score (0-100), mock gives compatibility
            const compat = crop.score != null ? crop.score : (crop.compatibility || 0);
            // Suitability label
            const suitLabel = crop.suitability || (compat >= 85 ? 'Highly Suitable' : compat >= 60 ? 'Suitable' : compat >= 40 ? 'Marginally Suitable' : 'Low Suitability');
            const riskLabel = crop.risk || (compat >= 85 ? 'Low Risk' : compat >= 60 ? 'Moderate Risk' : 'Higher Risk');
            const riskColor = compat >= 85 ? 'text-emerald-500' : compat >= 60 ? 'text-amber-400' : 'text-red-400';
            // Water demand
            const water = crop.waterDemand || crop.waterDemandEn || '—';
            // Season
            const season = crop.season || (currentLang === 'bn' ? crop.seasonBn : crop.seasonEn) || '—';
            // Explanation / general note
            const explanation = crop.generalNote || (currentLang === 'bn' ? crop.explanationBn : crop.explanationEn) || '';
            // Warnings from backend
            const warnings = crop.warnings || [];
            // Image: use crop.image if available (mock) or default icons per crop id
            const cropImages = {
              rice: 'https://images.unsplash.com/photo-1559666096-8155319db5a4?auto=format&fit=crop&q=80&w=400',
              wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6962b3?auto=format&fit=crop&q=80&w=400',
              maize: 'https://images.unsplash.com/photo-1601593768799-76e41e98c5c5?auto=format&fit=crop&q=80&w=400',
              potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400',
              tomato: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?auto=format&fit=crop&q=80&w=400',
              mustard: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400',
              jute: 'https://images.unsplash.com/photo-1559666096-8155319db5a4?auto=format&fit=crop&q=80&w=400',
              lentil: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=400',
            };
            const imgUrl = crop.image || cropImages[crop.id] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400';
            const isBest = idx === 0;

            return `
              <div class="glass-card p-5 rounded-3xl border ${isBest ? 'border-emerald-500/40 shadow-emerald-500/5 ring-1 ring-emerald-500/20' : 'border-[var(--border-card)]'} flex flex-col justify-between relative group hover:border-emerald-500/30">
                ${isBest ? `
                  <span class="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                    ★ ${currentLang === 'bn' ? 'সেরা ফসল' : 'Best Choice'}
                  </span>
                ` : ''}
                
              <div class="space-y-4">
                  <!-- Crop Image header -->
                  <div class="h-36 rounded-2xl overflow-hidden relative shadow-inner">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${imgUrl}" alt="${name}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-4">
                      <div>
                        <span class="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/90 text-white">${season}</span>
                        <h4 class="text-base font-extrabold text-white mt-1 leading-tight">${name}</h4>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Stats Grid -->
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="p-2.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
                      <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('soilComp')}</span>
                      <span class="text-sm font-black text-emerald-500 block mt-0.5">${compat}%</span>
                    </div>
                    <div class="p-2.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
                      <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('riskFactor')}</span>
                      <span class="text-[10px] font-bold block mt-0.5 ${riskColor}">${riskLabel}</span>
                    </div>
                    <div class="p-2.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
                      <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('waterDemand')}</span>
                      <span class="text-[10px] font-bold text-[var(--text-main)] block mt-0.5 truncate">${water}</span>
                    </div>
                    <div class="p-2.5 rounded-xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)]">
                      <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">Suitability</span>
                      <span class="text-[10px] font-bold text-[var(--text-main)] block mt-0.5 truncate">${suitLabel}</span>
                    </div>
                  </div>

                  <!-- Warnings from backend -->
                  ${warnings.length > 0 ? `
                    <div class="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      ${warnings.map(w => `<p class="text-[9px] text-amber-400 font-semibold leading-relaxed">⚠ ${w}</p>`).join('')}
                    </div>
                  ` : ''}

                  <!-- Descriptive explanation -->
                  <div class="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
                    <p class="text-[var(--text-main)] font-medium leading-relaxed line-clamp-3">${explanation}</p>
                  </div>
                </div>

                <button data-crop-detail-btn="${crop.id}" class="w-full mt-4 py-2.5 rounded-xl border border-[var(--border-card)] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-xs font-bold text-[var(--text-main)] transition-smooth focus:outline-none">
                  ${currentLang === 'bn' ? 'সম্পূর্ণ এআই নির্দেশনা দেখুন' : 'View Full Advisory Detail'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } 
  // Initial empty state before running the diagnostic analysis
  else {
    resultsContentHtml = `
      <div class="glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center border-dashed border-2 border-[var(--border-card)]">
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 class="text-base font-extrabold text-[var(--text-main)] uppercase tracking-wider">${t('statusReady')}</h3>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed mt-2 max-w-sm">
          ${t('recomInstruction').replace('{btnAnalyze}', `<strong class="text-[var(--text-main)]">${t('btnAnalyze')}</strong>`)}
        </p>
      </div>
    `;
  }

  container.innerHTML = `
    ${headerHtml}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left 1 Column: Inputs Parameter Panel -->
      <div class="glass-card p-6 rounded-3xl h-fit">
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-[var(--border-card)]">
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('recomFormTitle')}</h3>
        </div>

        <p class="text-[10px] text-[var(--text-muted)] leading-relaxed mb-4">${t('recomFormDesc')}</p>

        <button id="recom-autofill-btn" class="w-full mb-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold transition-smooth flex items-center justify-center gap-2 border border-emerald-500/20">
          ⚡ ${t('btnAutoFill')}
        </button>

        <form id="recom-input-form" class="space-y-4" onsubmit="return false;">
          <!-- Moisture -->
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('moistureLabel')}</label>
            <input type="number" id="input-moisture" min="10" max="95" required value="${state.inputs.moisture}" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          </div>
          <!-- pH -->
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('phLabel')}</label>
            <input type="number" id="input-ph" min="3" max="10" step="0.1" required value="${state.inputs.ph}" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          </div>
          
          <div class="grid grid-cols-3 gap-2.5">
            <!-- N -->
            <div>
              <label class="block text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">N (mg/kg)</label>
              <input type="number" id="input-n" min="0" max="250" required value="${state.inputs.nitrogen}" class="w-full px-2 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
            </div>
            <!-- P -->
            <div>
              <label class="block text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">P (mg/kg)</label>
              <input type="number" id="input-p" min="0" max="250" required value="${state.inputs.phosphorus}" class="w-full px-2 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
            </div>
            <!-- K -->
            <div>
              <label class="block text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">K (mg/kg)</label>
              <input type="number" id="input-k" min="0" max="250" required value="${state.inputs.potassium}" class="w-full px-2 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-center text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
            </div>
          </div>

          <!-- Temp -->
          <div>
            <label class="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1.5">${t('tempLabel')}</label>
            <input type="number" id="input-temp" min="10" max="50" required value="${state.inputs.temperature}" class="w-full px-3.5 py-3 rounded-xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          </div>

          <!-- Submit diagnostic Button -->
          <button id="recom-submit-btn" type="submit" class="w-full py-4 bg-emerald-500 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-98 transition-smooth flex items-center justify-center gap-2">
            <span>🔍 ${t('btnAnalyze')}</span>
          </button>
        </form>
      </div>

      <!-- Right 2 Columns: Output Results Panel -->
      <div class="lg:col-span-2">
        <div id="recom-results-workspace">
          ${resultsContentHtml}
        </div>
      </div>

    </div>
  `;

  // Autofill parameters from active global IoT sensor metrics
  container.querySelector('#recom-autofill-btn').addEventListener('click', () => {
    const s = window.appState.sensors;
    
    container.querySelector('#input-moisture').value = s.moisture;
    container.querySelector('#input-ph').value = s.ph;
    container.querySelector('#input-n').value = s.nitrogen;
    container.querySelector('#input-p').value = s.phosphorus;
    container.querySelector('#input-k').value = s.potassium;
    container.querySelector('#input-temp').value = s.temperature;
    
    window.appState.triggerToast('success', 'Soil inputs loaded from active IoT telemetry feeds!', 'লাইভ আইওটি নোড থেকে মাটির তথ্য পূরণ করা হয়েছে!');
  });

  // Submit form trigger — calls real backend
  const recomForm = container.querySelector('#recom-input-form');
  recomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Cache input values
    state.inputs.moisture    = +container.querySelector('#input-moisture').value;
    state.inputs.ph          = +container.querySelector('#input-ph').value;
    state.inputs.nitrogen    = +container.querySelector('#input-n').value;
    state.inputs.phosphorus  = +container.querySelector('#input-p').value;
    state.inputs.potassium   = +container.querySelector('#input-k').value;
    state.inputs.temperature = +container.querySelector('#input-temp').value;

    state.isAnalyzing  = true;
    state.hasAnalyzed  = false;
    state.backendError = null;
    renderRecommendationPage(container); // Show skeletons

    // ---- Call real backend ----
    const result = await window.soilApi.getCropRecommendation({
      ph:          state.inputs.ph,
      moisture:    state.inputs.moisture,
      temperature: state.inputs.temperature,
      nitrogen:    state.inputs.nitrogen,
      phosphorus:  state.inputs.phosphorus,
      potassium:   state.inputs.potassium,
    });

    state.isAnalyzing = false;
    state.hasAnalyzed = true;

    if (result.ok) {
      state.results    = result.data.recommendations || [];
      state.disclaimer = result.data.disclaimer || null;
      state.backendError = null;
      window.appState.triggerToast('success', 'Crop analysis complete! Results from rule-based agronomic engine.', 'ফসল বিশ্লেষণ সম্পন্ন হয়েছে!');
    } else {
      state.results      = [];
      state.backendError = result.error || 'Unknown error from backend.';
      window.appState.triggerToast('danger', 'Backend error: ' + result.error, 'ব্যাকেন্ড সংযোগ ব্যর্থ হয়েছে।');
    }

    renderRecommendationPage(container); // Repaint with results
  });

  // Attach modal detail triggers to outputs cards
  if (state.hasAnalyzed && !state.isAnalyzing) {
    container.querySelectorAll('[data-crop-detail-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-crop-detail-btn');
        const crop = state.results.find(c => c.id === id);
        if (crop) {
          window.appState.openModal('cropDetail', { crop });
        }
      });
    });
  }
}

window.renderRecommendationPage = renderRecommendationPage;
