// Fertilizer & Irrigation Suggestion Page View
function renderFertilizerPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;
  const s = window.appState.sensors;
  const r = window.mockData.fertilizerRules;

  // Determine current active recommendation rule based on NPK levels
  let rule = r.balancedSoil;
  let statusTextEn = "Your soil nutrients are well balanced. Maintain current practices.";
  let statusTextBn = "আপনার মাটির পুষ্টি সুষম অবস্থায় রয়েছে। বর্তমান পদ্ধতি বজায় রাখুন।";

  if (s.nitrogen < 48) {
    rule = r.nitrogenDeficit;
    statusTextEn = "Critical Nitrogen deficit detected! Nitrogen levels are below the optimal 50 mg/kg threshold.";
    statusTextBn = "মাটিতে নাইট্রোজেনের ঘাটতি সনাক্ত হয়েছে! নাইট্রোজেনের মাত্রা স্বাভাবিক ৫০ মিলিগ্রাম/কেজি সীমার নিচে রয়েছে।";
  } else if (s.phosphorus < 35) {
    rule = r.phosphorusDeficit;
    statusTextEn = "Phosphorus levels are deficient. Phosphate supplementation highly recommended for crop root growth.";
    statusTextBn = "মাটিতে ফসফরাস ঘাটতি দেখা গেছে। শস্যের শিকড় গজানোর জন্য ফসফেট প্রয়োগের পরামর্শ দেওয়া হচ্ছে।";
  } else if (s.potassium < 50) {
    rule = r.potassiumDeficit;
    statusTextEn = "Potassium deficiency detected. Potassium regulates crop transpiration and water retention.";
    statusTextBn = "পটাশিয়াম ঘাটতি সনাক্ত হয়েছে। পটাশিয়াম ফসলের প্রস্বেদন এবং পানি ধারণ ক্ষমতা নিয়ন্ত্রণ করে।";
  }

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
        ${t('navFertilizer')}
      </h1>
      <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
        ${t('fertiRecomTitle')}
      </p>
    </div>

    <!-- Overview NPK ratios and diagnostics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- NPK Nutrients analysis circles -->
      <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-2">${t('nutriAnalysis')}</h3>
          <p class="text-[10px] text-[var(--text-muted)] leading-relaxed mb-6">${t('chemicalElementDist')}</p>
          
          <div class="grid grid-cols-3 gap-2">
            <!-- N circular progress -->
            <div class="flex flex-col items-center">
              <div class="relative w-16 h-16 flex items-center justify-center">
                <svg class="w-full h-full radial-progress" viewBox="0 0 100 100">
                  <circle class="text-gray-200 dark:text-emerald-950/20" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                  <circle class="text-emerald-500" stroke-width="8" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * s.nitrogen) / 100}" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                </svg>
                <span class="absolute text-xs font-black text-[var(--text-main)]">${s.nitrogen}</span>
              </div>
              <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2">${t('nitrogenLabelShort')}</span>
            </div>

            <!-- P circular progress -->
            <div class="flex flex-col items-center">
              <div class="relative w-16 h-16 flex items-center justify-center">
                <svg class="w-full h-full radial-progress" viewBox="0 0 100 100">
                  <circle class="text-gray-200 dark:text-emerald-950/20" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                  <circle class="text-teal-400" stroke-width="8" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * s.phosphorus) / 100}" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                </svg>
                <span class="absolute text-xs font-black text-[var(--text-main)]">${s.phosphorus}</span>
              </div>
              <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2">${t('phosphorusLabelShort')}</span>
            </div>

            <!-- K circular progress -->
            <div class="flex flex-col items-center">
              <div class="relative w-16 h-16 flex items-center justify-center">
                <svg class="w-full h-full radial-progress" viewBox="0 0 100 100">
                  <circle class="text-gray-200 dark:text-emerald-950/20" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                  <circle class="text-orange-400" stroke-width="8" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * s.potassium) / 100}" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                </svg>
                <span class="absolute text-xs font-black text-[var(--text-main)]">${s.potassium}</span>
              </div>
              <span class="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2">${t('potassiumLabelShort')}</span>
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs mt-6">
          <span class="font-bold text-emerald-500 uppercase tracking-widest block text-[9px] mb-1">${t('diagnosticReport')}</span>
          <p class="text-[var(--text-main)] font-semibold leading-relaxed">${currentLang === 'bn' ? statusTextBn : statusTextEn}</p>
        </div>
      </div>

      <!-- Fertilizer Dosage recommendation card -->
      <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('fertilizerQty')}</h3>
            <span class="px-2 py-0.5 rounded text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">${t('actionRequired')}</span>
          </div>

          <div class="p-4 rounded-2xl bg-gray-100/50 dark:bg-emerald-950/10 border border-[var(--border-card)] flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              🧪
            </div>
            <div>
              <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('recommendedInput')}</span>
              <h4 class="text-sm font-black text-[var(--text-main)]">${currentLang === 'bn' ? rule.nameBn : rule.nameEn}</h4>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <span class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('recommendedQty')}</span>
            <span class="text-lg font-black text-emerald-500">${currentLang === 'bn' ? rule.qtyBn : rule.qtyEn}</span>
          </div>
        </div>

        <div class="border-t border-[var(--border-card)]/50 pt-4 mt-6">
          <span class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block mb-1">${t('applicationSchedule')}</span>
          <p class="text-xs text-[var(--text-main)] font-medium leading-relaxed">${currentLang === 'bn' ? rule.applicationBn : rule.applicationEn}</p>
        </div>
      </div>

      <!-- Irrigation dosage scheduling card -->
      <div class="glass-card p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider">${t('irrigationSchedule')}</h3>
            <span class="px-2 py-0.5 rounded text-[8px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase">${t('automated')}</span>
          </div>

          <div class="space-y-4">
            <!-- Soil Moisture status bar -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-[var(--text-main)] mb-1">
                <span>${t('moistureSaturation')}</span>
                <span>${s.moisture}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-emerald-950/20 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-full" style="width: ${s.moisture}%"></div>
              </div>
            </div>

            <!-- Pump schedule status -->
            <div class="p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-between text-xs font-semibold">
              <span class="text-[var(--text-main)]">${t('autoIrrigationPump')}</span>
              <span class="flex items-center gap-1.5 uppercase font-bold text-sky-400">
                <span class="w-2 h-2 rounded-full bg-sky-400 ${s.moisture < 35 ? 'status-pulse-online' : ''}"></span>
                ${s.moisture < 35 ? t('pumpActive') : t('pumpIdle')}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-[var(--border-card)]/50 pt-4 mt-6 space-y-2 text-xs">
          <span class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">${t('wateringAdvice')}</span>
          <p class="text-[var(--text-main)] font-medium leading-relaxed">
            ${s.moisture < 35 
              ? t('wateringAdviceDry') 
              : t('wateringAdviceOptimal')
            }
          </p>
        </div>
      </div>

    </div>

    <!-- Soil improvement guidelines -->
    <div class="glass-card p-6 rounded-3xl">
      <h3 class="text-sm font-extrabold uppercase text-[var(--text-main)] tracking-wider mb-4">${t('improvementTips')}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
        <div class="space-y-3">
          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">1</span>
            <div>
              <h4 class="font-extrabold text-[var(--text-main)]">${t('basalCompostTitle')}</h4>
              <p class="text-[var(--text-muted)] mt-1 font-medium">${t('basalCompostDesc')}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">2</span>
            <div>
              <h4 class="font-extrabold text-[var(--text-main)]">${t('coverCropTitle')}</h4>
              <p class="text-[var(--text-muted)] mt-1 font-medium">${t('coverCropDesc')}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">3</span>
            <div>
              <h4 class="font-extrabold text-[var(--text-main)]">${t('soilPhStabilization')}</h4>
              <p class="text-[var(--text-muted)] mt-1 font-medium">${currentLang === 'bn' ? rule.soilTipsBn : rule.soilTipsEn}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">4</span>
            <div>
              <h4 class="font-extrabold text-[var(--text-main)]">${t('precisionMulchTitle')}</h4>
              <p class="text-[var(--text-muted)] mt-1 font-medium">${t('precisionMulchDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.renderFertilizerPage = renderFertilizerPage;
