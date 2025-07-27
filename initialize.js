// Global Instances
let amiChatbot;
let jobSearchAPI;

// Global API connectors
const CareerAPI = {
  // BLS API connector
  BLS: {
    fetchJobData: async (occupation) => {
      console.log(`Fetching BLS data for ${occupation}`);
      // Simulate API call to BLS
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            occupation: occupation,
            growth_rate: (Math.random() * 30).toFixed(1),
            median_salary: Math.floor(50000 + Math.random() * 100000),
            top_industries: ["Technology", "Healthcare", "Finance"],
            outlook: "Positive",
            updated: new Date().toISOString()
          });
        }, 500);
      });
    }
  },
  
  // Job search and alerts
  Jobs: {
    getRecommendedJobs: async (skills) => {
      console.log(`Finding job matches for skills: ${skills.join(', ')}`);
      // Simulate job search API
      return new Promise(resolve => {
        setTimeout(() => {
          const companies = ["Microsoft", "Google", "Amazon", "Apple", "Meta", "IBM", "Oracle"];
          const jobTitles = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer"];
          const locations = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote"];
          
          const jobs = [];
          const count = 3 + Math.floor(Math.random() * 5);
          
          for (let i = 0; i < count; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const matchScore = Math.floor(70 + Math.random() * 30);
            
            jobs.push({
              id: `job-${Date.now()}-${i}`,
              company: company,
              title: title,
              location: location,
              matchScore: matchScore,
              postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              url: `https://example.com/jobs/${company.toLowerCase()}-${title.toLowerCase().replace(/\s+/g, '-')}`
            });
          }
          
          resolve(jobs);
        }, 800);
      });
    },
    
    setupJobAlerts: (frequency, skills) => {
      console.log(`Setting up job alerts: ${frequency} for skills: ${skills.join(', ')}`);
      localStorage.setItem('jobAlerts', JSON.stringify({
        frequency: frequency,
        skills: skills,
        enabled: true,
        lastChecked: new Date().toISOString()
      }));
      return true;
    }
  },
  
  // Learning paths
  Learning: {
    getRecommendedCourses: async (skills, goals) => {
      console.log(`Finding courses for skills: ${skills.join(', ')} with goals: ${goals}`);
      // Simulate course recommendations API
      return new Promise(resolve => {
        setTimeout(() => {
          const platforms = ["Coursera", "Udemy", "LinkedIn Learning", "edX", "Pluralsight"];
          const durations = ["4 weeks", "2 months", "6 weeks", "3 months", "8 weeks"];
          const levels = ["Beginner", "Intermediate", "Advanced"];
          
          const courses = [];
          const count = 3 + Math.floor(Math.random() * 3);
          
          for (let i = 0; i < count; i++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const title = `${skills[Math.floor(Math.random() * skills.length)]} Masterclass`;
            const duration = durations[Math.floor(Math.random() * durations.length)];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const rating = (3.5 + Math.random() * 1.5).toFixed(1);
            
            courses.push({
              id: `course-${Date.now()}-${i}`,
              title: title,
              platform: platform,
              duration: duration,
              level: level,
              rating: rating,
              relevanceScore: Math.floor(70 + Math.random() * 30),
              url: `https://example.com/courses/${platform.toLowerCase()}-${title.toLowerCase().replace(/\s+/g, '-')}`
            });
          }
          
          resolve(courses);
        }, 700);
      });
    }
  },
  
  // Resume analysis
  Resume: {
    analyzeResume: async (resumeText) => {
      console.log(`Analyzing resume text (${resumeText.length} chars)`);
      // Simulate resume analysis
      return new Promise(resolve => {
        setTimeout(() => {
          // Extract skills from resume text (simplified)
          const techSkills = ["JavaScript", "Python", "React", "TypeScript", "Node.js", "AWS", "SQL", "Docker"];
          const softSkills = ["Communication", "Leadership", "Teamwork", "Problem Solving", "Creativity"];
          
          const extractedTechSkills = techSkills.filter(() => Math.random() > 0.5);
          const extractedSoftSkills = softSkills.filter(() => Math.random() > 0.6);
          
          const missingSkills = techSkills.filter(skill => !extractedTechSkills.includes(skill))
            .filter(() => Math.random() > 0.7);
          
          resolve({
            skills: {
              technical: extractedTechSkills,
              soft: extractedSoftSkills
            },
            gaps: missingSkills,
            strengths: extractedTechSkills.slice(0, 2),
            improvements: missingSkills.slice(0, 2),
            matchScore: Math.floor(60 + Math.random() * 40),
          });
        }, 1200);
      });
    }
  },
  
  // Interview preparation
  Interview: {
    getQuestions: async (jobTitle, company) => {
      console.log(`Getting interview questions for ${jobTitle} at ${company}`);
      // Simulate interview questions API
      return new Promise(resolve => {
        setTimeout(() => {
          const generalQuestions = [
            "Tell me about yourself",
            "Why do you want to work here?",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?",
            "Describe a challenging situation and how you handled it"
          ];
          
          const technicalQuestions = {
            "Software Engineer": [
              "Explain the difference between let, const, and var in JavaScript",
              "What is the time complexity of binary search?",
              "Describe the MVC architecture pattern",
              "How would you handle API errors in a React application?",
              "What's the difference between a shallow and deep copy?"
            ],
            "Data Scientist": [
              "Explain the difference between supervised and unsupervised learning",
              "How would you handle missing data in a dataset?",
              "What is overfitting and how can you prevent it?",
              "Explain the bias-variance tradeoff",
              "How would you evaluate a classification model?"
            ],
            "Product Manager": [
              "How do you prioritize features?",
              "Describe your process for product discovery",
              "How do you work with engineers and designers?",
              "How do you measure the success of a product?",
              "Tell me about a product you launched that failed"
            ]
          };
          
          const defaultTechnical = [
            "What are your technical strengths?",
            "Describe a challenging technical problem you solved",
            "How do you stay updated with industry trends?",
            "What's your approach to learning new technologies?",
            "How do you ensure the quality of your work?"
          ];
          
          resolve({
            general: generalQuestions,
            technical: technicalQuestions[jobTitle] || defaultTechnical,
            company_specific: [
              `What do you know about ${company}'s products/services?`,
              `Why do you want to work at ${company} specifically?`,
              `How do you align with ${company}'s values?`
            ]
          });
        }, 600);
      });
    }
  }
};

