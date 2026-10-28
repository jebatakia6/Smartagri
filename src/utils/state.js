// Global Application State Manager
class AppStateManager {
  constructor() {
    this.language = localStorage.getItem('agri_lang') || 'en';
    this.theme = localStorage.getItem('agri_theme') || 'dark'; // Default to modern elegant dark theme
    this.activePage = 'landing'; // Starts at Landing Page
    this.isLoggedIn = false;
    this.toastNotification = null;
    this.activeModal = null;
    
    // Live sensor values
    this.sensors = {
      moisture: 42.5,
      ph: 6.8,
      temperature: 28.4,
      humidity: 76.2,
      healthScore: 84,
      irrigation: 'idle', // idle, active
      aiStatus: 'ready', // ready, calculating
      nitrogen: 45,
      phosphorus: 32,
      potassium: 54,
      connection: 'connected', // connected, offline
      lastUpdated: new Date()
    };

    // Active alert notifications
    this.alerts = [
      { id: 'a1', type: 'danger', key: 'lowMoistureWarning', messageEn: "Critical Soil Moisture alert: Levels dropped to 28% in Zone A.", messageBn: "মাটির আর্দ্রতা সংকটজনক: জোন এ-তে আর্দ্রতা কমে ২৮% হয়েছে।", timestamp: new Date(Date.now() - 1000 * 60 * 15), read: false },
      { id: 'a2', type: 'warning', key: 'phImbalance', messageEn: "Soil pH imbalance: High acidity level (5.2 pH) detected.", messageBn: "মাটির পিএইচ ভারসাম্যহীনতা: উচ্চ অম্লতা (৫.২ পিএইচ) সনাক্ত হয়েছে।", timestamp: new Date(Date.now() - 1000 * 60 * 45), read: false },
      { id: 'a3', type: 'info', key: 'nitrogenLow', messageEn: "Nutrient Alert: Nitrogen (N) is slightly below optimal thresholds.", messageBn: "পুষ্টির সতর্কতা: নাইট্রোজেন (N) স্বাভাবিক মাত্রার চেয়ে কিছুটা কম আছে।", timestamp: new Date(Date.now() - 1000 * 60 * 120), read: false },
      { id: 'a4', type: 'success', key: 'sprayingWindow', messageEn: "Weather Alert: Perfect temperature window for organic fertilizer spraying.", messageBn: "আবহাওয়া সতর্কতা: জৈব সার ছিটানোর জন্য চমৎকার তাপমাত্রার আবহাওয়া রয়েছে।", timestamp: new Date(Date.now() - 1000 * 60 * 240), read: true }
    ];

    this.listeners = [];

    // Set initial history state (popstate is handled centrally in index.html)
    window.history.replaceState({ page: 'landing' }, '', '#landing');
  }

  // Subscribe to state updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Broadcast state change
  broadcast(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  }

  // Switch Active Page view
  setPage(page, pushHistory = true) {
    if (!this.isLoggedIn && page !== 'login' && page !== 'landing' && page !== 'register') {
      page = 'landing';
    }
    this.activePage = page;
    
    if (pushHistory) {
      window.history.pushState({ page: page }, '', `#${page}`);
    }
    
    this.broadcast('pageChange', page);
  }

  // Go back to landing/home page
  goHome() {
    this.setPage('landing');
  }

  // Login authentication
  login() {
    this.isLoggedIn = true;
    this.sensors.connection = 'connected';
    this.setPage('dashboard');
    this.triggerToast('success', 'Logged in successfully! Welcome to your Smart Soil Dashboard.', 'সফলভাবে লগইন হয়েছে! আপনার স্মার্ট সয়েল ড্যাশবোর্ডে স্বাগতম।');
  }

  // Logout authentication
  logout() {
    this.isLoggedIn = false;
    // Go to landing page on logout, not login
    this.setPage('landing');
    this.triggerToast('info', 'Logged out successfully.', 'সফলভাবে লগআউট করা হয়েছে।');
  }

  // Toggle Language
  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('agri_lang', lang);
    this.broadcast('languageChange', lang);
  }

  // Toggle Theme
  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('agri_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    this.broadcast('themeChange', theme);
  }

  // Trigger brief floating notifications (Toasts)
  triggerToast(type, textEn, textBn) {
    this.toastNotification = { type, textEn, textBn, id: Date.now() };
    this.broadcast('toast', this.toastNotification);
  }

  // Dismiss Toast
  dismissToast() {
    this.toastNotification = null;
    this.broadcast('toast', null);
  }

  // Set Modal View
  openModal(type, config = {}) {
    this.activeModal = { type, config };
    this.broadcast('modal', this.activeModal);
  }

  // Close Modal
  closeModal() {
    this.activeModal = null;
    this.broadcast('modal', null);
  }

  // Update specific IoT sensor variables
  updateSensor(key, value) {
    this.sensors[key] = value;
    this.sensors.lastUpdated = new Date();
    this.broadcast('sensorUpdate', this.sensors);
  }

  // Trigger manual simulation of sensor readings fluctuating
  startSimulation() {
    setInterval(() => {
      if (!this.isLoggedIn || this.sensors.connection === 'offline') return;

      // Small fluctuating changes
      const moistureDelta = (Math.random() - 0.5) * 0.8;
      const tempDelta = (Math.random() - 0.5) * 0.4;
      const phDelta = (Math.random() - 0.5) * 0.05;

      const newMoisture = Math.max(10, Math.min(95, +(this.sensors.moisture + moistureDelta).toFixed(1)));
      const newTemp = Math.max(15, Math.min(45, +(this.sensors.temperature + tempDelta).toFixed(1)));
      const newPh = Math.max(3.5, Math.min(9.5, +(this.sensors.ph + phDelta).toFixed(2)));

      this.sensors.moisture = newMoisture;
      this.sensors.temperature = newTemp;
      this.sensors.ph = newPh;
      this.sensors.lastUpdated = new Date();

      // Trigger automatic warning toast if moisture drops too low
      if (newMoisture < 30 && Math.random() < 0.15) {
        this.addAlert('danger', 'criticalMoistureDrop', 
          `Critical Alert: Moisture dropped to ${newMoisture}% in Zone A!`, 
          `জরুরি সতর্কতা: জোন এ-তে আর্দ্রতা কমে ${newMoisture}% হয়েছে!`
        );
      }

      this.broadcast('sensorUpdate', this.sensors);
    }, 4000);
  }

  // Add notification to feed
  addAlert(type, key, msgEn, msgBn) {
    // Avoid spamming duplicate types
    if (this.alerts.some(a => a.key === key && !a.read)) return;
    
    const newAlert = {
      id: 'a_' + Date.now(),
      type,
      key,
      messageEn: msgEn,
      messageBn: msgBn,
      timestamp: new Date(),
      read: false
    };
    
    this.alerts.unshift(newAlert);
    this.triggerToast(type, msgEn, msgBn);
    this.broadcast('alertsUpdate', this.alerts);
  }

  // Dismiss an alert
  dismissAlert(id) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.broadcast('alertsUpdate', this.alerts);
  }

  // Clear all alerts
  clearAllAlerts() {
    this.alerts = [];
    this.broadcast('alertsUpdate', this.alerts);
  }
}

// Instantiate globally
window.appState = new AppStateManager();
// Initial setup of root element theme
window.appState.setTheme(window.appState.theme);
// Start simulating live data
window.appState.startSimulation();
