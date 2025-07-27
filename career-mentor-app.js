// Career Mentor App - Main Application Class
class CareerMentorApp {
  constructor() {
    // Components
    this.userProfile = null;
    this.careerAPI = null;
    this.amiChatbot = null;
    this.resumeAnalyzer = null;
    
    // State
    this.initialized = false;
    
    // Notification system
    this.notificationManager = new NotificationManager();
  }

  init() {
    console.log('Initializing Career Mentor App');
    
    // Initialize notification system
    this.notificationManager.init();
    
    // Initialize components
    this.initializeUserProfile();
    this.initializeCareerAPI();
    this.initializeAMIChatbot();
    this.initializeResumeAnalyzer();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Register global
    if (typeof window !== 'undefined') {
      window.careerMentorApp = this;
    }
    
    this.initialized = true;
    console.log('Career Mentor App initialized successfully');
    
    return this;
  }

  initializeUserProfile() {
    // Check if UserProfile exists
    if (typeof UserProfile === 'function') {
      this.userProfile = new UserProfile().init();
      console.log('User Profile component initialized');
    } else {
      console.warn('UserProfile class not found, component not initialized');
    }
  }

  initializeCareerAPI() {
    // Check if CareerAPI exists
    if (typeof CareerAPI === 'function') {
      this.careerAPI = new CareerAPI().init();
      console.log('Career API component initialized');
    } else {
      console.warn('CareerAPI class not found, component not initialized');
    }
  }

  initializeAMIChatbot() {
    // Check if AMIChatbot exists
    if (typeof AMIChatbot === 'function') {
      this.amiChatbot = new AMIChatbot().init();
      console.log('AMI Chatbot component initialized');
    } else {
      console.warn('AMIChatbot class not found, component not initialized');
    }
  }

  initializeResumeAnalyzer() {
    // Check if ResumeAnalyzer exists
    if (typeof ResumeAnalyzer === 'function') {
      this.resumeAnalyzer = new ResumeAnalyzer().init();
      console.log('Resume Analyzer component initialized');
    } else {
      console.warn('ResumeAnalyzer class not found, component not initialized');
    }
  }

  setupEventListeners() {
    // Listen for login/logout events
    window.addEventListener('user:login', this.handleUserLogin.bind(this));
    window.addEventListener('user:logout', this.handleUserLogout.bind(this));
    
    // Listen for profile updates
    window.addEventListener('user:profile:update', this.handleProfileUpdate.bind(this));
    
    // Track page navigation for analytics
    document.addEventListener('click', this.handleNavigation.bind(this));
  }

  handleUserLogin(event) {
    console.log('User login detected:', event.detail.userId);
    
    // Initialize components that require login
    this.initializePersonalizedFeatures();
    
    // Show welcome notification
    if (this.userProfile && this.userProfile.userData.name) {
      this.notificationManager.notify(
        `Welcome back, ${this.userProfile.userData.name}!`, 
        'success'
      );
    }
  }

  handleUserLogout(event) {
    console.log('User logout detected:', event.detail.userId);
    
    // Clean up as needed
    this.cleanupPersonalizedFeatures();
    
    // Show logout notification
    this.notificationManager.notify('You have been logged out successfully.', 'info');
  }

  handleProfileUpdate(event) {
    console.log('Profile update detected:', event.detail.userId);
    
    // Update relevant components
    if (this.amiChatbot && this.userProfile) {
      this.amiChatbot.setUserName(this.userProfile.userData.name);
    }
  }

  handleNavigation(event) {
    // Track navigation for analytics
    const target = event.target.closest('a');
    if (target && target.href) {
      const url = new URL(target.href);
      if (url.origin === window.location.origin) {
        console.log('Navigation tracked:', url.pathname);
        this.trackAnalytics('navigation', {
          path: url.pathname,
          userId: this.userProfile ? this.userProfile.userData.id : null
        });
      }
    }
  }

  initializePersonalizedFeatures() {
    // Initialize features that require user to be logged in
    console.log('Initializing personalized features');
    
    // Personalize AMI chatbot
    if (this.amiChatbot && this.userProfile) {
      this.amiChatbot.setUserName(this.userProfile.userData.name);
    }
  }

  cleanupPersonalizedFeatures() {
    // Clean up any personalized features on logout
    console.log('Cleaning up personalized features');
  }

  // Resume analysis methods
  analyzeResume(resumeText) {
    console.log('Analyzing resume from app layer');
    
    if (this.careerAPI) {
      return this.careerAPI.analyzeResume(resumeText);
    } else {
      return Promise.reject(new Error('Career API not initialized'));
    }
  }