// Enhanced notification system with job alerts
class NotificationManager {
  constructor() {
    this.initializeContainer();
    this.queue = [];
    this.isProcessing = false;
    this.checkJobAlerts();
    
    // Set up recurring checks
    setInterval(() => this.checkJobAlerts(), 60000); // Check every minute
  }
  
  initializeContainer() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-5 right-5 z-50 flex flex-col items-end space-y-2';
      document.body.appendChild(container);
    }
  }
  
  notify(message, type = 'info', duration = 5000) {
    this.queue.push({ message, type, duration });
    if (!this.isProcessing) {
      this.processQueue();
    }
    return this;
  }
  
  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    const { message, type, duration } = this.queue.shift();
    
    await this.showNotification(message, type, duration);
    this.processQueue();
  }
  
  showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    // Set notification style based on type
    const bgColor = {
      'success': 'bg-gradient-to-r from-emerald-500 to-teal-500',
      'error': 'bg-gradient-to-r from-red-500 to-pink-500',
      'warning': 'bg-gradient-to-r from-yellow-500 to-amber-500',
      'info': 'bg-gradient-to-r from-blue-500 to-indigo-500',
      'job': 'bg-gradient-to-r from-purple-500 to-indigo-500'
    }[type] || 'bg-gradient-to-r from-blue-500 to-indigo-500';
    
    const iconClass = {
      'success': 'fa-check-circle',
      'error': 'fa-exclamation-circle',
      'warning': 'fa-exclamation-triangle',
      'info': 'fa-info-circle',
      'job': 'fa-briefcase'
    }[type] || 'fa-info-circle';
    
    notification.className = `notification p-4 rounded-lg shadow-lg flex items-center ${bgColor} text-white transform transition-all duration-300 ease-in-out opacity-0 translate-x-10 max-w-sm`;
    
    const icon = document.createElement('i');
    icon.className = `fas ${iconClass} mr-3`;
    
    const content = document.createElement('div');
    content.className = 'flex-1';
    
    if (typeof message === 'string') {
      content.textContent = message;
    } else {
      content.innerHTML = message;
    }
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-3 text-white hover:text-gray-200 focus:outline-none';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => this.removeNotification(notification);
    
    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    container.appendChild(notification);
    
    // Trigger animation
    return new Promise(resolve => {
      // Show notification
      setTimeout(() => {
        notification.classList.remove('opacity-0', 'translate-x-10');
      }, 10);
      
      // Set timeout to hide notification
      setTimeout(() => {
        this.removeNotification(notification);
        resolve();
      }, duration);
    });
  }
  
  removeNotification(notification) {
    notification.classList.add('opacity-0', 'translate-x-10');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  async checkJobAlerts() {
    const alertsConfig = localStorage.getItem('jobAlerts');
    if (!alertsConfig) return;
    
    try {
      const { frequency, skills, enabled, lastChecked } = JSON.parse(alertsConfig);
      if (!enabled) return;
      
      const now = new Date();
      const lastCheckedDate = new Date(lastChecked);
      const hoursSinceLastCheck = (now - lastCheckedDate) / (1000 * 60 * 60);
      
      // Check if it's time to alert based on frequency
      const checkFrequencies = {
        'daily': 24,
        'hourly': 1,
        'weekly': 168
      };
      
      if (hoursSinceLastCheck < (checkFrequencies[frequency] || 24)) {
        return;
      }
      
      // Fetch new job matches
      const jobs = await CareerAPI.Jobs.getRecommendedJobs(skills);
      
      // Update last checked time
      const updatedConfig = JSON.parse(alertsConfig);
      updatedConfig.lastChecked = now.toISOString();
      localStorage.setItem('jobAlerts', JSON.stringify(updatedConfig));
      
      // Show notification if we have matches
      if (jobs.length > 0) {
        const jobMessage = `
          <div>
            <p class="font-medium">Found ${jobs.length} new job matches!</p>
            <p class="text-sm mt-1">${jobs[0].title} at ${jobs[0].company}</p>
            <p class="text-xs mt-1">Click to view all matches</p>
          </div>
        `;
        
        this.notify(jobMessage, 'job', 8000);
      }
    } catch (error) {
      console.error('Error checking job alerts:', error);
    }
  }
}

