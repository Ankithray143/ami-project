/**
 * Career Mentor - Interview Session
 * This module provides interview practice functionality using AI
 */

class InterviewSession {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.score = 0;
    this.settings = {};
    this.geminiApiKey = window.careerMentorApp && typeof window.careerMentorApp.getGeminiApiKey === 'function' ? window.careerMentorApp.getGeminiApiKey() : null;
    this.isLoading = false;
    this.timeRemaining = 120; // 2 minutes per question
    this.timer = null;
    
    // Initialize the session
    this.init();
  }
  
  // Initialize the interview session
  async init() {
    console.log('Initializing interview session');
    
    // Load settings from localStorage
    this.loadSettings();
    
    // Update UI with settings
    this.updateSettingsDisplay();
    
    // Generate questions based on settings
    await this.generateQuestions();
    
    // Display first question
    this.displayQuestion(0);
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('Interview session initialized');
  }
  
  // Load settings from localStorage
  loadSettings() {
    try {
      // Get interview settings from localStorage
      const savedSettings = JSON.parse(localStorage.getItem('interviewSettings') || '{}');
      
      // Default settings if none found
      this.settings = {
        jobTitle: savedSettings.jobTitle || 'Frontend Developer',
        experienceLevel: savedSettings.experienceLevel || 'Mid Level (2-5 years)',
        interviewType: savedSettings.interviewType || 'Technical Interview',
        skills: savedSettings.skills || ['JavaScript', 'React', 'CSS']
      };
      
      console.log('Loaded settings:', this.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Use default settings if there's an error
      this.settings = {
        jobTitle: 'Frontend Developer',
        experienceLevel: 'Mid Level (2-5 years)',
        interviewType: 'Technical Interview',
        skills: ['JavaScript', 'React', 'CSS']
      };
    }
  }
  
  // Update UI with settings
  updateSettingsDisplay() {
    // Update job title
    const jobTitleElement = document.getElementById('job-title-display');
    if (jobTitleElement) {
      jobTitleElement.textContent = this.settings.jobTitle;
    }
    
    // Update experience level
    const experienceLevelElement = document.getElementById('experience-level-display');
    if (experienceLevelElement) {
      experienceLevelElement.textContent = this.settings.experienceLevel;
    }
    
    // Update interview type
    const interviewTypeElement = document.getElementById('interview-type-display');
    if (interviewTypeElement) {
      interviewTypeElement.textContent = `${this.settings.interviewType} for ${this.settings.jobTitle}`;
    }
    
    // Update skills
    const skillsElement = document.getElementById('skills-display');
    if (skillsElement) {
      skillsElement.innerHTML = '';
      this.settings.skills.forEach(skill => {
        const skillSpan = document.createElement('span');
        skillSpan.className = 'px-2 py-1 rounded-full bg-indigo-900/50 text-indigo-300 text-xs border border-indigo-500/30';
        skillSpan.textContent = skill;
        skillsElement.appendChild(skillSpan);
      });
    }
  }
  
  // Generate interview questions using CareerAPI (which now uses Gemini)
  async generateQuestions() {
    this.isLoading = true;
    
    try {
      if (window.careerMentorApp && window.careerMentorApp.careerAPI) {
        const questions = await window.careerMentorApp.careerAPI.getInterviewQuestions(
          this.settings.jobTitle,
          this.settings.company || '', // Pass company if available, else empty string
          this.settings.experienceLevel,
          this.settings.skills,
          this.settings.interviewType
        );
        // Check if the response is already a flat array (from mock or Gemini direct array response)
        if (Array.isArray(questions) && questions.length > 0 && typeof questions[0].question === 'string') {
          this.questions = questions;
        } else if (questions && questions.general) { // Handle structured response (old mock or potential future API structure)
          this.questions = questions.general || [];
          if (Array.isArray(questions.technical)) this.questions = this.questions.concat(questions.technical);
          if (Array.isArray(questions.company_specific)) this.questions = this.questions.concat(questions.company_specific);
        } else {
            // If the structure is unexpected or empty, fallback to mock questions
            console.warn('Unexpected question structure from CareerAPI, falling back to mock.', questions);
            this.questions = this.getMockQuestions();
        }

      } else {
        console.error('CareerAPI not available, falling back to mock questions.');
        this.questions = this.getMockQuestions();
      }
    } catch (error) {
      console.error('Error generating questions with CareerAPI:', error);
      // Fallback to mock questions
      this.questions = this.getMockQuestions();
    }
    
    // Update total questions count in UI
    const totalQuestionsElement = document.getElementById('total-questions');
    if (totalQuestionsElement) {
      totalQuestionsElement.textContent = this.questions.length;
    }
    
    this.isLoading = false;
  }
  
  // Get questions from Gemini API
  async getQuestionsFromGemini() {
    try {
      const prompt = `Generate 10 realistic interview questions for a ${this.settings.experienceLevel} ${this.settings.jobTitle} position. 
      This is for a ${this.settings.interviewType}. 
      The candidate has the following skills: ${this.settings.skills.join(', ')}.
      
      Format the response as a JSON array of objects with the following structure:
      [
        {
          "question": "The interview question text",
          "category": "technical" or "behavioral" or "situational",
          "difficulty": "easy" or "medium" or "hard",
          "expectedAnswer": "A brief description of what a good answer should include"
        },
        ...
      ]
      
      Include a mix of technical, behavioral, and situational questions appropriate for the position.`;
      
      if (!this.geminiApiKey) {
      console.error('Gemini API key is missing in getQuestionsFromGemini. Please configure it in initialize.js. Falling back to mock questions.');
      return this.getMockQuestions();
    }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the text from the response
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract the JSON part from the text
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from Gemini response');
      }
      
      // Parse the JSON
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (error) {
      console.error('Error fetching questions from Gemini API:', error);
      // Fallback to mock questions if Gemini API fails
      return this.getMockQuestions();
    }
  }
  
  // Get mock questions (fallback if API fails)
  getMockQuestions() {
    const mockQuestions = [
      {
        question: "Tell me about your experience with React and how you've used it in your previous projects.",
        category: "technical",
        difficulty: "medium",
        expectedAnswer: "A good answer should include specific React projects, components created, state management approaches, and any performance optimizations implemented."
      },
      {
        question: "How do you handle state management in large React applications?",
        category: "technical",
        difficulty: "hard",
        expectedAnswer: "Candidate should discuss Redux, Context API, or other state management libraries, along with their pros and cons and when to use each approach."
      },
      {
        question: "Explain the concept of virtual DOM and its benefits.",
        category: "technical",
        difficulty: "medium",
        expectedAnswer: "Should explain that virtual DOM is a lightweight copy of the actual DOM, how React uses it for efficient updates, and the performance benefits it provides."
      },
      {
        question: "Describe a challenging bug you encountered and how you solved it.",
        category: "behavioral",
        difficulty: "medium",
        expectedAnswer: "Answer should include the problem definition, debugging approach, solution implemented, and lessons learned."
      },
      {
        question: "How do you stay updated with the latest frontend technologies and trends?",
        category: "behavioral",
        difficulty: "easy",
        expectedAnswer: "Should mention resources like blogs, podcasts, conferences, online courses, or community involvement."
      },
      {
        question: "Explain the difference between controlled and uncontrolled components in React.",
        category: "technical",
        difficulty: "medium",
        expectedAnswer: "Should explain that controlled components have their state managed by React while uncontrolled components store their state in the DOM, with examples of each."
      },
      {
        question: "How would you optimize the performance of a React application?",
        category: "technical",
        difficulty: "hard",
        expectedAnswer: "Should discuss techniques like memoization, code splitting, lazy loading, virtualization for long lists, and proper use of React hooks."
      },
      {
        question: "Tell me about a time when you had to meet a tight deadline. How did you handle it?",
        category: "behavioral",
        difficulty: "medium",
        expectedAnswer: "Answer should demonstrate prioritization skills, time management, communication with stakeholders, and the outcome achieved."
      },
      {
        question: "How would you design a component that needs to fetch data from an API?",
        category: "situational",
        difficulty: "medium",
        expectedAnswer: "Should discuss handling loading states, error handling, data fetching approaches (like useEffect), and possibly caching strategies."
      },
      {
        question: "What questions do you have for me about the role or company?",
        category: "behavioral",
        difficulty: "easy",
        expectedAnswer: "Candidate should ask thoughtful questions about the team, projects, technologies, or company culture that demonstrate their interest and research."
      }
    ];
    
    return mockQuestions;
  }
  
  // Display a question
  displayQuestion(index) {
    if (index >= this.questions.length) {
      this.showResults();
      return;
    }
    
    this.currentQuestionIndex = index;
    const question = this.questions[index];
    
    // Update question number
    const currentQuestionElement = document.getElementById('current-question');
    if (currentQuestionElement) {
      currentQuestionElement.textContent = index + 1;
    }
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const progressPercentage = ((index + 1) / this.questions.length) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Update question text
    const questionTextElement = document.getElementById('question-text');
    if (questionTextElement) {
      questionTextElement.textContent = question.question;
      
      // Add difficulty badge
      const difficultyClass = {
        easy: 'bg-green-500/20 text-green-300',
        medium: 'bg-yellow-500/20 text-yellow-300',
        hard: 'bg-red-500/20 text-red-300'
      }[question.difficulty] || 'bg-indigo-500/20 text-indigo-300';
      
      const difficultyBadge = document.createElement('span');
      difficultyBadge.className = `ml-2 px-2 py-1 rounded-full text-xs ${difficultyClass}`;
      difficultyBadge.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
      questionTextElement.appendChild(document.createElement('br'));
      questionTextElement.appendChild(document.createElement('br'));
      questionTextElement.appendChild(difficultyBadge);
      
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'ml-2 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs';
      categoryBadge.textContent = question.category.charAt(0).toUpperCase() + question.category.slice(1);
      questionTextElement.appendChild(categoryBadge);
    }
    
    // Clear answer input
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.value = '';
    }
    
    // Show question and answer containers, hide feedback
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('answer-container').classList.remove('hidden');
    document.getElementById('feedback-container').classList.add('hidden');
    document.getElementById('results-container').classList.add('hidden');
    
    // Start timer
    this.startTimer();
  }
  
  // Start timer for current question
  startTimer() {
    // Clear any existing timer
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // Reset time remaining
    this.timeRemaining = 120; // 2 minutes
    this.updateTimerDisplay();
    
    // Start new timer
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        this.submitAnswer();
      }
    }, 1000);
  }
  
  // Update timer display
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('time-remaining');
    if (timerElement) {
      timerElement.textContent = `Time remaining: ${formattedTime}`;
      
      // Add warning class when time is running low
      if (this.timeRemaining <= 30) {
        timerElement.classList.add('text-red-400');
      } else {
        timerElement.classList.remove('text-red-400');
      }
    }
  }
  
  // Submit the current answer
  async submitAnswer() {
    // Stop the timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Get the answer text
    const answerInput = document.getElementById('answer-input');
    const answerText = answerInput ? answerInput.value.trim() : '';
    
    // Store the answer
    this.answers[this.currentQuestionIndex] = answerText;
    
    // Generate feedback
    await this.generateFeedback(answerText);
  }
  
  // Generate feedback for an answer using Gemini API
  async generateFeedback(answer) {
    const question = this.questions[this.currentQuestionIndex];
    
    try {
      // Show loading state
      const feedbackContainer = document.getElementById('feedback-container');
      feedbackContainer.classList.remove('hidden');
      
      const feedbackText = document.getElementById('feedback-text');
      feedbackText.innerHTML = '<div class="flex justify-center"><i class="fas fa-spinner fa-spin text-indigo-400 text-xl"></i></div>';
      
      // Try to use Gemini API for feedback
      const feedback = await this.getFeedbackFromGemini(question, answer);
      
      // Calculate score based on feedback
      const score = feedback.score;
      this.score += score;
      
      // Display feedback
      feedbackText.innerHTML = `
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Score</span>
            <span class="text-${score >= 7 ? 'green' : score >= 5 ? 'yellow' : 'red'}-400 font-bold">${score}/10</span>
          </div>
          <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: ${score * 10}%"></div>
          </div>
        </div>
        <h4 class="text-white font-medium mb-2">Feedback</h4>
        <p class="text-gray-300 mb-3">${feedback.feedback}</p>
        <h4 class="text-white font-medium mb-2">Strengths</h4>
        <ul class="text-gray-300 list-disc pl-5 mb-3">
          ${feedback.strengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        <h4 class="text-white font-medium mb-2">Areas for Improvement</h4>
        <ul class="text-gray-300 list-disc pl-5">
          ${feedback.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
        </ul>
      `;
      
      // Hide answer container
      document.getElementById('answer-container').classList.add('hidden');
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      
      // Fallback to simple feedback
      const feedbackText = document.getElementById('feedback-text');
      feedbackText.innerHTML = `
        <p class="text-gray-300 mb-3">Thank you for your answer. Let's move on to the next question.</p>
      `;
      
      // Add a default score
      this.score += 7;
    }
  }
  
  // Get feedback from Gemini API
  async getFeedbackFromGemini(question, answer) {
    try {
      const prompt = `You are an expert interviewer evaluating a candidate's response to the following interview question:

      Question: "${question.question}"
      
      Expected elements in a good answer: ${question.expectedAnswer}
      
      Candidate's answer: "${answer}"
      
      Please evaluate the answer and provide:
      1. A score from 1-10
      2. Brief feedback (2-3 sentences)
      3. 2-3 strengths of the answer
      4. 2-3 areas for improvement
      
      Format your response as a JSON object with the following structure:
      {
        "score": number,
        "feedback": "string",
        "strengths": ["string", "string"],
        "improvements": ["string", "string"]
      }`;
      
      if (!this.geminiApiKey) {
        console.error('Gemini API key is missing in getFeedbackFromGemini. Please configure it in initialize.js. Falling back to default feedback.');
        return {
          score: Math.floor(Math.random() * 3) + 5, // Random score 5-7 for basic feedback
          feedback: 'Unable to connect to AI for detailed feedback. Your answer has been recorded.',
          strengths: ['Answer recorded.'],
          improvements: ['Enable API key for detailed AI feedback.']
        };
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the text from the response
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract the JSON part from the text
      const jsonMatch = text.match(/\{\s*"score".*\}/s);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from Gemini response');
      }
      
      // Parse the JSON
      const feedback = JSON.parse(jsonMatch[0]);
      return feedback;
    } catch (error) {
      console.error('Error fetching feedback from Gemini API:', error);
      
      // Return a default feedback object if API call fails
      return {
        score: Math.floor(Math.random() * 3) + 5, // Random score 5-7 for basic feedback
        feedback: "There was an issue getting detailed feedback from the AI. Your answer has been recorded.",
        strengths: ["Answer submitted successfully."],
        improvements: ["AI feedback service temporarily unavailable. Try again later."]
      };
    }
  }
  
  // Show final results
  showResults() {
    // Calculate final score
    const finalScore = Math.round((this.score / (this.questions.length * 10)) * 100);
    
    // Update score display
    const overallScoreElement = document.getElementById('overall-score');
    if (overallScoreElement) {
      overallScoreElement.textContent = `${finalScore}%`;
    }
    
    // Update score bar
    const scoreBarElement = document.getElementById('score-bar');
    if (scoreBarElement) {
      scoreBarElement.style.width = `${finalScore}%`;
    }
    
    // Generate strengths and areas for improvement
    this.generateOverallFeedback(finalScore);
    
    // Hide other containers and show results
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('answer-container').classList.add('hidden');
    document.getElementById('feedback-container').classList.add('hidden');
    document.getElementById('results-container').classList.remove('hidden');
    
    // Save results to localStorage
    this.saveResults(finalScore);
  }
  
  // Generate overall feedback based on score
  generateOverallFeedback(score) {
    const strengthsList = document.getElementById('strengths-list');
    const improvementsList = document.getElementById('improvements-list');
    
    if (!strengthsList || !improvementsList) return;
    
    // Clear existing lists
    strengthsList.innerHTML = '';
    improvementsList.innerHTML = '';
    
    // Generate feedback based on score
    if (score >= 80) {
      // High score feedback
      const strengths = [
        "Strong technical knowledge and understanding",
        "Clear and concise communication",
        "Good problem-solving approach",
        "Provided specific examples from experience"
      ];
      
      const improvements = [
        "Further elaborate on technical implementations",
        "Consider discussing alternative approaches"
      ];
      
      strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
      });
      
      improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
      });
    } else if (score >= 60) {
      // Medium score feedback
      const strengths = [
        "Demonstrated good technical knowledge",
        "Provided some relevant examples",
        "Showed problem-solving ability"
      ];
      
      const improvements = [
        "Be more specific with examples",
        "Elaborate more on technical implementations",
        "Structure answers more clearly"
      ];
      
      strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
      });
      
      improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
      });
    } else {
      // Low score feedback
      const strengths = [
        "Attempted to answer all questions",
        "Showed willingness to engage with difficult topics"
      ];
      
      const improvements = [
        "Strengthen technical knowledge in key areas",
        "Provide specific examples from experience",
        "Practice structuring answers more clearly",
        "Focus on addressing the core of each question"
      ];
      
      strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
      });
      
      improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
      });
    }
  }
  
  // Save results to localStorage
  saveResults(score) {
    try {
      // Get existing history or initialize empty array
      const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      
      // Add new session
      history.push({
        date: new Date().toISOString(),
        jobTitle: this.settings.jobTitle,
        interviewType: this.settings.interviewType,
        score: score,
        questionsCount: this.questions.length
      });
      
      // Save back to localStorage
      localStorage.setItem('interviewHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Submit button
    const submitButton = document.getElementById('submit-button');
    if (submitButton) {
      submitButton.addEventListener('click', () => this.submitAnswer());
    }
    
    // Skip button
    const skipButton = document.getElementById('skip-button');
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        // Add an empty answer and move to next question
        this.answers[this.currentQuestionIndex] = '';
        this.score += 0; // No points for skipped questions
        this.displayQuestion(this.currentQuestionIndex + 1);
      });
    }
    
    // Next question button
    const nextQuestionButton = document.getElementById('next-question-button');
    if (nextQuestionButton) {
      nextQuestionButton.addEventListener('click', () => {
        this.displayQuestion(this.currentQuestionIndex + 1);
      });
    }
    
    // Finish button
    const finishButton = document.getElementById('finish-button');
    if (finishButton) {
      finishButton.addEventListener('click', () => {
        window.location.href = 'interview-prep.html';
      });
    }
    
    // Review answers button
    const reviewAnswersButton = document.getElementById('review-answers-button');
    if (reviewAnswersButton) {
      reviewAnswersButton.addEventListener('click', () => {
        // TODO: Implement review functionality
        alert('Review functionality will be implemented in a future update.');
      });
    }
    
    // Handle Enter key in textarea
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.addEventListener('keydown', (e) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.submitAnswer();
        }
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.interviewSession = new InterviewSession();
});