  // Job recommendation methods
  getJobRecommendations(filters = {}) {
    console.log('Getting job recommendations from app layer');
    
    if (this.careerAPI) {
      return this.careerAPI.getJobRecommendations(filters);
    } else {
      return Promise.reject(new Error('Career API not initialized'));
    }
  }

  // Interview questions methods
  getInterviewQuestions(jobTitle, company) {
    console.log('Getting interview questions from app layer');
    
    if (this.careerAPI) {
      return this.careerAPI.getInterviewQuestions(jobTitle, company);
    } else {
      return Promise.reject(new Error('Career API not initialized'));
    }
  }

  // Learning recommendations methods
  getLearningRecommendations(skills) {
    console.log('Getting learning recommendations from app layer');
    
    if (this.careerAPI) {
      return this.careerAPI.getLearningRecommendations(skills);
    } else {
      return Promise.reject(new Error('Career API not initialized'));
    }
  }

  // Market insights methods
  getMarketInsights(occupation) {
    console.log('Getting market insights from app layer');
    
    if (this.careerAPI) {
      return this.careerAPI.getMarketInsights(occupation);
    } else {
      return Promise.reject(new Error('Career API not initialized'));
    }
  }

  // Gemini API methods
  getGeminiApiKey() {
    // Try to get from environment variables first
    if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
    
    // Fallback to hardcoded value from .env file
    // return 'AIzaSyDi54Bpx14wY8QZ6B5gVLd5LzSm-Mfw76I';
    // IMPORTANT: API key removed for security. Set your own key in environment variables or configuration.
    return '';
  }
  
  getGeminiApiModel() {
    // Try to get from environment variables first
    if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_MODEL) {
      return process.env.GEMINI_API_MODEL;
    }
    
    // Fallback to hardcoded value from .env file
    return 'gemini-pro';
  }

  // User profile methods
  saveUserProfile() {
    if (this.userProfile) {
      this.userProfile.saveToStorage();
    }
  }

  // Analytics tracking
  trackAnalytics(event, data) {
    // Simple analytics tracking - in a real app this would send to an analytics service
    console.log('Analytics:', event, data);
  }
}

// Notification Manager
class NotificationManager {
  constructor() {
    this.container = null;
    this.timeout = 5000; // Default timeout in milliseconds
    this.initialized = false;
  }

  init() {
    // Create notification container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
      document.body.appendChild(this.container);
    }
    
    this.initialized = true;
    console.log('Notification Manager initialized');
  }

  notify(message, type = 'info', timeout = this.timeout) {
    if (!this.initialized) {
      this.init();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `
      notification transform transition-all duration-300 ease-in-out translate-x-0 opacity-100
      dark-glassmorphism rounded-lg shadow-lg p-4 pr-10 max-w-md
      ${this.getTypeClass(type)}
    `;
    
    // Add icon based on type
    const icon = this.getTypeIcon(type);
    
    // Set content
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <i class="${icon} text-lg mr-3"></i>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-white">${message}</div>
        </div>
        <button class="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notification-progress h-1 bg-white/20 mt-2 rounded-full overflow-hidden">
        <div class="h-full bg-white/40 rounded-full" style="width: 100%; transition: width ${timeout}ms linear;"></div>
      </div>
    `;
    
    // Add to container
    this.container.appendChild(notification);
    
    // Set up click handler for close button
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
      this.closeNotification(notification);
    });
    
    // Start progress bar
    setTimeout(() => {
      const progressBar = notification.querySelector('.notification-progress div');
      progressBar.style.width = '0';
    }, 50);
    
    // Auto-close after timeout
    setTimeout(() => {
      this.closeNotification(notification);
    }, timeout);
    
    return notification;
  }

  closeNotification(notification) {
    // Add exit animation
    notification.classList.remove('translate-x-0', 'opacity-100');
    notification.classList.add('translate-x-full', 'opacity-0');
    
    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getTypeClass(type) {
    switch (type) {
      case 'success':
        return 'bg-green-900/60 border border-green-500/30';
      case 'error':
        return 'bg-red-900/60 border border-red-500/30';
      case 'warning':
        return 'bg-yellow-900/60 border border-yellow-500/30';
      case 'info':
      default:
        return 'bg-indigo-900/60 border border-indigo-500/30';
    }
  }

  getTypeIcon(type) {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-400';
      case 'error':
        return 'fas fa-exclamation-circle text-red-400';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-400';
      case 'info':
      default:
        return 'fas fa-info-circle text-indigo-400';
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize Career Mentor App
  const app = new CareerMentorApp().init();
  
  // Detect test mode from URL
  if (window.location.search.includes('test=true')) {
    console.log('Test mode detected');
    app.testMode = true;
  }
});