// DOM Content Loaded - Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded - initializing Career Mentor App');
  
  // Initialize the app with all components
  const app = new CareerMentorApp();
  
  // Make it globally available
  window.careerMentorApp = app;

  // Initialize JobSearchAPI if it exists
  if (typeof JobSearchAPI === 'function') {
    jobSearchAPI = new JobSearchAPI().init();
    console.log('Job Search API component initialized');
  } else {
    console.warn('JobSearchAPI class not found, component not initialized');
  }

  // Ensure AMI chatbot is properly initialized
  initializeAMIChatbot();
});

// Helper function to initialize AMI chatbot
function initializeAMIChatbot() {
  console.log('Initializing AMI chatbot from helper function');
  
  // Wait for AMIChatbot class to be available
  if (window.AMIChatbot && !window.amiChatbot) {
    console.log('AMIChatbot class found, creating instance');
    window.amiChatbot = new AMIChatbot();
    window.amiChatbot.init();
    
    // Add global click handler for AMI buttons
    addAMIButtonHandlers();
  } else {
    // Try again shortly (might still be loading)
    setTimeout(function() {
      if (!window.amiChatbot && window.AMIChatbot) {
        console.log('Delayed initialization of AMI chatbot');
        window.amiChatbot = new AMIChatbot();
        window.amiChatbot.init();
        addAMIButtonHandlers();
      }
    }, 1000);
  }
}

