/**
 * Career Mentor Application
 * Main initialization script
 */

// Main application class
class CareerMentorApp {
  constructor() {
    this.userProfile = new UserProfileManager();
    this.resumeAnalyzer = new ResumeAnalyzer();
    this.careerApi = new CareerApi();
    this.notificationManager = new NotificationManager();
    this.amiChatbot = new AmiChatbot();
    
    // Initialize Smart Job Autofill if available
    if (typeof SmartJobAutofill !== 'undefined') {
      this.smartJobAutofill = new SmartJobAutofill();
    }
    
    console.log('Career Mentor App initialized');
    
    // Dispatch event when app is fully loaded
    window.dispatchEvent(new CustomEvent('careerMentorLoaded'));
  }
}

// User Profile Manager
class UserProfileManager {
  constructor() {
    this.userData = {
      isLoggedIn: false,
      name: '',
      email: '',
      id: '',
      skills: [],
      experience: [],
      education: [],
      jobPreferences: {}
    };
    
    // Check local storage for existing session
    this.checkExistingSession();
  }
  
  checkExistingSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn === 'true' && userName) {
      this.userData.isLoggedIn = true;
      this.userData.name = userName;
      this.userData.email = `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      this.userData.id = 'user-' + Date.now();
    }
  }
  
  login(userData) {
    this.userData = {
      ...userData,
      isLoggedIn: true
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userData.name);
    
    console.log('User logged in:', this.userData.name);
  }
  
  logout() {
    this.userData = {
      isLoggedIn: false,
      name: '',
      email: '',
      id: '',
      skills: [],
      experience: [],
      education: [],
      jobPreferences: {}
    };
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    
    console.log('User logged out');
  }
  
  getUserData() {
    return this.userData;
  }
  
  updateProfile(updatedData) {
    this.userData = {
      ...this.userData,
      ...updatedData
    };
    
    console.log('Profile updated');
    return this.userData;
  }
}

// Resume Analyzer
class ResumeAnalyzer {
  constructor() {
    this.analysisData = null;
  }
  
  analyzeResume(resumeData) {
    // In a real app, this would send the resume to an AI service
    console.log('Analyzing resume...');
    
    // Mock analysis for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        this.analysisData = {
          score: 82,
          atsCompatibility: 76,
          strengths: [
            'Strong technical skills section',
            'Clear work experience descriptions',
            'Good use of action verbs'
          ],
          weaknesses: [
            'Missing quantifiable achievements',
            'Too many generic keywords',
            'Education section needs more detail'
          ],
          recommendations: [
            {
              type: 'improvement',
              text: 'Add measurable results to your job descriptions',
              priority: 'high'
            },
            {
              type: 'improvement',
              text: 'Tailor your resume to the specific job posting',
              priority: 'medium'
            },
            {
              type: 'improvement',
              text: 'Improve formatting consistency',
              priority: 'low'
            }
          ],
          keywordAnalysis: {
            relevant: ['JavaScript', 'React', 'Web Development'],
            missing: ['TypeScript', 'CI/CD', 'Testing']
          }
        };
        
        resolve(this.analysisData);
      }, 2000);
    });
  }
  
  getOptimizedResume() {
    // In a real app, this would generate an optimized resume
    console.log('Generating optimized resume...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          downloadUrl: '#',
          improvements: 8
        });
      }, 1500);
    });
  }
  
  getLastAnalysis() {
    return this.analysisData;
  }
}

// Career API
class CareerApi {
  constructor() {
    this.jobSearchResults = [];
  }
  
  searchJobs(criteria) {
    // In a real app, this would call an external job API
    console.log('Searching jobs with criteria:', criteria);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.jobSearchResults = [
          {
            id: 'job-1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'New York (Remote)',
            type: 'Full-time',
            salary: '$120k - $150k',
            description: 'We are looking for an experienced Frontend Developer...',
            skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
            posted: '2 days ago',
            matchScore: 94
          },
          {
            id: 'job-2',
            title: 'Full Stack Developer',
            company: 'InnovateSoft',
            location: 'Remote',
            type: 'Full-time',
            salary: '$100k - $130k',
            description: 'Join our team building innovative web applications...',
            skills: ['JavaScript', 'Node.js', 'MongoDB', 'AWS'],
            posted: '1 week ago',
            matchScore: 89
          },
          {
            id: 'job-3',
            title: 'UI/UX Designer',
            company: 'DesignWorks Studio',
            location: 'Boston (Hybrid)',
            type: 'Full-time',
            salary: '$90k - $120k',
            description: 'We need a talented UI/UX Designer to join our creative team...',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
            posted: '3 days ago',
            matchScore: 82
          }
        ];
        
        resolve(this.jobSearchResults);
      }, 1500);
    });
  }
  
  getJobDetails(jobId) {
    // In a real app, this would fetch details for a specific job
    console.log('Fetching job details for:', jobId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = this.jobSearchResults.find(j => j.id === jobId) || {
          id: jobId,
          title: 'Software Engineer',
          company: 'Tech Company',
          location: 'Remote',
          type: 'Full-time',
          salary: '$100k - $130k',
          description: 'Detailed job description would go here...',
          skills: ['JavaScript', 'React', 'Node.js'],
          posted: '1 week ago',
          matchScore: 85
        };
        
        resolve({
          ...job,
          fullDescription: 'This is a longer, more detailed job description...',
          requirements: [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years of experience with modern JavaScript frameworks',
            'Experience with RESTful APIs and backend integration',
            'Strong problem-solving skills and attention to detail'
          ],
          benefits: [
            'Competitive salary',
            'Remote work flexibility',
            'Health insurance',
            'Professional development budget',
            '401(k) matching'
          ],
          applicationProcess: '2-round interview process'
        });
      }, 1000);
    });
  }
  
  getMarketInsights(industry) {
    // In a real app, this would return market insights for an industry
    console.log('Getting market insights for:', industry);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          trendingSkills: ['Data Science', 'Machine Learning', 'React', 'Cloud Computing'],
          salaryTrends: {
            average: '$105,000',
            trend: '+5% from last year',
            byExperience: {
              entry: '$80,000',
              mid: '$110,000',
              senior: '$140,000'
            }
          },
          demandForecast: 'High growth expected over next 3 years',
          geographicHotspots: ['San Francisco', 'New York', 'Austin', 'Remote']
        });
      }, 1500);
    });
  }
}

// Notification Manager
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.containerEl = null;
    this.createNotificationContainer();
  }
  
  createNotificationContainer() {
    if (document.getElementById('notification-container')) return;
    
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '350px';
    
    document.body.appendChild(container);
    this.containerEl = container;
  }
  
  notify(message, type = 'info', duration = 4000) {
    if (!this.containerEl) this.createNotificationContainer();
    
    const id = 'notif-' + Date.now();
    this.notifications.push({ id, message, type });
    
    const notificationEl = document.createElement('div');
    notificationEl.id = id;
    notificationEl.classList.add('notification');
    notificationEl.style.marginBottom = '10px';
    notificationEl.style.padding = '12px 16px';
    notificationEl.style.borderRadius = '8px';
    notificationEl.style.backgroundColor = 'rgba(17, 24, 39, 0.9)';
    notificationEl.style.backdropFilter = 'blur(10px)';
    notificationEl.style.border = '1px solid rgba(79, 70, 229, 0.3)';
    notificationEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    notificationEl.style.color = '#fff';
    notificationEl.style.display = 'flex';
    notificationEl.style.alignItems = 'center';
    notificationEl.style.justifyContent = 'space-between';
    notificationEl.style.transition = 'all 0.3s ease';
    notificationEl.style.opacity = '0';
    notificationEl.style.transform = 'translateY(10px)';
    
    let icon = '';
    if (type === 'success') {
      icon = '<i class="fas fa-check-circle" style="color: #10B981; margin-right: 12px;"></i>';
    } else if (type === 'error') {
      icon = '<i class="fas fa-times-circle" style="color: #EF4444; margin-right: 12px;"></i>';
    } else if (type === 'warning') {
      icon = '<i class="fas fa-exclamation-circle" style="color: #F59E0B; margin-right: 12px;"></i>';
    } else {
      icon = '<i class="fas fa-info-circle" style="color: #3B82F6; margin-right: 12px;"></i>';
    }
    
    notificationEl.innerHTML = `
      <div style="display: flex; align-items: center;">
        ${icon}
        <span>${message}</span>
      </div>
      <button style="background: none; border: none; color: #6B7280; cursor: pointer; margin-left: 12px;">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    this.containerEl.appendChild(notificationEl);
    
    // Show notification with animation
    setTimeout(() => {
      notificationEl.style.opacity = '1';
      notificationEl.style.transform = 'translateY(0)';
    }, 10);
    
    // Attach close button event
    const closeBtn = notificationEl.querySelector('button');
    closeBtn.addEventListener('click', () => this.closeNotification(id));
    
    // Auto close after duration
    setTimeout(() => this.closeNotification(id), duration);
  }
  
  closeNotification(id) {
    const notificationEl = document.getElementById(id);
    if (!notificationEl) return;
    
    notificationEl.style.opacity = '0';
    notificationEl.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      if (notificationEl && notificationEl.parentNode) {
        notificationEl.parentNode.removeChild(notificationEl);
      }
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 300);
  }
}

