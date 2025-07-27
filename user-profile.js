// User Profile Manager
class UserProfile {
  constructor() {
    this.userData = {
      id: null,
      name: '',
      email: '',
      isLoggedIn: false,
      preferences: {},
      skills: [],
      experience: [],
      education: [],
      jobPreferences: {},
      savedJobs: [],
      applicationHistory: [],
      resumeAnalysis: null,
      learningProgress: {},
      tasks: []
    };
    
    this.storageKey = 'careerMentor_userProfile';
    this.initialized = false;
  }

  init() {
    console.log('Initializing User Profile');
    
    // Load from local storage if available
    this.loadFromStorage();
    
    // Make available globally
    if (typeof window !== 'undefined') {
      window.userProfile = this;
    }
    
    this.initialized = true;
    console.log('User Profile initialized', this.userData.isLoggedIn ? 'with user data' : 'without login');
    
    return this;
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.userData = JSON.parse(stored);
        console.log('User data loaded from storage');
      }
    } catch (error) {
      console.error('Error loading user data from storage:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
      console.log('User data saved to storage');
    } catch (error) {
      console.error('Error saving user data to storage:', error);
    }
  }

  login(userData) {
    this.userData = {
      ...this.userData,
      ...userData,
      isLoggedIn: true
    };
    
    this.saveToStorage();
    this.updateUIForLoggedInUser();
    
    // Publish login event
    this.publishEvent('user:login', { userId: this.userData.id });
    
    return this.userData;
  }

  logout() {
    const wasLoggedIn = this.userData.isLoggedIn;
    const userId = this.userData.id;
    
    // Reset user data
    this.userData = {
      id: null,
      name: '',
      email: '',
      isLoggedIn: false,
      preferences: {},
      skills: [],
      experience: [],
      education: [],
      jobPreferences: {},
      savedJobs: [],
      applicationHistory: [],
      resumeAnalysis: null,
      learningProgress: {},
      tasks: []
    };
    
    this.saveToStorage();
    this.updateUIForLoggedOutUser();
    
    // Publish logout event
    if (wasLoggedIn) {
      this.publishEvent('user:logout', { userId });
    }
    
    return true;
  }

  isLoggedIn() {
    return this.userData.isLoggedIn;
  }

  getUserData() {
    return this.userData;
  }

  updateProfile(profileData) {
    this.userData = {
      ...this.userData,
      ...profileData
    };
    
    this.saveToStorage();
    this.publishEvent('user:profile:update', { userId: this.userData.id });
    
    return this.userData;
  }

  updateUIForLoggedInUser() {
    // Update UI elements based on login state
    const loginButton = document.getElementById('login-button');
    const userProfileButton = document.getElementById('user-profile-button');
    const usernameDisplay = document.getElementById('username-display');
    
    // Hide login button if it exists
    if (loginButton) {
      loginButton.style.display = 'none';
    }
    
    // Show profile button if it exists
    if (userProfileButton) {
      userProfileButton.style.display = 'flex';
    }
    
    // Update username display if it exists
    if (usernameDisplay) {
      usernameDisplay.textContent = this.userData.name;
      usernameDisplay.style.display = 'block';
    }
    
    // Check if AMI chatbot exists and update it
    if (window.amiChatbot && typeof window.amiChatbot.setUserName === 'function') {
      window.amiChatbot.setUserName(this.userData.name);
    }
  }

  updateUIForLoggedOutUser() {
    // Update UI elements based on logout state
    const loginButton = document.getElementById('login-button');
    const userProfileButton = document.getElementById('user-profile-button');
    const usernameDisplay = document.getElementById('username-display');
    
    // Show login button if it exists
    if (loginButton) {
      loginButton.style.display = 'block';
    }
    
    // Hide profile button if it exists
    if (userProfileButton) {
      userProfileButton.style.display = 'none';
    }
    
    // Clear username display if it exists
    if (usernameDisplay) {
      usernameDisplay.textContent = '';
      usernameDisplay.style.display = 'none';
    }
    
    // Reset AMI chatbot if it exists
    if (window.amiChatbot && typeof window.amiChatbot.setUserName === 'function') {
      window.amiChatbot.setUserName('');
    }
  }

  // Skills management
  addSkill(skill) {
    if (!this.userData.skills.includes(skill)) {
      this.userData.skills.push(skill);
      this.saveToStorage();
      this.publishEvent('user:skills:update', { userId: this.userData.id });
    }
    return this.userData.skills;
  }

  removeSkill(skill) {
    this.userData.skills = this.userData.skills.filter(s => s !== skill);
    this.saveToStorage();
    this.publishEvent('user:skills:update', { userId: this.userData.id });
    return this.userData.skills;
  }

  // Experience management
  addExperience(experience) {
    this.userData.experience.push(experience);
    this.saveToStorage();
    this.publishEvent('user:experience:update', { userId: this.userData.id });
    return this.userData.experience;
  }

  updateExperience(index, experience) {
    if (index >= 0 && index < this.userData.experience.length) {
      this.userData.experience[index] = { 
        ...this.userData.experience[index],
        ...experience
      };
      this.saveToStorage();
      this.publishEvent('user:experience:update', { userId: this.userData.id });
    }
    return this.userData.experience;
  }

  removeExperience(index) {
    if (index >= 0 && index < this.userData.experience.length) {
      this.userData.experience.splice(index, 1);
      this.saveToStorage();
      this.publishEvent('user:experience:update', { userId: this.userData.id });
    }
    return this.userData.experience;
  }

  // Education management
  addEducation(education) {
    this.userData.education.push(education);
    this.saveToStorage();
    this.publishEvent('user:education:update', { userId: this.userData.id });
    return this.userData.education;
  }

  updateEducation(index, education) {
    if (index >= 0 && index < this.userData.education.length) {
      this.userData.education[index] = { 
        ...this.userData.education[index],
        ...education
      };
      this.saveToStorage();
      this.publishEvent('user:education:update', { userId: this.userData.id });
    }
    return this.userData.education;
  }

  removeEducation(index) {
    if (index >= 0 && index < this.userData.education.length) {
      this.userData.education.splice(index, 1);
      this.saveToStorage();
      this.publishEvent('user:education:update', { userId: this.userData.id });
    }
    return this.userData.education;
  }

  // Job preferences
  updateJobPreferences(preferences) {
    this.userData.jobPreferences = {
      ...this.userData.jobPreferences,
      ...preferences
    };
    this.saveToStorage();
    this.publishEvent('user:jobPreferences:update', { userId: this.userData.id });
    return this.userData.jobPreferences;
  }

  // Saved jobs
  saveJob(job) {
    // Check if job already exists
    const exists = this.userData.savedJobs.some(savedJob => savedJob.id === job.id);
    
    if (!exists) {
      this.userData.savedJobs.push(job);
      this.saveToStorage();
      this.publishEvent('user:savedJobs:update', { userId: this.userData.id });
    }
    
    return this.userData.savedJobs;
  }

  removeSavedJob(jobId) {
    this.userData.savedJobs = this.userData.savedJobs.filter(job => job.id !== jobId);
    this.saveToStorage();
    this.publishEvent('user:savedJobs:update', { userId: this.userData.id });
    return this.userData.savedJobs;
  }

  // Application history
  addApplication(application) {
    this.userData.applicationHistory.push({
      ...application,
      date: new Date().toISOString()
    });
    this.saveToStorage();
    this.publishEvent('user:applications:update', { userId: this.userData.id });
    return this.userData.applicationHistory;
  }

  updateApplicationStatus(applicationId, status) {
    const index = this.userData.applicationHistory.findIndex(app => app.id === applicationId);
    
    if (index !== -1) {
      this.userData.applicationHistory[index].status = status;
      this.userData.applicationHistory[index].lastUpdated = new Date().toISOString();
      this.saveToStorage();
      this.publishEvent('user:applications:update', { userId: this.userData.id });
    }
    
    return this.userData.applicationHistory;
  }

  // Task management
  addTask(task) {
    this.userData.tasks.push({
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString()
    });
    this.saveToStorage();
    this.publishEvent('user:tasks:update', { userId: this.userData.id });
    return this.userData.tasks;
  }

  updateTask(taskId, updates) {
    const index = this.userData.tasks.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
      this.userData.tasks[index] = {
        ...this.userData.tasks[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      this.saveToStorage();
      this.publishEvent('user:tasks:update', { userId: this.userData.id });
    }
    
    return this.userData.tasks;
  }

  completeTask(taskId) {
    return this.updateTask(taskId, {
      completed: true,
      completedAt: new Date().toISOString()
    });
  }

  removeTask(taskId) {
    this.userData.tasks = this.userData.tasks.filter(task => task.id !== taskId);
    this.saveToStorage();
    this.publishEvent('user:tasks:update', { userId: this.userData.id });
    return this.userData.tasks;
  }

  // Learning progress
  updateLearningProgress(courseId, progress) {
    this.userData.learningProgress[courseId] = {
      ...this.userData.learningProgress[courseId],
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    this.saveToStorage();
    this.publishEvent('user:learning:update', { userId: this.userData.id });
    return this.userData.learningProgress;
  }

  // Event publishing
  publishEvent(eventName, data) {
    if (typeof window !== 'undefined' && window.CustomEvent) {
      const event = new CustomEvent(eventName, { detail: data });
      window.dispatchEvent(event);
      console.log(`Event published: ${eventName}`, data);
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.UserProfile = UserProfile;
} 