// Helper function to add click handlers to AMI buttons
function addAMIButtonHandlers() {
  const amiButtons = document.querySelectorAll('#ami-button, #ami-button-top, #ami-button-nav, .ami-button, [id^="ami-button"]');
  console.log(`Found ${amiButtons.length} AMI buttons to attach handlers to`);
  
  amiButtons.forEach(btn => {
    // Use direct onclick instead of addEventListener to avoid conflicts
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`AMI button clicked: ${btn.id || 'unnamed'}`);
      
      if (window.amiChatbot) {
        window.amiChatbot.toggleVisibility(true);
      } else if (window.AMIChatbot) {
        console.log('Creating new AMI chatbot instance on button click');
        window.amiChatbot = new AMIChatbot();
        window.amiChatbot.init();
        window.amiChatbot.toggleVisibility(true);
      }
      return false;
    };
  });
}

// Career Mentor Initialization Script
// Handles authentication, user data management, and feature modules initialization

// User Management
class UserManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.initializeFromStorage();
    this.setupNotifications();
  }

  initializeFromStorage() {
    // Try to get user data from localStorage first (persistent)
    const storedUser = localStorage.getItem('currentUser');
    // Also check sessionStorage (for current session only)
    const sessionUser = sessionStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    } else if (sessionUser) {
      try {
        this.currentUser = JSON.parse(sessionUser);
        this.isAuthenticated = true;
      } catch (e) {
        console.error('Error parsing user data from sessionStorage:', e);
      }
    }

    // Legacy compatibility - try to get from old storage keys
    if (!this.isAuthenticated) {
      this.tryLegacyAuthentication();
    }

    // Check authentication status and redirect if needed
    this.checkAuthStatus();
  }
  
  tryLegacyAuthentication() {
    // Try old storage format for compatibility
    const sessionLoggedIn = sessionStorage.getItem('userLoggedIn');
    const localLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (sessionLoggedIn === 'true' || localLoggedIn === 'true') {
      const name = sessionStorage.getItem('userName') || localStorage.getItem('userName') || 'User';
      const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || 'user@example.com';
      
      this.currentUser = {
        name: name,
        email: email,
        id: 'legacy_' + Date.now(),
        role: 'user'
      };
      
      // Migrate to new format
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      this.isAuthenticated = true;
    }
  }

  setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.className = 'fixed top-5 right-5 z-50 flex flex-col items-end space-y-2';
      document.body.appendChild(notificationContainer);
    }
  }

  showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = `notification p-4 rounded-lg shadow-lg flex items-center ${
      type === 'success' 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
        : type === 'error'
          ? 'bg-gradient-to-r from-red-500 to-pink-500'
          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
    } text-white transform transition-all duration-300 ease-in-out opacity-0 translate-x-10 max-w-sm`;
    
    const icon = document.createElement('i');
    icon.className = `fas ${
      type === 'success' 
        ? 'fa-check-circle' 
        : type === 'error' 
          ? 'fa-exclamation-circle'
          : 'fa-info-circle'
    } mr-3`;
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.remove('opacity-0', 'translate-x-10');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-x-10');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  loginUser(email, password, rememberMe = false) {
    // Check if we have a users array in localStorage, if not create demo users
    this.ensureUsersExist();
    
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Check if user exists in stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            photoURL: user.photoURL
          };
          
          // Store in session storage (temporary for this session)
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          
          // If remember me is checked, also store in local storage
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
          
          this.isAuthenticated = true;
          this.showNotification(`Welcome back, ${this.currentUser.name}!`);
          resolve(this.currentUser);
        } else {
          this.showNotification('Invalid email or password', 'error');
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  }
  
  ensureUsersExist() {
    // Check if we have users array, if not create demo users
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
      console.error('Error parsing users:', e);
      users = [];
    }
    
    if (users.length === 0) {
      // Create demo user
      users.push({
        id: 'user_1',
        name: 'Demo User',
        email: 'user@example.com',
        password: 'password', // In a real app, NEVER store plain text passwords
        role: 'user',
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing users or create new array
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
          console.error('Error parsing users:', e);
          users = [];
        }
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
          this.showNotification('Email already registered', 'error');
          reject(new Error('Email already registered'));
          return;
        }
        
        // Create new user
        const newUser = {
          id: 'user_' + Date.now().toString(),
          name,
          email,
          password, // In a real app, this would be hashed
          role: 'user',
          created: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user
        this.currentUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        };
        
        // Store in both storages for consistency
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.isAuthenticated = true;
        this.showNotification('Account created successfully!');
        resolve(this.currentUser);
      }, 800);
    });
  }

  googleAuth() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock Google user
        const googleUser = {
          id: 'google_' + Date.now().toString(),
          name: 'Google User',
          email: 'google.user@gmail.com',
          role: 'user',
          photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=4f46e5&color=fff'
        };
        
        // Check if we already have this Google user
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
          console.error('Error parsing users:', e);
          users = [];
        }
        
        // Add Google user if not already in the list (without password)
        if (!users.some(u => u.email === googleUser.email)) {
          users.push({
            ...googleUser,
            password: null,
            created: new Date().toISOString()
          });
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        this.currentUser = googleUser;
        this.isAuthenticated = true;
        
        // Store in both storages
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showNotification('Signed in with Google successfully!');
        resolve(this.currentUser);
      }, 1000);
    });
  }

  logoutUser() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear both storages
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Clear old formats too
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userName');
    
    // Redirect to login page
    window.location.href = 'login.html';
  }

  checkAuthStatus() {
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Pages that require authentication
    const protectedPages = ['dashboard.html'];
    // Pages that should redirect to dashboard if already logged in
    const authPages = ['login.html', 'signup.html'];
    
    if (protectedPages.includes(currentPath) && !this.isAuthenticated) {
      // Redirect to login if trying to access protected page without auth
      window.location.href = 'login.html';
    } else if (authPages.includes(currentPath) && this.isAuthenticated) {
      // Redirect to dashboard if trying to access login/signup while logged in
      window.location.href = 'dashboard.html';
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

// Enhanced Career Mentor App with feature integration
class CareerMentorApp {
  constructor() {
    // IMPORTANT: API keys have been removed for security. Set your own keys here or use environment variables.
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.openAiApiKey = process.env.OPENAI_API_KEY || '';
    // Initialize user management first
    this.userManager = new UserManager();
    
    // Initialize notifications
    this.notificationManager = new NotificationManager();
    
    // Load user profile data
    this.userProfile = this.loadUserProfile();
    
    // Initialize feature modules based on current page
    this.initFeatures();
    
    // Initialize AMI chatbot
    this.initAMIChatbot();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Update UI for current user
    this.updateUIForUser();

    // Method to get the Gemini API key
    this.getGeminiApiKey = function() {
      if (!this.geminiApiKey) {
        console.warn('Gemini API key is not set. Please configure it in CareerMentorApp constructor.');
        if (this.notificationManager && typeof this.notificationManager.notify === 'function') {
          this.notificationManager.notify('Warning: Gemini AI features may be limited. API key not configured.', 'warning', 7000);
        }
        return null;
      }
      return this.geminiApiKey;
    };

    // Method to get the OpenAI API key
    this.getOpenAiApiKey = function() {
      if (!this.openAiApiKey) {
        console.warn('OpenAI API key is not set. Please configure it in CareerMentorApp constructor.');
        if (this.notificationManager && typeof this.notificationManager.notify === 'function') {
          this.notificationManager.notify('Warning: OpenAI AI features may be limited. API key not configured.', 'warning', 7000);
        }
        return null;
      }
      return this.openAiApiKey;
    };

    // Make the app instance globally available to access the API key
    window.careerMentorApp = this;
  }
  
  loadUserProfile() {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        return JSON.parse(storedProfile);
      } catch (e) {
        console.error('Error parsing user profile:', e);
      }
    }
    
    // Default profile if none exists
    const defaultProfile = {
      skills: [
        "JavaScript", "React", "HTML/CSS", 
        "Problem Solving", "Communication"
      ],
      experience: [],
      education: [],
      preferences: {
        jobTypes: ["Full-time"],
        locations: ["Remote", "San Francisco, CA"],
        industries: ["Technology", "Finance"]
      },
      goals: "Find a senior developer role with modern technologies",
      resumeAnalysis: null,
      savedJobs: [],
      appliedJobs: [],
      learningPaths: []
    };
    
    localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  
  saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
  }
  
  initFeatures() {
    // Initialize Resume Analyzer
    if (window.ResumeAnalyzer && document.getElementById('resume-section')) {
      this.resumeAnalyzer = new ResumeAnalyzer();
      this.resumeAnalyzer.init();
    }
    
    // Initialize Job Market Predictor
    if (window.JobMarketPredictor && document.getElementById('jobs-section')) {
      this.jobMarketPredictor = new JobMarketPredictor();
      this.jobMarketPredictor.init();
    }
    
    // Initialize Learning Path Manager
    if (window.LearningPathManager && document.getElementById('learning-section')) {
      this.learningPathManager = new LearningPathManager();
      this.learningPathManager.init();
    }
    
    // Initialize Job Autofill
    if (window.JobAutofill && document.getElementById('job-autofill-section')) {
      this.jobAutofill = new JobAutofill();
      this.jobAutofill.init();
    }
    
    // Initialize Work Assistant
    if (window.WorkAssistant && document.getElementById('tasks-section')) {
      this.workAssistant = new WorkAssistant();
      this.workAssistant.init();
    }
    
    // Initialize job alerts if logged in
    if (this.userManager.isAuthenticated) {
      this.initializeJobAlerts();
    }
    
    // If no feature classes are available but sections exist, simulate them
    this.simulateMissingFeatures();
  }

  // Initialize job alerts based on user profile
  initializeJobAlerts() {
    if (this.userProfile && this.userProfile.skills) {
      // Set up daily job alerts for user's skills
      CareerAPI.Jobs.setupJobAlerts('daily', this.userProfile.skills);
      
      // Show a welcome notification
      setTimeout(() => {
        this.notificationManager.notify(
          `Welcome back! We're monitoring job alerts for your skills.`, 
          'info', 
          5000
        );
      }, 2000);
    }
  }
  
  // Method to analyze a resume - can be called from AMI chatbot
  async analyzeResume(resumeText) {
    try {
      const analysis = await CareerAPI.Resume.analyzeResume(resumeText);
      
      // Store the results in user profile
      if (!this.userProfile) this.userProfile = this.loadUserProfile();
      this.userProfile.resumeAnalysis = {
        ...analysis,
        timestamp: new Date().toISOString()
      };
      this.saveUserProfile();
      
      // Show success notification
      this.notificationManager.notify(
        `Resume analyzed! Found ${analysis.skills.technical.length} technical skills.`, 
        'success'
      );
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      this.notificationManager.notify(
        'Error analyzing resume. Please try again later.', 
        'error'
      );
      throw error;
    }
  }
  
  // Method to get job recommendations - can be called from AMI chatbot
  async getJobRecommendations() {
    if (!this.userProfile || !this.userProfile.skills || this.userProfile.skills.length === 0) {
      this.notificationManager.notify(
        'Please update your skills in your profile first.', 
        'warning'
      );
      return [];
    }
    
    try {
      const jobs = await CareerAPI.Jobs.getRecommendedJobs(this.userProfile.skills);
      
      // Store the first 3 recommendations in user profile
      if (jobs.length > 0) {
        if (!this.userProfile.recentJobRecommendations) {
          this.userProfile.recentJobRecommendations = [];
        }
        this.userProfile.recentJobRecommendations = jobs.slice(0, 3);
        this.saveUserProfile();
      }
      
      // Show success notification if jobs found
      if (jobs.length > 0) {
        this.notificationManager.notify(
          `Found ${jobs.length} job matches for your skills!`,
          'job'
        );
      }
      
      return jobs;
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      this.notificationManager.notify(
        'Error finding job matches. Please try again later.',
        'error'
      );
      return [];
    }
  }
  
  // Method to get learning recommendations - can be called from AMI chatbot
  async getLearningRecommendations() {
    if (!this.userProfile || !this.userProfile.skills || this.userProfile.skills.length === 0) {
      this.notificationManager.notify(
        'Please update your skills in your profile first.',
        'warning'
      );
      return [];
    }
    
    try {
      const courses = await CareerAPI.Learning.getRecommendedCourses(
        this.userProfile.skills,
        this.userProfile.goals || "career advancement"
      );
      
      // Store the recommendations in user profile
      if (courses.length > 0) {
        if (!this.userProfile.recommendedCourses) {
          this.userProfile.recommendedCourses = [];
        }
        this.userProfile.recommendedCourses = courses;
        this.saveUserProfile();
      }
      
      // Show success notification
      if (courses.length > 0) {
        this.notificationManager.notify(
          `Found ${courses.length} learning paths for your career goals!`,
          'info'
        );
      }
      
      return courses;
    } catch (error) {
      console.error('Error getting learning recommendations:', error);
      this.notificationManager.notify(
        'Error finding learning paths. Please try again later.',
        'error'
      );
      return [];
    }
  }
  
  // Method to get interview questions - can be called from AMI chatbot
  async getInterviewQuestions(jobTitle, company) {
    try {
      const questions = await CareerAPI.Interview.getQuestions(
        jobTitle || "Software Engineer",
        company || "a tech company"
      );
      
      // Show notification
      this.notificationManager.notify(
        `Generated ${questions.technical.length + questions.general.length} interview questions!`,
        'info'
      );
      
      return questions;
    } catch (error) {
      console.error('Error getting interview questions:', error);
      this.notificationManager.notify(
        'Error generating interview questions. Please try again later.',
        'error'
      );
      throw error;
    }
  }
  
  // Method to get market insights - can be called from AMI chatbot
  async getMarketInsights(occupation) {
    try {
      const insights = await CareerAPI.BLS.fetchJobData(
        occupation || "Software Developer"
      );
      
      // Show notification
      this.notificationManager.notify(
        `Job market outlook for ${insights.occupation}: ${insights.outlook}`,
        'info'
      );
      
      return insights;
    } catch (error) {
      console.error('Error getting market insights:', error);
      this.notificationManager.notify(
        'Error fetching job market data. Please try again later.',
        'error'
      );
      throw error;
    }
  }
  
  // Add other methods from existing code...

  initAMIChatbot() {
    console.log('initAMIChatbot called from CareerMentorApp');
    // Initialize AMI chatbot if the class exists
    if (window.AMIChatbot) {
      if (!window.amiChatbot) {
        console.log('Creating AMI chatbot instance from CareerMentorApp');
        window.amiChatbot = new AMIChatbot();
        window.amiChatbot.init();
        
        // Re-attach event listeners to all buttons
        this.attachAMIButtonListeners();
      }
    } else {
      console.warn('AMI Chatbot module not found');
      // Try to load the script dynamically
      this.loadAMIChatbotScript();
    }
  }
  
  loadAMIChatbotScript() {
    const script = document.createElement('script');
    script.src = 'ami-chatbot.js';
    script.onload = () => {
      if (window.AMIChatbot) {
        window.amiChatbot = new AMIChatbot();
        window.amiChatbot.init();
        console.log('AMI Chatbot loaded and initialized dynamically');
        
        // Re-attach event listeners to buttons
        this.attachAMIButtonListeners();
      }
    };
    script.onerror = () => console.error('Failed to load AMI Chatbot script');
    document.head.appendChild(script);
  }
  
  attachAMIButtonListeners() {
    console.log('attachAMIButtonListeners called from CareerMentorApp');
    const amiButtons = document.querySelectorAll('#ami-button, #ami-button-top, #ami-button-nav, .ami-button, [id^="ami-button"], .ami-feature-btn');
    console.log(`Found ${amiButtons.length} AMI buttons in CareerMentorApp`);
    
    amiButtons.forEach(btn => {
      console.log(`Processing button: ${btn.id || 'unnamed'} in CareerMentorApp`);
      // Use onclick to override any existing handlers
      btn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        console.log(`AMI button clicked from CareerMentorApp: ${btn.id || 'unnamed'}`);
        
        if (window.amiChatbot) {
          console.log('Toggling AMI visibility');
          window.amiChatbot.toggleVisibility(true);
          
          // Handle feature buttons
          if (btn.classList.contains('ami-feature-btn') && btn.dataset.feature && window.amiChatbot.inputField) {
            const feature = btn.dataset.feature;
            let query = '';
            
            switch(feature) {
              case 'resume-section':
                query = 'Tell me about the Resume Analysis feature';
                break;
              case 'jobs-section':
                query = 'How does the Job Market Predictions feature work?';
                break;
              case 'learning-section':
                query = 'What does the Learning Paths feature do?';
                break;
              case 'job-autofill-section':
                query = 'How can Smart Job Autofill help me?';
                break;
              case 'tasks-section':
                query = 'What is the Work Assistant feature?';
                break;
              default:
                query = 'Tell me about this feature';
            }
            
            window.amiChatbot.inputField.value = query;
            setTimeout(() => window.amiChatbot.sendMessage(), 300);
          }
        } else {
          console.warn('AMI Chatbot not initialized');
          // Try to initialize it now
          if (window.AMIChatbot) {
            console.log('Creating new AMI instance on button click');
            window.amiChatbot = new AMIChatbot();
            window.amiChatbot.init();
            window.amiChatbot.toggleVisibility(true);
          }
        }
        return false;
      };
    });
  }

  updateUIForUser() {
    // Update UI based on authentication status
    const user = this.userManager.getCurrentUser();
    
    if (!user) return;
    
    // Update user info in navbar if it exists
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    const userImageElements = document.querySelectorAll('.user-image');
    
    userNameElements.forEach(el => {
      if (el) el.textContent = user.name;
    });
    
    userEmailElements.forEach(el => {
      if (el) el.textContent = user.email;
    });
    
    userImageElements.forEach(el => {
      if (el) {
        // Set a default profile image or use user's image if available
        if (user.photoURL) {
          el.src = user.photoURL;
        } else {
          el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`;
        }
      }
    });
  }

  setupEventListeners() {
    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me')?.checked || false;
        
        this.userManager.loginUser(email, password, rememberMe)
          .then(() => {
            window.location.href = 'dashboard.html';
          })
          .catch(error => {
            console.error('Login error:', error);
          });
      });
      
      // Google login button
      const googleLoginBtn = document.getElementById('google-login');
      if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.userManager.googleAuth()
            .then(() => {
              window.location.href = 'dashboard.html';
            });
        });
      }
    }
    
    // Setup signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        // Validate passwords match
        if (password !== passwordConfirm) {
          this.userManager.showNotification('Passwords do not match', 'error');
          return;
        }
        
        this.userManager.registerUser(name, email, password)
          .then(() => {
            window.location.href = 'dashboard.html';
          })
          .catch(error => {
            console.error('Signup error:', error);
          });
      });
      
      // Google signup button
      const googleSignupBtn = document.getElementById('google-signup');
      if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.userManager.googleAuth()
            .then(() => {
              window.location.href = 'dashboard.html';
            });
        });
      }
    }
    
    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('.logout-button');
    logoutBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.userManager.logoutUser();
        });
      }
    });
    
    // Setup user dropdown toggle
    const userDropdownButton = document.getElementById('user-dropdown-button');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (userDropdownButton && userDropdownMenu) {
      userDropdownButton.addEventListener('click', () => {
        userDropdownMenu.classList.toggle('hidden');
      });
      
      // Close the dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!userDropdownButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
          userDropdownMenu.classList.add('hidden');
        }
      });
    }
    
    // Handle mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    
    if (mobileMenuButton && mobileSidebar) {
      mobileMenuButton.addEventListener('click', () => {
        mobileSidebar.classList.toggle('-translate-x-full');
      });
    }
    
    // Handle AMI button clicks - use the dedicated method for better organization
    this.attachAMIButtonListeners();
  }
}

// Make CareerAPI available globally
window.CareerAPI = CareerAPI;

// Export the notification manager for use in other modules
if (typeof window !== 'undefined') {
  window.NotificationManager = NotificationManager;
}