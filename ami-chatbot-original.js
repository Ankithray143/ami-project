// AMI (AI Mentor Interface) Chatbot Implementation
class AMIChatbot {
  constructor() {
    this.initialized = false;
    this.isVisible = false;
    this.messages = [];
    this.userName = 'User';
    this.chatbotElement = null;
    this.messagesContainer = null;
    this.inputField = null;
    this.themeColor = '#6366f1'; // Default theme color (indigo-500)
  }

  init() {
    console.log("Initializing AMI Chatbot");
    // Only initialize once
    if (this.initialized) return;

    // Get user name first
    this.getUserName();
    
    // Create UI if it doesn't exist
    this.createUI();
    
    // Set initial messages
    this.addWelcomeMessages();
    
    // Setup event listeners
    this.setupEventListeners();
    
    this.initialized = true;
    console.log("AMI Chatbot initialized successfully");
  }

  createUI() {
    console.log("Creating AMI Chatbot UI");
    // Check if the chatbot container already exists
    if (document.getElementById('ami-chatbot')) {
      this.chatbotElement = document.getElementById('ami-chatbot');
      this.messagesContainer = document.getElementById('ami-messages');
      this.inputField = document.getElementById('ami-input');
      return;
    }

    // Create the chatbot container
    this.chatbotElement = document.createElement('div');
    this.chatbotElement.id = 'ami-chatbot';
    this.chatbotElement.className = 'fixed bottom-5 right-5 w-96 max-w-full bg-gray-900/95 border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden z-50 transition-all duration-300 ease-in-out transform translate-y-[120%] opacity-0';
    this.chatbotElement.style.maxHeight = '600px'; // Increased max height
    
    // Add glassmorphism effect
    this.chatbotElement.style.backdropFilter = 'blur(12px)';
    this.chatbotElement.style.backgroundColor = 'rgba(15, 23, 42, 0.92)'; // Slightly darker and more opaque
    this.chatbotElement.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.4), 0 0 50px rgba(99, 102, 241, 0.2)';
    this.chatbotElement.style.borderColor = 'rgba(99, 102, 241, 0.4)'; // Brighter border
    
    // Create header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600';
    
    const title = document.createElement('div');
    title.className = 'flex items-center';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot mr-2 text-white';
    
    const titleText = document.createElement('h3');
    titleText.className = 'text-white font-bold';
    titleText.textContent = 'AMI Assistant';
    
    title.appendChild(icon);
    title.appendChild(titleText);
    
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'flex items-center space-x-2';
    
