// Login Page view template
function renderLoginPage(container) {
  if (!container) return;

  const t = window.i18n.t;
  const currentLang = window.appState.language;

  // Outer split screen container layout
  container.className = "w-full min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] fade-in";
  container.innerHTML = `
    <!-- Left Panel: Graphic & Smart Agri AI Title (Hidden on small mobile screens) -->
    <div class="hidden md:flex md:w-1/2 bg-agritech-pattern flex-col justify-between p-12 text-white relative overflow-hidden">
      <!-- Glow Blur Overlays -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div class="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl"></div>

      <!-- Top Logo Branding -->
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h1 class="font-extrabold text-lg tracking-wider uppercase">${t('projectTitle')}</h1>
      </div>

      <!-- Center agricultural AI statement -->
      <div class="my-auto space-y-6 relative z-10 max-w-lg">
        <span class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 tracking-wider uppercase inline-block">
          ${t('loginIotNodeTelemetry')}
        </span>
        <h2 class="text-3xl lg:text-4xl font-extrabold leading-tight tracking-wide text-emerald-100">
          ${currentLang === 'bn' 
            ? 'মাটির গুণাগুণ নির্ণয় ও ফসলের সঠিক সুপারিশে প্রযুক্তি' 
            : 'Sensing Soil Health, Feeding Global Future.'}
        </h2>
        <p class="text-sm text-gray-300 font-medium leading-relaxed">
          ${t('signInDesc')}
        </p>
      </div>

      <!-- Footer system specs -->
      <div class="flex items-center justify-between text-xs text-gray-400 relative z-10 border-t border-white/10 pt-6">
        <span>${t('loginSystemSpecs')}</span>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 status-pulse-online"></span>
          <span>${t('loginProductionReady')}</span>
        </div>
      </div>
    </div>

    <!-- Right Panel: Login Credentials Form -->
    <div class="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96 space-y-8">
        
        <!-- Mobile Top Branding -->
        <div class="md:hidden flex flex-col items-center text-center space-y-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-black text-[var(--text-main)] uppercase">${t('projectTitle')}</h2>
          <p class="text-xs text-[var(--text-muted)]">${t('projectSubtitle')}</p>
        </div>

        <div class="space-y-2 text-center md:text-left">
          <!-- Localization pill in header -->
          <div class="flex justify-center md:justify-between items-center">
            <h2 class="text-2xl font-extrabold text-[var(--text-main)] tracking-wide">${t('signInTitle')}</h2>
            <!-- Language Selection Switch & Back Button -->
            <div class="flex items-center gap-3">
              <button id="login-back-btn" class="p-2 rounded-xl hover:bg-emerald-500/10 text-emerald-500 transition-smooth focus:outline-none" title="${currentLang === 'bn' ? 'হোম পেইজে ফিরে যান' : 'Back to Home'}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <div class="flex items-center gap-1.5 bg-gray-200/50 dark:bg-emerald-950/20 p-1 rounded-xl border border-[var(--border-card)]">
                <button id="login-lang-en" class="px-2 py-0.5 text-[10px] font-extrabold rounded transition-smooth ${
                  currentLang === 'en' ? 'bg-emerald-500 text-white' : 'text-[var(--text-muted)]'
                }">EN</button>
                <button id="login-lang-bn" class="px-2 py-0.5 text-[10px] font-extrabold rounded transition-smooth ${
                  currentLang === 'bn' ? 'bg-emerald-500 text-white' : 'text-[var(--text-muted)]'
                }">বাং</button>
              </div>
            </div>
          </div>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed hidden md:block">
            ${t('loginCredentialsDesc')}
          </p>
        </div>

        <!-- Credentials Form -->
        <form id="login-auth-form" class="space-y-5" onsubmit="return false;">
          <!-- Email Block -->
          <div>
            <label for="email" class="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              ${t('emailLabel')}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                </svg>
              </span>
              <input id="email" type="email" required value="farmer@smartagri.io" placeholder="${t('emailPlaceholder')}" class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth placeholder-gray-400/60">
            </div>
          </div>

          <!-- Password Block -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="password" class="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                ${t('passwordLabel')}
              </label>
              <a href="#" class="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors uppercase tracking-wider">
                ${t('forgotPassword')}
              </a>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </span>
              <input id="password" type="password" required value="farmer123" placeholder="${t('passwordPlaceholder')}" class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--border-card)] bg-transparent text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-smooth placeholder-gray-400/60">
            </div>
          </div>

          <!-- Remember me checkbox -->
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" checked class="h-4.5 w-4.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
            <label for="remember-me" class="ml-2.5 text-xs text-[var(--text-muted)] font-semibold">
              ${t('rememberMe')}
            </label>
          </div>

          <!-- Login Button -->
          <button id="login-submit-btn" type="submit" class="w-full py-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-smooth flex items-center justify-center gap-2">
            <span>${t('btnSignIn')}</span>
          </button>
        </form>

        <!-- Redirect Link to registration (Don't have an account?) -->
        <div class="text-center text-xs text-[var(--text-muted)] font-semibold mt-4">
          <span>${currentLang === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}</span>
          <a href="#" id="login-register-redirect" class="text-emerald-500 hover:underline hover:text-emerald-600 ml-1">
            ${currentLang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}
          </a>
        </div>

        <!-- Mock details instruction panel -->
        <div class="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/2 border border-emerald-500/10 text-[10px] leading-relaxed text-[var(--text-muted)] text-center">
          <span class="font-bold text-emerald-500 uppercase block mb-1">${t('loginSandboxTitle')}</span>
          ${t('loginSandboxDesc').replace('Sign In', `<strong class="text-[var(--text-main)]">${t('btnSignIn')}</strong>`)}
        </div>

      </div>
    </div>
  `;

  // Attach language triggers
  container.querySelector('#login-lang-en').addEventListener('click', () => {
    window.appState.setLanguage('en');
  });
  container.querySelector('#login-lang-bn').addEventListener('click', () => {
    window.appState.setLanguage('bn');
  });

  // Back Button Trigger
  container.querySelector('#login-back-btn').addEventListener('click', () => {
    window.appState.setPage('landing');
  });

  // Redirect to registration page
  container.querySelector('#login-register-redirect').addEventListener('click', (e) => {
    e.preventDefault();
    window.appState.setPage('register');
  });

  // Submit Trigger
  const authForm = container.querySelector('#login-auth-form');
  const submitBtn = container.querySelector('#login-submit-btn');

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>${t('signingIn')}</span>
    `;

    // Brief delay to make transitions feel premium and deliberate
    setTimeout(() => {
      window.appState.login();
    }, 1000);
  });
}

window.renderLoginPage = renderLoginPage;
