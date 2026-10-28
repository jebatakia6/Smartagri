// Data History Archive view
function renderHistoryPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;

  // Initialize sorting/filtering local state inside window context
  if (!window.historyState) {
    window.historyState = {
      searchQuery: '',
      sortColumn: 'date',
      sortAsc: false,
      filterMoisture: 'all', // all, low (<40), medium (40-60), high (>60)
      filterPh: 'all',       // all, acidic (<6.0), neutral (6.0-7.0), alkaline (>7.0)
      currentPage: 1,
      rowsPerPage: 8
    };
  }

  const state = window.historyState;
  let logs = [...window.mockData.historyLogs];

  // 1. Process Search Query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    logs = logs.filter(l => {
      const crop = (currentLang === 'bn' ? l.recommendedCropBn : l.recommendedCropEn).toLowerCase();
      const fert = (currentLang === 'bn' ? l.fertilizerAdviceBn : l.fertilizerAdviceEn).toLowerCase();
      const statusText = (currentLang === 'bn' ? l.statusBn : l.statusEn).toLowerCase();
      return crop.includes(q) || fert.includes(q) || statusText.includes(q);
    });
  }

  // 2. Process Moisture filters
  if (state.filterMoisture !== 'all') {
    if (state.filterMoisture === 'low') logs = logs.filter(l => l.moisture < 40);
    else if (state.filterMoisture === 'medium') logs = logs.filter(l => l.moisture >= 40 && l.moisture <= 60);
    else if (state.filterMoisture === 'high') logs = logs.filter(l => l.moisture > 60);
  }

  // 3. Process pH filters
  if (state.filterPh !== 'all') {
    if (state.filterPh === 'acidic') logs = logs.filter(l => l.ph < 6.0);
    else if (state.filterPh === 'neutral') logs = logs.filter(l => l.ph >= 6.0 && l.ph <= 7.0);
    else if (state.filterPh === 'alkaline') logs = logs.filter(l => l.ph > 7.0);
  }

  // 4. Process Sorting
  logs.sort((a, b) => {
    let col = state.sortColumn;
    if (col === 'recommendedCrop') col = currentLang === 'bn' ? 'recommendedCropBn' : 'recommendedCropEn';
    else if (col === 'fertilizerAdvice') col = currentLang === 'bn' ? 'fertilizerAdviceBn' : 'fertilizerAdviceEn';
    else if (col === 'status') col = currentLang === 'bn' ? 'statusBn' : 'statusEn';
 
    let valA = a[col];
    let valB = b[col];
    
    if (state.sortColumn === 'date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
 
    if (valA < valB) return state.sortAsc ? -1 : 1;
    if (valA > valB) return state.sortAsc ? 1 : -1;
    return 0;
  });

  // 5. Process Pagination
  const totalEntries = logs.length;
  const totalPages = Math.ceil(totalEntries / state.rowsPerPage) || 1;
  
  // Constrain currentPage within bounds
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  if (state.currentPage < 1) state.currentPage = 1;

  const startIndex = (state.currentPage - 1) * state.rowsPerPage;
  const endIndex = Math.min(startIndex + state.rowsPerPage, totalEntries);
  const paginatedLogs = logs.slice(startIndex, endIndex);

  container.className = "space-y-6 fade-in";
  container.innerHTML = `
    <!-- Top Row: Headers and Export Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
          ${t('historyTitle')}
        </h1>
        <p class="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">
          ${t('historyDesc')}
        </p>
      </div>

      <button id="history-export-btn" class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-smooth focus:outline-none self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        <span>${t('btnExportCSV')}</span>
      </button>
    </div>

    <!-- Interactive Filtering & Search Utility Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-200/30 dark:bg-emerald-950/10 p-4 rounded-3xl border border-[var(--border-card)]">
      <!-- Search Input -->
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
          🔍
        </span>
        <input id="hist-search" type="text" value="${state.searchQuery}" placeholder="${t('searchPlaceholder')}" class="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth placeholder-gray-400/60">
      </div>

      <!-- Moisture Filter Dropdown -->
      <div>
        <select id="hist-filter-moisture" class="w-full px-4 py-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          <option value="all" ${state.filterMoisture === 'all' ? 'selected' : ''}>${t('historySearchMoistureAll')}</option>
          <option value="low" ${state.filterMoisture === 'low' ? 'selected' : ''}>${t('historySearchMoistureDry')}</option>
          <option value="medium" ${state.filterMoisture === 'medium' ? 'selected' : ''}>${t('historySearchMoistureOptimal')}</option>
          <option value="high" ${state.filterMoisture === 'high' ? 'selected' : ''}>${t('historySearchMoistureWet')}</option>
        </select>
      </div>

      <!-- pH Filter Dropdown -->
      <div>
        <select id="hist-filter-ph" class="w-full px-4 py-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth">
          <option value="all" ${state.filterPh === 'all' ? 'selected' : ''}>${t('historySearchPhAll')}</option>
          <option value="acidic" ${state.filterPh === 'acidic' ? 'selected' : ''}>${t('historySearchPhAcidic')}</option>
          <option value="neutral" ${state.filterPh === 'neutral' ? 'selected' : ''}>${t('historySearchPhNeutral')}</option>
          <option value="alkaline" ${state.filterPh === 'alkaline' ? 'selected' : ''}>${t('historySearchPhAlkaline')}</option>
        </select>
      </div>

      <!-- Clear parameters button -->
      <button id="hist-clear-filters-btn" class="w-full py-3 rounded-2xl border border-[var(--border-card)] text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/5 transition-smooth text-xs font-bold focus:outline-none">
        ✕ ${t('historyResetFilters')}
      </button>
    </div>

    <!-- Main Table View -->
    <div class="glass-card rounded-3xl overflow-hidden border border-[var(--border-card)]">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs whitespace-nowrap">
          <thead class="bg-gray-100/50 dark:bg-emerald-950/20 text-[var(--text-muted)] font-extrabold uppercase border-b border-[var(--border-card)]/50">
            <tr>
              <th data-sort="date" class="px-6 py-4 cursor-pointer hover:text-emerald-500 transition-colors select-none">
                ${t('colDate')} ${renderSortArrow('date', state)}
              </th>
              <th data-sort="moisture" class="px-6 py-4 cursor-pointer hover:text-emerald-500 transition-colors select-none text-center">
                ${t('colMoisture')} ${renderSortArrow('moisture', state)}
              </th>
              <th data-sort="ph" class="px-6 py-4 cursor-pointer hover:text-emerald-500 transition-colors select-none text-center">
                ${t('colPH')} ${renderSortArrow('ph', state)}
              </th>
              <th data-sort="temperature" class="px-6 py-4 cursor-pointer hover:text-emerald-500 transition-colors select-none text-center">
                ${t('colTemp')} ${renderSortArrow('temperature', state)}
              </th>
              <th class="px-6 py-4">${t('colCrop')}</th>
              <th class="px-6 py-4">${t('colFertilizer')}</th>
              <th class="px-6 py-4 text-center">${t('colStatus')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--border-card)]/40 font-semibold text-[var(--text-main)]">
            ${paginatedLogs.length === 0 ? `
              <tr>
                <td colspan="7" class="px-6 py-12 text-center text-[var(--text-muted)]">
                  ${t('historyNoLogs')}
                </td>
              </tr>
            ` : paginatedLogs.map(log => {
              const bgStatus = log.statusEn === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              const crop = currentLang === 'bn' ? log.recommendedCropBn : log.recommendedCropEn;
              const fertilizer = currentLang === 'bn' ? log.fertilizerAdviceBn : log.fertilizerAdviceEn;
              const statusText = currentLang === 'bn' ? log.statusBn : log.statusEn;
              return `
                <tr class="hover:bg-emerald-500/5 transition-colors">
                  <td class="px-6 py-4.5 text-[var(--text-muted)] font-medium">
                    ${log.date.toLocaleDateString()} ${log.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td class="px-6 py-4.5 text-center text-blue-500">${log.moisture}%</td>
                  <td class="px-6 py-4.5 text-center text-emerald-500">${log.ph}</td>
                  <td class="px-6 py-4.5 text-center text-orange-500">${log.temperature}°C</td>
                  <td class="px-6 py-4.5 font-bold">${crop}</td>
                  <td class="px-6 py-4.5 text-[var(--text-muted)]">${fertilizer}</td>
                  <td class="px-6 py-4.5 text-center">
                    <span class="px-2.5 py-0.5 rounded-lg border text-[9px] font-bold ${bgStatus}">
                      ${statusText}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls Footer -->
      <div class="px-6 py-4 border-t border-[var(--border-card)]/50 flex items-center justify-between text-xs text-[var(--text-muted)] flex-col sm:flex-row gap-3">
        <div>
          ${t('pagShowing')} <strong class="text-[var(--text-main)]">${startIndex + 1}</strong> ${t('pagTo')} <strong class="text-[var(--text-main)]">${endIndex}</strong> ${t('pagOf')} <strong class="text-[var(--text-main)]">${totalEntries}</strong> ${t('pagEntries')}
        </div>
        <div class="flex items-center gap-1.5">
          <button id="hist-prev" class="px-3.5 py-2 rounded-xl border border-[var(--border-card)] hover:bg-emerald-500/5 transition-smooth font-bold focus:outline-none" ${state.currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            ${t('historyPrevious')}
          </button>
          ${Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = state.currentPage === pageNum;
            return `
              <button data-page-btn="${pageNum}" class="w-8 h-8 rounded-xl border border-[var(--border-card)] font-bold transition-smooth focus:outline-none ${
                isActive ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'hover:bg-emerald-500/5'
              }">${pageNum}</button>
            `;
          }).join('')}
          <button id="hist-next" class="px-3.5 py-2 rounded-xl border border-[var(--border-card)] hover:bg-emerald-500/5 transition-smooth font-bold focus:outline-none" ${state.currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            ${t('historyNext')}
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach interactive search handler
  const searchInput = container.querySelector('#hist-search');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.currentPage = 1;
    renderHistoryPage(container); // Repaint table
  });

  // Attach filter dropdown changes
  container.querySelector('#hist-filter-moisture').addEventListener('change', (e) => {
    state.filterMoisture = e.target.value;
    state.currentPage = 1;
    renderHistoryPage(container);
  });
  container.querySelector('#hist-filter-ph').addEventListener('change', (e) => {
    state.filterPh = e.target.value;
    state.currentPage = 1;
    renderHistoryPage(container);
  });

  // Attach clear filter
  container.querySelector('#hist-clear-filters-btn').addEventListener('click', () => {
    state.searchQuery = '';
    state.filterMoisture = 'all';
    state.filterPh = 'all';
    state.currentPage = 1;
    renderHistoryPage(container);
  });

  // Attach dynamic table header sorting
  container.querySelectorAll('[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (state.sortColumn === col) {
        state.sortAsc = !state.sortAsc;
      } else {
        state.sortColumn = col;
        state.sortAsc = false;
      }
      renderHistoryPage(container);
    });
  });

  // Attach pagination clicks
  container.querySelector('#hist-prev').addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderHistoryPage(container);
    }
  });
  container.querySelector('#hist-next').addEventListener('click', () => {
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderHistoryPage(container);
    }
  });

  container.querySelectorAll('[data-page-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = +btn.getAttribute('data-page-btn');
      state.currentPage = page;
      renderHistoryPage(container);
    });
  });

  // Export CSV
  container.querySelector('#history-export-btn').addEventListener('click', () => {
    window.appState.triggerToast('success', 'Soil log CSV export success! File saved to Downloads.', 'মাটির তথ্য সম্বলিত CSV ফাইল সফলভাবে ডাউনলোড করা হয়েছে।');
  });
}

function renderSortArrow(col, state) {
  if (state.sortColumn !== col) return '<span class="text-gray-400 opacity-30">⇅</span>';
  return state.sortAsc ? '▲' : '▼';
}

window.renderHistoryPage = renderHistoryPage;