    // Add minimize button
    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'ami-minimize-button';
    minimizeButton.className = 'text-white hover:text-gray-200 transition-colors p-1';
    minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleVisibility(false);
    };
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.id = 'ami-close-button';
    closeButton.className = 'text-white hover:text-gray-200 transition-colors p-1';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleVisibility(false);
    };
    
    actionsContainer.appendChild(minimizeButton);
    actionsContainer.appendChild(closeButton);
    
    header.appendChild(title);
    header.appendChild(actionsContainer);
    
    // Add subtle pattern to header
    header.style.backgroundImage = 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.9) 100%)';
    header.style.boxShadow = '0 2px 10px rgba(79, 70, 229, 0.3)';
    
    // Create messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.id = 'ami-messages';
    this.messagesContainer.className = 'h-96 overflow-y-auto p-4 space-y-4'; // Increased height and spacing
    this.messagesContainer.style.scrollBehavior = 'smooth';
    this.messagesContainer.style.backgroundImage = 'radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.05) 0%, transparent 40%)';
    
    // Create input area
    const inputArea = document.createElement('div');
    inputArea.className = 'p-3 border-t border-indigo-500/30 bg-gray-800/90 flex items-center';
    
    this.inputField = document.createElement('input');
    this.inputField.id = 'ami-input';
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Ask AMI something...';
    this.inputField.className = 'flex-1 bg-gray-700 text-white border border-indigo-500/40 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';
    this.inputField.style.backdropFilter = 'blur(8px)';
    
    const sendButton = document.createElement('button');
    sendButton.id = 'ami-send';
    sendButton.className = 'bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r-lg transition-all duration-200';
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    sendButton.style.boxShadow = '0 0 10px rgba(79, 70, 229, 0.3)';
    sendButton.onclick = (e) => {
      e.preventDefault();
      this.sendMessage();
    };
    
    // Add hover and active effects
    sendButton.onmouseover = () => {
      sendButton.style.transform = 'translateY(-1px)';
      sendButton.style.boxShadow = '0 0 15px rgba(79, 70, 229, 0.5)';
    };
    
    sendButton.onmouseout = () => {
      sendButton.style.transform = 'translateY(0)';
      sendButton.style.boxShadow = '0 0 10px rgba(79, 70, 229, 0.3)';
    };
    
    // Create quick actions for common queries
    const quickActions = document.createElement('div');
    quickActions.className = 'px-3 pb-4 pt-2 border-t border-indigo-500/30 bg-gray-800/90 flex flex-wrap gap-2';
    
    const actions = [
      { text: 'Resume tips', query: 'How can I improve my resume?' },
      { text: 'Job search', query: 'Help me with job search' },
      { text: 'Interview prep', query: 'Interview preparation tips' },
      { text: 'Career advice', query: 'I need career advice' }
    ];
    
    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'bg-gray-700 hover:bg-indigo-600 text-gray-200 text-xs px-3 py-1.5 rounded-full transition-all duration-200 ami-quick-action';
      button.textContent = action.text;
      button.dataset.query = action.query;
      
      // Add glow effect on hover
      button.onmouseover = () => {
        button.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.5)';
        button.style.transform = 'translateY(-1px)';
      };
      
      button.onmouseout = () => {
        button.style.boxShadow = 'none';
        button.style.transform = 'translateY(0)';
      };
      
      button.onclick = (e) => {
        e.preventDefault();
        this.inputField.value = action.query;
        this.sendMessage();
      };
      quickActions.appendChild(button);
    });
    
    inputArea.appendChild(this.inputField);
    inputArea.appendChild(sendButton);
    
    // Assemble the chatbot
    this.chatbotElement.appendChild(header);
    this.chatbotElement.appendChild(this.messagesContainer);
    this.chatbotElement.appendChild(inputArea);
    this.chatbotElement.appendChild(quickActions);
    
    // Add to the document - try to use the specific container if it exists
    const amiContainer = document.getElementById('ami-container');
    if (amiContainer) {
      amiContainer.appendChild(this.chatbotElement);
    } else {
      // Fallback to body if container not found
      document.body.appendChild(this.chatbotElement);
    }
    
    // Add AMI button if it doesn't exist and we're not on a page that already has it
    if (!document.querySelector('#ami-button, #ami-button-top, #ami-button-nav, .ami-button')) {
      this.createAmiButton();
    }
    
    console.log("AMI Chatbot UI created successfully");
  }

  createAmiButton() {
    console.log("Creating AMI button");
    const amiButton = document.createElement('button');
    amiButton.id = 'ami-button';
    amiButton.className = 'fixed bottom-5 right-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center';
    amiButton.innerHTML = '<i class="fas fa-robot text-xl"></i>';
    
    amiButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("AMI button clicked from createAmiButton");
      this.toggleVisibility(true);
    };
    
    // Add animated glow effect
    amiButton.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)';
    
    // Add pulse animation
    const keyframes = `
      @keyframes pulse-glow {
        0% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.7), 0 0 40px rgba(99, 102, 241, 0.5); }
        100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3); }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    amiButton.style.animation = 'pulse-glow 2s infinite';
    
    document.body.appendChild(amiButton);
  }

  getUserName() {
    // Try to get user name from sessionStorage or localStorage
    let userData = null;
    
    if (sessionStorage.getItem('currentUser')) {
      try {
        userData = JSON.parse(sessionStorage.getItem('currentUser'));
      } catch (e) {
        console.error("Error parsing currentUser from sessionStorage:", e);
      }
    } 
    
    if (!userData && localStorage.getItem('currentUser')) {
      try {
        userData = JSON.parse(localStorage.getItem('currentUser'));
      } catch (e) {
        console.error("Error parsing currentUser from localStorage:", e);
      }
    }
    
    // Fallback options if JSON parsing didn't work
    if (!userData) {
      // Try direct name retrieval from storage
      const sessionName = sessionStorage.getItem('userName');
      const localName = localStorage.getItem('userName');
      
      if (sessionName) {
        this.userName = sessionName;
      } else if (localName) {
        this.userName = localName;
      }
    } else if (userData && userData.name) {
      this.userName = userData.name;
    }
    
    return this.userName;
  }

  addWelcomeMessages() {
    // Add initial messages with improved formatting and style
    const welcomeMessages = [
      {
        sender: 'ami',
        content: `<div class="welcome-message">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-2">
              <i class="fas fa-robot text-white"></i>
            </div>
            <div class="text-lg font-semibold text-white">Welcome, ${this.userName}!</div>
          </div>
          <p>I'm AMI, your AI Mentor Interface. I'm here to assist with your career journey.</p>
        </div>`
      },
      {
        sender: 'ami',
        content: `<div class="features-overview my-2">
          <p class="mb-2">I can help you with:</p>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <div class="p-2 bg-indigo-900/30 rounded border border-indigo-500/30 text-sm">
              <i class="fas fa-file-alt text-indigo-400 mr-1"></i> Resume Analysis
            </div>
            <div class="p-2 bg-indigo-900/30 rounded border border-indigo-500/30 text-sm">
              <i class="fas fa-search text-indigo-400 mr-1"></i> Job Search
            </div>
            <div class="p-2 bg-indigo-900/30 rounded border border-indigo-500/30 text-sm">
              <i class="fas fa-chalkboard-teacher text-indigo-400 mr-1"></i> Interviews
            </div>
            <div class="p-2 bg-indigo-900/30 rounded border border-indigo-500/30 text-sm">
              <i class="fas fa-graduation-cap text-indigo-400 mr-1"></i> Skill Development
            </div>
          </div>
          <p>What would you like help with today?</p>
        </div>`
      }
    ];
    
    welcomeMessages.forEach(msg => {
      this.messages.push(msg);
      this.addMessageToDOM(msg);
    });
  }

  setupEventListeners() {
    console.log("Setting up AMI Chatbot event listeners");
    
    // Attach event listener to enter key in input field
    if (this.inputField) {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
    
    // Connect to ALL AMI buttons using various selectors to catch all possible buttons
    const buttonSelectors = [
      '#ami-button', 
      '#ami-button-top', 
      '#ami-button-nav', 
      '.ami-button', 
      '[id^="ami-button"]', 
      'button[id*="ami"]',
      'button.ami-feature-btn'
    ];
    
    const existingAmiButtons = document.querySelectorAll(buttonSelectors.join(', '));
    console.log(`Found ${existingAmiButtons.length} AMI buttons`);
    
    existingAmiButtons.forEach(button => {
      if (button) {
        console.log(`Found button: ${button.id || 'unnamed'}`);
        
        // Use onclick instead of addEventListener to avoid conflicts
        button.onclick = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          console.log('AMI button clicked from within AMI class');
          this.toggleVisibility(true);
          
          // If this is a feature button with a data-feature attribute, set the input value
          if (button.classList.contains('ami-feature-btn') && button.dataset.feature && this.inputField) {
            const feature = button.dataset.feature;
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
            
            this.inputField.value = query;
            setTimeout(() => this.sendMessage(), 300);
          }
          
          return false;
        };
      }
    });
    
    // Handle closing when clicking outside
    document.addEventListener('click', (e) => {
      // Only handle outside clicks if the chatbot exists and is visible
      if (!this.chatbotElement || !this.isVisible) return;
      
      // Don't close if clicking AMI button, chatbot element
      if (this.chatbotElement.contains(e.target)) return;
      
      // Check if clicked on any AMI button
      let clickedAmiButton = false;
      document.querySelectorAll(buttonSelectors.join(', ')).forEach(button => {
        if (button && button.contains(e.target)) {
          clickedAmiButton = true;
        }
      });
      
      if (!clickedAmiButton) {
        this.toggleVisibility(false);
      }
    });
    
    // Add responsiveness to window resize
    window.addEventListener('resize', () => {
      this.adjustResponsiveLayout();
    });
    
    // Initial responsive adjustment
    this.adjustResponsiveLayout();
    
    // Initialize any quick action buttons
    const quickActionButtons = document.querySelectorAll('.ami-quick-action');
    quickActionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const query = button.dataset.query;
        if (this.inputField) {
          this.inputField.value = query;
          this.sendMessage();
        }
      });
    });
    
    console.log('AMI Chatbot event listeners set up successfully');
  }
  
  adjustResponsiveLayout() {
    if (!this.chatbotElement) return;
    
    if (window.innerWidth < 640) {
      this.chatbotElement.classList.add('bottom-0', 'right-0', 'left-0', 'rounded-b-none');
      this.chatbotElement.classList.remove('bottom-5', 'right-5');
      this.chatbotElement.style.width = '100%';
      this.chatbotElement.style.maxWidth = '100%';
    } else {
      this.chatbotElement.classList.remove('bottom-0', 'right-0', 'left-0', 'rounded-b-none');
      this.chatbotElement.classList.add('bottom-5', 'right-5');
      this.chatbotElement.style.width = '24rem'; // 384px = 24rem
      this.chatbotElement.style.maxWidth = 'calc(100% - 2.5rem)';
    }
  }

  toggleVisibility(forceState = null) {
    console.log('Toggle visibility called with forceState:', forceState);
    
    // Initialize if not already done
    if (!this.initialized) {
      this.init();
    }
    
    // Create UI if it doesn't exist yet
    if (!this.chatbotElement) {
      this.createUI();
    }
    
    // If forceState is provided, use that, otherwise toggle
    const newState = forceState !== null ? forceState : !this.isVisible;
    console.log(`Changing visibility from ${this.isVisible} to ${newState}`);
    
    // Don't do anything if state isn't changing
    if (newState === this.isVisible) return;
    
    this.isVisible = newState;
    
    if (this.chatbotElement) {
      if (this.isVisible) {
        // Show the chatbot with improved animation
        this.chatbotElement.classList.remove('translate-y-[120%]', 'opacity-0');
        this.chatbotElement.classList.add('translate-y-0', 'opacity-100');
        
        // Add entrance animation
        if (!this.chatbotElement.style.animation) {
          this.chatbotElement.style.animation = 'slideInUp 0.4s ease-out forwards';
        }
        
        // Focus input after transition completes
        setTimeout(() => {
          if (this.inputField) this.inputField.focus();
          
          // Add a subtle pulse to the input field to draw attention
          if (this.inputField) {
            this.inputField.style.animation = 'inputPulse 1s';
            setTimeout(() => {
              this.inputField.style.animation = '';
            }, 1000);
          }
        }, 300);
        
        // Hide any AMI buttons when chatbot is visible
        document.querySelectorAll('#ami-button, #ami-button-top, #ami-button-nav, .ami-button, [id^="ami-button"]').forEach(btn => {
          if (btn && !btn.classList.contains('ami-quick-action')) {
            btn.classList.add('opacity-0', 'scale-90', 'pointer-events-none');
            btn.style.transform = 'scale(0.9)';
          }
        });
      } else {
        // Hide the chatbot with improved animation
        this.chatbotElement.style.animation = 'slideOutDown 0.3s ease-in forwards';
        
        setTimeout(() => {
          this.chatbotElement.classList.add('translate-y-[120%]', 'opacity-0');
          this.chatbotElement.classList.remove('translate-y-0', 'opacity-100');
          this.chatbotElement.style.animation = '';
        }, 280);
        
        // Show any AMI buttons when chatbot is hidden
        document.querySelectorAll('#ami-button, #ami-button-top, #ami-button-nav, .ami-button, [id^="ami-button"]').forEach(btn => {
          if (btn && !btn.classList.contains('ami-quick-action')) {
            btn.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
            btn.style.transform = 'scale(1)';
            
            // Add a subtle bounce animation
            btn.style.animation = 'bounceIn 0.5s ease-out forwards';
            setTimeout(() => {
              btn.style.animation = 'pulse-glow 2s infinite';
            }, 500);
          }
        });
      }
      
      // Add animation keyframes if they don't exist
      if (!document.getElementById('ami-visibility-animations')) {
        const style = document.createElement('style');
        style.id = 'ami-visibility-animations';
        style.textContent = `
          @keyframes slideInUp {
            from { transform: translateY(10%); opacity: 0.8; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(10%); opacity: 0; }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          @keyframes inputPulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      console.error('Chatbot element not found when trying to toggle visibility');
      this.createUI(); // Try to create it
      if (this.chatbotElement) {
        // Try again after creation
        setTimeout(() => this.toggleVisibility(forceState), 100);
      }
    }
  }

  sendMessage() {
    if (!this.inputField || !this.inputField.value.trim()) return;
    
    const userMessage = {
      sender: 'user',
      content: this.inputField.value.trim()
    };
    
    // Add to messages array
    this.messages.push(userMessage);
    
    // Add to DOM
    this.addMessageToDOM(userMessage);
    
    // Clear input
    this.inputField.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process the message and generate a response
    setTimeout(() => {
      this.removeTypingIndicator();
      this.processMessage(userMessage.content);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  addMessageToDOM(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-${message.sender}`;
    
    const messageBubble = document.createElement('div');
    
    if (message.sender === 'user') {
      messageBubble.className = 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl py-3 px-4 max-w-[85%] shadow-lg';
      messageBubble.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
      messageBubble.style.animation = 'fadeInRight 0.3s ease-out forwards';
    } else {
      messageBubble.className = 'bg-gray-800 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl py-3 px-4 max-w-[85%] border border-indigo-500/30';
      messageBubble.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.2)';
      messageBubble.style.animation = 'fadeInLeft 0.3s ease-out forwards';
      messageBubble.style.backdropFilter = 'blur(10px)';
      messageBubble.style.backgroundColor = 'rgba(31, 41, 55, 0.85)';
    }
    
    // Support HTML in AMI responses but sanitize user content
    if (message.sender === 'ami') {
      messageBubble.innerHTML = message.content;
    } else {
      messageBubble.textContent = message.content;
    }
    
    messageElement.appendChild(messageBubble);
    
    if (this.messagesContainer) {
      this.messagesContainer.appendChild(messageElement);
      
      // Scroll to bottom
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    // Add animation keyframes if they don't exist
    if (!document.getElementById('ami-animations')) {
      const style = document.createElement('style');
      style.id = 'ami-animations';
      style.textContent = `
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return;
    
    const typingElement = document.createElement('div');
    typingElement.id = 'ami-typing';
    typingElement.className = 'flex justify-start';
    
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bg-gray-800 text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl py-3 px-4 flex space-x-2 border border-indigo-500/30';
    typingBubble.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.2)';
    typingBubble.style.backdropFilter = 'blur(10px)';
    typingBubble.style.backgroundColor = 'rgba(31, 41, 55, 0.85)';
    typingBubble.style.animation = 'fadeInLeft 0.3s ease-out forwards';
    
    // Create the typing animation dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'w-2.5 h-2.5 bg-indigo-400 rounded-full';
      dot.style.animation = `bounce 1.4s infinite ${i * 0.15}s`;
      typingBubble.appendChild(dot);
    }
    
    // Add the animation style if it doesn't exist
    if (!document.getElementById('ami-typing-style')) {
      const style = document.createElement('style');
      style.id = 'ami-typing-style';
      style.textContent = `
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    typingElement.appendChild(typingBubble);
    this.messagesContainer.appendChild(typingElement);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const typingElement = document.getElementById('ami-typing');
    if (typingElement) {
      typingElement.remove();
    }
  }

  processMessage(userMessage) {
    // Enhanced response engine with career feature integration
    let response = '';
    const lowerMessage = userMessage.toLowerCase();
    
    // Get user name for personalization
    const name = this.userName;
    
    // Check if we have access to career features
    const hasCareerFeatures = window.careerMentorApp && window.CareerAPI;
    
    // Resume analysis features
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      if (hasCareerFeatures) {
        // If we detect resume text, try to analyze it
        if (lowerMessage.length > 200 && 
            (lowerMessage.includes('experience') || lowerMessage.includes('skills') || 
             lowerMessage.includes('education') || lowerMessage.includes('work history'))) {
          
          // Show typing indicator longer for this complex task
          this.showTypingIndicator();
          
          // Analyze the resume
          window.careerMentorApp.analyzeResume(userMessage)
            .then(analysis => {
              this.removeTypingIndicator();
              
              const skillsList = analysis.skills.technical.join(', ');
              const gapsList = analysis.gaps.join(', ');
              const strengthsList = analysis.strengths.join(', ');
              
              const analysisResponse = `
                <p>I've analyzed your resume, ${name}. Here's what I found:</p>
                
                <p><strong>Match Score:</strong> ${analysis.matchScore}%</p>
                
                <p><strong>Technical Skills:</strong> ${skillsList || 'None detected'}</p>
                
                <p><strong>Key Strengths:</strong> ${strengthsList || 'None detected'}</p>
                
                ${gapsList ? `<p><strong>Consider adding:</strong> ${gapsList}</p>` : ''}
                
                <p>Would you like more detailed feedback or job recommendations based on your resume?</p>
              `;
              
              this.addMessageToDOM({
                sender: 'ami',
                content: analysisResponse
              });
            })
            .catch(error => {
              this.removeTypingIndicator();
              this.addMessageToDOM({
                sender: 'ami',
                content: `I'm sorry, I encountered an error analyzing your resume. Please try again later.`
              });
            });
          
          return; // Exit early as we're handling this asynchronously
        }
        
        // Normal resume response
        response = `I can analyze your resume, ${name}. With my Resume Analysis feature, I'll provide feedback on:
      
• Keywords optimization for ATS systems
• Content structure and formatting
• Skills assessment
• Experience highlighting 
• Quantifiable achievements

To analyze your resume, either upload it in the Resume Analysis section or paste the content here.`;
      } else {
        // Fallback if no career features are available
        response = `I can help with your resume, ${name}. For a detailed analysis, please upload your resume in the Resume Analysis section of the dashboard.`;
      }
    } 
    // Job market and job search features
    else if (lowerMessage.includes('job search') || lowerMessage.includes('find a job') || 
             lowerMessage.includes('finding a job') || lowerMessage.includes('job market')) {
      
      if (hasCareerFeatures) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get job recommendations based on user profile
        window.careerMentorApp.getJobRecommendations()
          .then(jobs => {
            this.removeTypingIndicator();
            
            if (jobs.length > 0) {
              // Format job recommendations
              let jobListHTML = '<ul style="list-style-type: none; padding-left: 0;">';
              
              jobs.slice(0, 3).forEach(job => {
                jobListHTML += `
                  <li style="margin-bottom: 10px; padding: 8px; background: rgba(79, 70, 229, 0.1); border-radius: 6px;">
                    <strong>${job.title}</strong> at ${job.company}<br>
                    <span style="font-size: 0.9em;">${job.location} • Match: ${job.matchScore}%</span>
                  </li>
                `;
              });
              
              jobListHTML += '</ul>';
              
              const jobResponse = `
                <p>Good news, ${name}! I found ${jobs.length} job opportunities that match your profile:</p>
                
                ${jobListHTML}
                
                <p>These recommendations are based on your skills and preferences. Would you like more job recommendations or tips on how to apply?</p>
              `;
              
              this.addMessageToDOM({
                sender: 'ami',
                content: jobResponse
              });
            } else {
              this.addMessageToDOM({
                sender: 'ami',
                content: `I'm searching for job opportunities based on your skills, ${name}. To get better matches, please make sure your profile is updated with your latest skills and preferences.`
              });
            }
          })
          .catch(error => {
            this.removeTypingIndicator();
            this.addMessageToDOM({
              sender: 'ami',
              content: `I'm sorry, I encountered an error retrieving job recommendations. Please try again later.`
            });
          });
        
        return; // Exit early as we're handling this asynchronously
      } else {
        // Fallback if no career features are available
        response = `I can help with your job search, ${name}. My Job Market Prediction feature provides:

• Personalized job recommendations based on your skills
• Market demand analysis in your field
• Growth trends for various positions
• Salary range insights
• Regional hiring analysis

Visit the Jobs section of the dashboard to explore opportunities matching your profile.`;
      }
    } 
    // Interview preparation features
    else if (lowerMessage.includes('interview') || lowerMessage.includes('interviews')) {
      if (hasCareerFeatures && 
          (lowerMessage.includes('question') || lowerMessage.includes('prepare') || 
           lowerMessage.includes('practice'))) {
        
        // Extract job title and company if provided
        let jobTitle = "Software Engineer"; // Default
        let company = "a tech company"; // Default
        
        // Simple extraction of job title and company
        const jobTitles = [
          "Software Engineer", "Data Scientist", "Product Manager", 
          "UX Designer", "DevOps Engineer", "Frontend Developer",
          "Backend Developer", "Full Stack Developer"
        ];
        
        const companies = [
          "Google", "Microsoft", "Amazon", "Apple", "Facebook", "Meta",
          "Netflix", "Tesla", "IBM", "Oracle"
        ];
        
        // Check for job titles
        for (const title of jobTitles) {
          if (lowerMessage.includes(title.toLowerCase())) {
            jobTitle = title;
            break;
          }
        }
        
        // Check for companies
        for (const comp of companies) {
          if (lowerMessage.includes(comp.toLowerCase())) {
            company = comp;
            break;
          }
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get interview questions
        window.careerMentorApp.getInterviewQuestions(jobTitle, company)
          .then(questions => {
            this.removeTypingIndicator();
            
            // Format interview questions
            let generalQuestionsHTML = '<ul>';
            questions.general.slice(0, 3).forEach(q => {
              generalQuestionsHTML += `<li>${q}</li>`;
            });
            generalQuestionsHTML += '</ul>';
            
            let technicalQuestionsHTML = '<ul>';
            questions.technical.slice(0, 3).forEach(q => {
              technicalQuestionsHTML += `<li>${q}</li>`;
            });
            technicalQuestionsHTML += '</ul>';
            
            let companyQuestionsHTML = '<ul>';
            questions.company_specific.slice(0, 2).forEach(q => {
              companyQuestionsHTML += `<li>${q}</li>`;
            });
            companyQuestionsHTML += '</ul>';
            
            const interviewResponse = `
              <p>Here are some interview questions to help you prepare for your ${jobTitle} interview at ${company}, ${name}:</p>
              
              <p><strong>General Questions:</strong></p>
              ${generalQuestionsHTML}
              
              <p><strong>Technical Questions:</strong></p>
              ${technicalQuestionsHTML}
              
              <p><strong>Company-Specific Questions:</strong></p>
              ${companyQuestionsHTML}
              
              <p>Would you like more questions or tips on how to answer these effectively?</p>
            `;
            
            this.addMessageToDOM({
              sender: 'ami',
              content: interviewResponse
            });
          })
          .catch(error => {
            this.removeTypingIndicator();
            this.addMessageToDOM({
              sender: 'ami',
              content: `I'm sorry, I encountered an error generating interview questions. Please try again later.`
            });
          });
        
        return; // Exit early as we're handling this asynchronously
      } else {
        // Regular interview response
        response = `My Interview Preparation tools can help you succeed, ${name}. I offer:

• AI-powered mock interviews tailored to your industry
• Feedback on your responses with confidence scoring
• Common questions database for your target roles
• Body language and communication tips
• Company-specific interview preparation

To get interview questions, you can ask me something like "Give me interview questions for a Software Engineer position at Google".`;
      }
    } 
    // Learning path and skill development features
    else if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('learning')) {
      if (hasCareerFeatures && 
          (lowerMessage.includes('recommend') || lowerMessage.includes('course') || 
           lowerMessage.includes('suggest') || lowerMessage.includes('path'))) {
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get learning recommendations
        window.careerMentorApp.getLearningRecommendations()
          .then(courses => {
            this.removeTypingIndicator();
            
            if (courses.length > 0) {
              // Format course recommendations
              let courseListHTML = '<ul style="list-style-type: none; padding-left: 0;">';
              
              courses.slice(0, 3).forEach(course => {
                courseListHTML += `
                  <li style="margin-bottom: 10px; padding: 8px; background: rgba(79, 70, 229, 0.1); border-radius: 6px;">
                    <strong>${course.title}</strong><br>
                    <span style="font-size: 0.9em;">${course.platform} • ${course.duration} • ${course.level} • ⭐ ${course.rating}</span>
                  </li>
                `;
              });
              
              courseListHTML += '</ul>';
              
              const learningResponse = `
                <p>I've found these learning opportunities for you, ${name}:</p>
                
                ${courseListHTML}
                
                <p>These recommendations align with your skills and career goals. Would you like more learning paths or specific skills to focus on?</p>
              `;
              
              this.addMessageToDOM({
                sender: 'ami',
                content: learningResponse
              });
            } else {
              this.addMessageToDOM({
                sender: 'ami',
                content: `I'm looking for learning paths based on your profile, ${name}. To get better recommendations, make sure your profile includes your current skills and career goals.`
              });
            }
          })
          .catch(error => {
            this.removeTypingIndicator();
            this.addMessageToDOM({
              sender: 'ami',
              content: `I'm sorry, I encountered an error retrieving learning recommendations. Please try again later.`
            });
          });
        
        return; // Exit early as we're handling this asynchronously
      } else {
        // Regular learning response
        response = `My Learning Path feature can identify your skill gaps and opportunities for growth, ${name}. It provides:

• Personalized learning recommendations
• In-demand skills in your field
• Course recommendations from top platforms
• Learning progress tracking
• Skill certification suggestions

To get course recommendations, you can ask me something like "Recommend courses for web development" or "What skills should I learn next?".`;
      }
    } 
    // Job market insights
    else if (lowerMessage.includes('market trends') || lowerMessage.includes('job outlook') || 
             lowerMessage.includes('salary') || lowerMessage.includes('in demand')) {
      
      if (hasCareerFeatures) {
        // Extract occupation if provided
        let occupation = "Software Developer"; // Default
        
        // Simple extraction for occupation
        const occupations = [
          "Software Developer", "Data Scientist", "Product Manager", 
          "UX Designer", "DevOps Engineer", "Frontend Developer",
          "Backend Developer", "Full Stack Developer", "AI Engineer",
          "Machine Learning Engineer", "Cloud Architect"
        ];
        
        // Check for occupation
        for (const occ of occupations) {
          if (lowerMessage.includes(occ.toLowerCase())) {
            occupation = occ;
            break;
          }
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get market insights
        window.careerMentorApp.getMarketInsights(occupation)
          .then(insights => {
            this.removeTypingIndicator();
            
            const marketResponse = `
              <p>Here are the latest job market insights for ${insights.occupation}, ${name}:</p>
              
              <p><strong>Growth Rate:</strong> ${insights.growth_rate}% (projected)</p>
              <p><strong>Median Salary:</strong> $${insights.median_salary.toLocaleString()}</p>
              <p><strong>Top Industries:</strong> ${insights.top_industries.join(', ')}</p>
              <p><strong>Market Outlook:</strong> ${insights.outlook}</p>
              
              <p>These insights can help you position yourself for success in the job market. Would you like more specific information about any aspect of this career path?</p>
            `;
            
            this.addMessageToDOM({
              sender: 'ami',
              content: marketResponse
            });
          })
          .catch(error => {
            this.removeTypingIndicator();
            this.addMessageToDOM({
              sender: 'ami',
              content: `I'm sorry, I encountered an error retrieving job market insights. Please try again later.`
            });
          });
        
        return; // Exit early as we're handling this asynchronously
      } else {
        // Regular job market response
        response = `Understanding market trends is essential for career planning, ${name}. I can provide insights on:

• Growth rates for different roles and industries
• Salary ranges by position and location
• In-demand skills and certifications
• Industry hiring trends
• Regional job market conditions

To get market insights, you can ask me something like "What's the outlook for Software Developers?" or "What are the salary trends for Data Scientists?".`;
      }
    }
    // Job autofill and application features
    else if (lowerMessage.includes('autofill') || lowerMessage.includes('application') || lowerMessage.includes('apply for job')) {
      response = `My Smart Autofill feature saves you time when applying for jobs, ${name}. It can:

• Automatically fill out job applications using your profile data
• Customize responses based on job descriptions
• Optimize keywords for each position
• Track applications and their status
• Suggest improvements to increase response rates

Try it on the Job Autofill section next time you apply for a position.`;
    } 
    // Work assistant and organization features
    else if (lowerMessage.includes('task') || lowerMessage.includes('work assistant') || lowerMessage.includes('organize') || lowerMessage.includes('schedule')) {
      response = `My Work Assistant helps you stay organized and productive, ${name}. It provides:

• Task management with smart prioritization
• Interview scheduling and reminders
• Application deadline tracking
• Learning milestones and progress tracking
• Network connection management

The Tasks section will help you keep track of everything in your career journey.`;
    }
    // Career change guidance
    else if (lowerMessage.includes('career change') || lowerMessage.includes('switch careers')) {
      response = `Considering a career change is a significant step, ${name}. I can help you navigate this transition by:

• Analyzing your transferable skills
• Suggesting compatible fields based on your experience
• Identifying skills gaps for your target industry
• Providing market insights on emerging fields
• Creating a personalized transition plan

Let me know which industry you're interested in moving to, and I can provide more specific guidance.`;
    } 
    // Salary and compensation insights
    else if (lowerMessage.includes('salary') || lowerMessage.includes('compensation') || lowerMessage.includes('pay')) {
      response = `Understanding salary trends is essential for career planning, ${name}. My salary analysis tools can:

• Provide current market rates for your role and location
• Compare your compensation to industry averages
• Offer negotiation strategies based on your experience level
• Project salary growth in different career paths
• Analyze benefits packages beyond base compensation

Check the Job Market Predictions section for detailed salary insights for your field.`;
    } 
    // Thank you responses
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      response = `You're welcome, ${name}! I'm here to help whenever you need assistance with your career journey. Is there anything else you'd like to explore today?`;
    } 
    // About AMI
    else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('what do you do')) {
      response = `I'm AMI, your AI Mentor Interface. I'm designed to be your all-in-one career assistant with advanced features including:

• Resume analysis and optimization
• Job market predictions and recommendations
• Learning path customization
• Smart application autofill
• Interview preparation
• Work assistant and task management

I use AI to provide personalized guidance for every step of your career journey. How can I help you today?`;
    } 
    // How AMI works
    else if (lowerMessage.includes('how do you work') || lowerMessage.includes('how does this work')) {
      response = `I connect all aspects of your career development into one intelligent system, ${name}. Here's how I work:

1. I analyze your profile, skills, and career goals
2. My AI engine processes market data and job trends
3. I provide personalized recommendations and tools
4. Each feature (Resume, Jobs, Learning, etc.) works together to create a comprehensive career strategy
5. Everything is customized to your unique situation and goals

Try exploring each section in the dashboard to experience the full range of my capabilities.`;
    } 
    // General help
    else if (lowerMessage.includes('help')) {
      response = `I'm here to help with all aspects of your career, ${name}. Here are the main ways I can assist you:

• Resume Analysis: Get feedback and optimization suggestions
• Job Market Predictions: Discover trends and opportunities
• Learning Paths: Develop in-demand skills
• Interview Preparation: Practice and improve your skills
• Smart Autofill: Apply for jobs efficiently
• Work Assistant: Stay organized and productive

Which area would you like to explore first?`;
    } 
    // Default response for unrecognized queries
    else {
      response = `That's an interesting question about "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}". While I'm specialized in career development, I'd be happy to help you explore this topic. Could you tell me how this relates to your career goals or which specific feature you'd like to use?`;
    }
    
    // Add response to messages
    const amiMessage = {
      sender: 'ami',
      content: response
    };
    
    this.messages.push(amiMessage);
    this.addMessageToDOM(amiMessage);
  }
}

// Export for global use and create instance immediately
if (typeof window !== 'undefined') {
  window.AMIChatbot = AMIChatbot;
  
  // Create instance when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - initializing AMI Chatbot");
    if (!window.amiChatbot && window.AMIChatbot) {
      window.amiChatbot = new AMIChatbot();
      window.amiChatbot.init();
      
      // Re-attach event listeners to all AMI buttons after a short delay
      setTimeout(() => {
        if (window.amiChatbot) {
          console.log("Re-attaching button event listeners");
          window.amiChatbot.setupEventListeners();
          
          // Add direct onclick handlers to buttons
          document.querySelectorAll('#ami-button, #ami-button-top, #ami-button-nav, .ami-button, [id^="ami-button"]').forEach(btn => {
            if (btn) {
              btn.onclick = function(e) {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                console.log("AMI button direct click handler");
                if (window.amiChatbot) {
                  window.amiChatbot.toggleVisibility(true);
                }
                return false;
              };
            }
          });
        }
      }, 500);
    }
  });
} 