// AMI Chatbot
class AmiChatbot {
  constructor() {
    this.isVisible = false;
    this.messages = [];
    this.containerEl = null;
    
    // Initialize the chatbot UI
    this.initChatbotUI();
    
    // Make chatbot available globally
    window.amiChatbot = this;
  }
  
  initChatbotUI() {
    const chatbotContainer = document.getElementById('ami-chatbot');
    if (!chatbotContainer) return;
    
    // Create chatbot UI
    chatbotContainer.innerHTML = `
      <div id="ami-chatbot-toggle" class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg z-40">
        <i class="fas fa-robot text-white text-xl"></i>
      </div>
      
      <div id="ami-chatbot-container" class="fixed bottom-6 right-6 w-80 md:w-96 rounded-lg overflow-hidden shadow-xl z-50 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-none">
        <div class="dark-glassmorphism border border-indigo-500/20 h-96 flex flex-col">
          <!-- Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <i class="fas fa-robot text-white"></i>
              </div>
              <div>
                <h3 class="text-white font-medium">AMI Assistant</h3>
                <p class="text-indigo-200 text-xs">Your AI career guide</p>
              </div>
            </div>
            <button id="ami-chatbot-close" class="text-white hover:text-indigo-200">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Messages -->
          <div id="ami-messages" class="flex-1 overflow-y-auto p-4 space-y-4"></div>
          
          <!-- Input -->
          <div class="border-t border-indigo-500/20 p-3">
            <div class="relative">
              <input id="ami-message-input" type="text" class="w-full bg-indigo-900/30 border border-indigo-500/30 rounded-full py-2 px-4 pr-10 text-white" placeholder="Ask AMI anything...">
              <button id="ami-send-button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-300">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.containerEl = document.getElementById('ami-chatbot-container');
    
    // Add event listeners
    document.getElementById('ami-chatbot-toggle').addEventListener('click', () => this.toggleVisibility());
    document.getElementById('ami-chatbot-close').addEventListener('click', () => this.toggleVisibility(false));
    
    const messageInput = document.getElementById('ami-message-input');
    document.getElementById('ami-send-button').addEventListener('click', () => this.sendMessage());
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // Add welcome message
    this.addMessage({
      sender: 'ami',
      text: 'Hi there! I\'m AMI, your AI career assistant. How can I help you today?',
      options: [
        'Resume feedback',
        'Job search tips',
        'Interview preparation',
        'Career advice'
      ]
    });
  }
  
  toggleVisibility(visible = null) {
    this.isVisible = visible !== null ? visible : !this.isVisible;
    
    if (this.isVisible) {
      this.containerEl.classList.remove('translate-y-2', 'opacity-0', 'pointer-events-none');
      document.getElementById('ami-message-input').focus();
    } else {
      this.containerEl.classList.add('translate-y-2', 'opacity-0', 'pointer-events-none');
    }
  }
  
  sendMessage() {
    const messageInput = document.getElementById('ami-message-input');
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    // Add user message
    this.addMessage({
      sender: 'user',
      text: text
    });
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process message and get response (in a real app, this would call an AI service)
    setTimeout(() => {
      this.hideTypingIndicator();
      
      // Generate demo response based on keywords
      let response = '';
      let options = [];
      
      if (text.toLowerCase().includes('resume')) {
        response = 'I can help you optimize your resume! Upload your resume in the Resume Analysis section, and I\'ll provide personalized feedback to increase your chances of getting interviews.';
        options = ['How does resume analysis work?', 'What makes a good resume?'];
      } else if (text.toLowerCase().includes('job') || text.toLowerCase().includes('search')) {
        response = 'Looking for a job? I can help you find relevant opportunities based on your skills and preferences. Check out the Job Search feature to get personalized job recommendations.';
        options = ['Job search strategies', 'How to stand out to recruiters'];
      } else if (text.toLowerCase().includes('interview')) {
        response = 'Preparing for interviews is crucial! I can help you practice with AI-simulated interviews tailored to your target roles. Visit the Interview Preparation section to get started.';
        options = ['Common interview questions', 'Behavioral interview tips'];
      } else if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('learn')) {
        response = 'Developing the right skills is key to career advancement. I can create a personalized learning path based on your career goals and current skill level.';
        options = ['In-demand skills for 2023', 'How to showcase skills'];
      } else {
        response = 'I\'m here to help with your career journey! You can ask me about resume optimization, job search strategies, interview preparation, skill development, or any other career-related topics.';
        options = ['Resume feedback', 'Job search tips', 'Interview preparation', 'Career advice'];
      }
      
      // Add AMI response
      this.addMessage({
        sender: 'ami',
        text: response,
        options: options
      });
    }, 1500);
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('ami-messages');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'ami-typing-indicator';
    typingIndicator.className = 'flex items-start';
    
    typingIndicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mr-2">
        <i class="fas fa-robot text-white text-sm"></i>
      </div>
      <div class="bg-indigo-900/50 rounded-lg rounded-tl-none py-2 px-3 max-w-[85%]">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
          <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
          <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('ami-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  addMessage(message) {
    this.messages.push(message);
    
    const messagesContainer = document.getElementById('ami-messages');
    const messageEl = document.createElement('div');
    
    if (message.sender === 'user') {
      messageEl.className = 'flex items-start justify-end';
      messageEl.innerHTML = `
        <div class="bg-indigo-600 rounded-lg rounded-tr-none py-2 px-3 max-w-[85%]">
          <p class="text-white">${message.text}</p>
        </div>
      `;
    } else {
      messageEl.className = 'flex items-start';
      
      let optionsHTML = '';
      if (message.options && message.options.length) {
        optionsHTML = `
          <div class="mt-2 flex flex-wrap gap-2">
            ${message.options.map(option => 
              `<button class="ami-suggestion-btn text-xs bg-indigo-900/70 hover:bg-indigo-800 text-indigo-300 px-2 py-1 rounded-full">${option}</button>`
            ).join('')}
          </div>
        `;
      }
      
      messageEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mr-2">
          <i class="fas fa-robot text-white text-sm"></i>
        </div>
        <div class="bg-indigo-900/50 rounded-lg rounded-tl-none py-2 px-3 max-w-[85%]">
          <p class="text-white">${message.text}</p>
          ${optionsHTML}
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageEl);
    
    // Add event listeners to suggestion buttons
    if (message.sender === 'ami' && message.options) {
      const suggestionButtons = messageEl.querySelectorAll('.ami-suggestion-btn');
      suggestionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById('ami-message-input').value = btn.textContent;
          this.sendMessage();
        });
      });
    }
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Career Mentor - Initialization Script
// This script handles common functionality across all pages

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentPage = window.location.pathname.split('/').pop();
  
  // Redirect to login if not logged in (except for login page)
  if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'index.html') {
    window.location.href = 'login.html';
    return;
  }
  
  // Update user name in navbar if logged in
  if (isLoggedIn) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
      const userName = localStorage.getItem('userName') || 'User';
      userNameElement.textContent = userName;
    }
    
    // Setup logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
      });
    }
  }
  
  // Initialize mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Handle active navigation highlighting
  highlightActiveNavItem();
  
  // Initialize dark mode toggle if present
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial state
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      darkModeToggle.checked = true;
    }
    
    // Handle toggle
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    });
  }
  
  // Load AMI chatbot on all pages
  loadScript('ami-chatbot.js');
});

// Helper function to highlight active navigation item
function highlightActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Find all nav links
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // If the href matches the current page
    if (href === currentPage) {
      // Add active class to desktop and mobile nav
      link.classList.add('text-indigo-500');
      link.classList.add('font-medium');
      
      // If this is inside a dropdown, expand the dropdown
      const dropdown = link.closest('.dropdown-content');
      if (dropdown) {
        dropdown.classList.remove('hidden');
        const dropdownButton = dropdown.previousElementSibling;
        if (dropdownButton) {
          dropdownButton.setAttribute('aria-expanded', 'true');
        }
      }
    }
  });
}

// Helper function to load scripts dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.careerMentorApp = new CareerMentorApp();
}); 