// Career API Implementation
class CareerAPI {
  constructor() {
    this.apiEndpoint = 'https://api.careermentor.example.com/v1';
    this.initialized = false;
    this.mockMode = true; // Use mock data until real API is available
  }

  init() {
    console.log('Initializing Career API');
    this.initialized = true;
    
    // Make available globally
    if (typeof window !== 'undefined') {
      window.CareerAPI = this;
    }
    
    console.log('Career API initialized successfully' + (this.mockMode ? ' (MOCK MODE)' : ''));
    return this;
  }

  // Resume Analysis
  async analyzeResume(resumeText) {
    console.log('Analyzing resume...');
    
    if (this.mockMode) {
      return this._mockAnalyzeResume(resumeText);
    }
    
    try {
      const response = await fetch(`${this.apiEndpoint}/resume/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._getAuthToken()}`
        },
        body: JSON.stringify({ resume_text: resumeText })
      });
      
      if (!response.ok) {
        throw new Error(`Resume analysis failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  // Job Recommendations
  async getJobRecommendations(filters = {}) {
    console.log('Getting job recommendations...');
    
    if (this.mockMode) {
      return this._mockJobRecommendations(filters);
    }
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await fetch(`${this.apiEndpoint}/jobs/recommendations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this._getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Job recommendations failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Job recommendations error:', error);
      throw error;
    }
  }

  // Interview Questions
  async getInterviewQuestions(jobTitle, company, experienceLevel, skills, interviewType) {
    console.log(`Getting interview questions for ${jobTitle} at ${company}...`);

    try {
      // Try to get questions from Gemini API first
      const prompt = `Generate 10 realistic interview questions for a ${experienceLevel} ${jobTitle} position at ${company}. 
      This is for a ${interviewType}.
      The candidate has the following skills: ${skills.join(', ')}.
      
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

const geminiApiKey = window.careerMentorApp && typeof window.careerMentorApp.getGeminiApiKey === 'function' ? window.careerMentorApp.getGeminiApiKey() : null;
      if (!geminiApiKey) {
        console.error('Gemini API key is missing in career-api.js. Please configure it in initialize.js. Falling back to mock questions.');
        return this._mockInterviewQuestions(jobTitle, company, experienceLevel, skills, interviewType); // Fallback to mock if key is missing
      }
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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

      if (!geminiResponse.ok) {
        console.error(`Gemini API error: ${geminiResponse.status}`);
        // Fallback to mock questions if Gemini API fails
        return this._mockInterviewQuestions(jobTitle, company, experienceLevel, skills, interviewType);
      }

      const data = await geminiResponse.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        console.error('Could not extract JSON from Gemini response');
        // Fallback to mock questions if JSON extraction fails
        return this._mockInterviewQuestions(jobTitle, company, experienceLevel, skills, interviewType);
      }

      const questions = JSON.parse(jsonMatch[0]);
      return questions;

    } catch (error) {
      console.error('Error fetching interview questions from Gemini API:', error);
      // Fallback to mock questions if Gemini API fails or key is missing
      return this._mockInterviewQuestions(jobTitle, company, experienceLevel, skills, interviewType);
    }
  }

  // Learning Recommendations
  async getLearningRecommendations(skills) {
    console.log('Getting learning recommendations...');
    
    if (this.mockMode) {
      return this._mockLearningRecommendations(skills);
    }
    
    try {
      const response = await fetch(`${this.apiEndpoint}/learning/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._getAuthToken()}`
        },
        body: JSON.stringify({ skills: skills })
      });
      
      if (!response.ok) {
        throw new Error(`Learning recommendations failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Learning recommendations error:', error);
      throw error;
    }
  }

  // Market Insights
  async getMarketInsights(occupation) {
    console.log(`Getting market insights for ${occupation}...`);
    
    if (this.mockMode) {
      return this._mockMarketInsights(occupation);
    }
    
    try {
      const response = await fetch(`${this.apiEndpoint}/market/insights?occupation=${encodeURIComponent(occupation)}`, {
        headers: {
          'Authorization': `Bearer ${this._getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Market insights failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Market insights error:', error);
      throw error;
    }
  }

  // Mock Data Methods
  _mockAnalyzeResume(resumeText) {
    // Extract skills (simplified approach for demo)
    const skills = {
      technical: [],
      soft: []
    };
    
    // Technical skills to check
    const technicalSkills = [
      "JavaScript", "TypeScript", "Python", "Java", "C#", "React", "Angular", "Vue",
      "Node.js", "Express", "Django", "Flask", "SQL", "MongoDB", "AWS", "Azure",
      "Docker", "Kubernetes", "Machine Learning", "AI", "Git", "DevOps", "CI/CD"
    ];
    
    // Soft skills to check
    const softSkills = [
      "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
      "Time Management", "Project Management", "Collaboration", "Adaptability", "Creativity"
    ];
    
    // Check for technical skills
    technicalSkills.forEach(skill => {
      if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
        skills.technical.push(skill);
      }
    });
    
    // Check for soft skills
    softSkills.forEach(skill => {
      if (resumeText.toLowerCase().includes(skill.toLowerCase())) {
        skills.soft.push(skill);
      }
    });
    
    // Randomly select some skills as strengths
    const strengths = [...skills.technical].sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Identify missing important skills
    const missingSkills = [
      "Docker", "AWS", "TypeScript", "CI/CD", "Agile"
    ].filter(skill => !skills.technical.includes(skill));
    
    // Generate random match score
    const matchScore = Math.floor(60 + Math.random() * 30);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          skills: skills,
          strengths: strengths,
          gaps: missingSkills.slice(0, 3),
          matchScore: matchScore,
          atsCompatibility: matchScore > 75 ? "High" : matchScore > 60 ? "Medium" : "Low"
        });
      }, 1000);
    });
  }

  _mockJobRecommendations(filters) {
    const jobTitles = [
      "Software Engineer", "Frontend Developer", "Backend Developer", 
      "Full Stack Developer", "Data Scientist", "DevOps Engineer", 
      "UX Designer", "Product Manager", "UI Developer", "Mobile Developer"
    ];
    
    const companies = [
      "TechCorp Inc.", "InnovateSoft", "DataDynamics", "WebSphere Solutions",
      "CloudNine Technologies", "Quantum Computing", "Digital Creations",
      "NexGen Systems", "FutureTech", "AI Innovations"
    ];
    
    const locations = [
      "Remote", "San Francisco, CA", "New York, NY", "Austin, TX", 
      "Seattle, WA", "Boston, MA", "Denver, CO", "Chicago, IL"
    ];
    
    // Generate 5-10 random job recommendations
    const numJobs = 5 + Math.floor(Math.random() * 6);
    const jobs = [];
    
    for (let i = 0; i < numJobs; i++) {
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const matchScore = Math.floor(70 + Math.random() * 30);
      
      jobs.push({
        id: `job-${i + 1}`,
        title: title,
        company: company,
        location: location,
        description: `We are seeking a talented ${title} to join our team...`,
        requirements: [
          "3+ years of experience",
          "Bachelor's degree in Computer Science or related field",
          "Strong problem-solving skills"
        ],
        salary_range: "$100,000 - $150,000",
        posted_date: "2023-05-15",
        application_url: "https://example.com/apply",
        matchScore: matchScore
      });
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(jobs);
      }, 1000);
    });
  }

  _mockInterviewQuestions(jobTitle, company, experienceLevel = 'mid-level', skills = [], interviewType = 'general') {
    // General interview questions
    let generalQuestions = [
      // ... (existing general questions)
    ];

    let selectedTechnical = technicalQuestions[jobTitle] || defaultTechnicalQuestions;
    let selectedCompanySpecific = companySpecificQuestions[company] || defaultCompanyQuestions;

    // Adjust questions based on experienceLevel (simplified)
    if (experienceLevel.toLowerCase().includes('senior') || experienceLevel.toLowerCase().includes('lead')) {
      selectedTechnical.push("Describe a complex system you designed or significantly contributed to.");
      selectedTechnical.push("How do you mentor junior engineers and foster team growth?");
      generalQuestions.push("Tell me about a time you led a project to success.");
    } else if (experienceLevel.toLowerCase().includes('junior') || experienceLevel.toLowerCase().includes('entry')) {
      selectedTechnical = selectedTechnical.filter(q => !q.toLowerCase().includes('design a scalable') && !q.toLowerCase().includes('complex system'));
      selectedTechnical.push("What are your learning goals for your first year in this role?");
      generalQuestions.push("Why did you choose this career path?");
    }

    // Add a skill-based question if skills are provided
    if (skills && skills.length > 0) {
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      selectedTechnical.push(`Tell me about your experience with ${randomSkill}.`);
    }

    // Filter questions by interviewType (simplified)
    let finalGeneral = [...generalQuestions];
    let finalTechnical = [...selectedTechnical];
    let finalCompany = [...selectedCompanySpecific];

    if (interviewType.toLowerCase().includes('technical') && !interviewType.toLowerCase().includes('behavioral')) {
      finalGeneral = finalGeneral.slice(0, 2); // Fewer general if purely technical
      finalCompany = finalCompany.slice(0, 1);
    } else if (interviewType.toLowerCase().includes('behavioral') && !interviewType.toLowerCase().includes('technical')) {
      finalTechnical = defaultTechnicalQuestions.slice(0, 2); // Fewer technical if purely behavioral
      finalTechnical.push("Describe a time you had to learn a new technology quickly.");
    } else if (interviewType.toLowerCase().includes('screening')) {
      finalGeneral = generalQuestions.slice(0,3);
      finalTechnical = selectedTechnical.slice(0,1);
      finalTechnical.push("What are your salary expectations?"); // Common screening question
      finalCompany = [];
    }

    const allQuestions = [
      ...finalGeneral.sort(() => 0.5 - Math.random()).slice(0, 3).map(q => ({ question: q, category: 'general', difficulty: 'medium', expectedAnswer: 'Varies based on candidate experience.'})),
      ...finalTechnical.sort(() => 0.5 - Math.random()).slice(0, 4).map(q => ({ question: q, category: 'technical', difficulty: experienceLevel.includes('senior') ? 'hard' : 'medium', expectedAnswer: 'Demonstrates technical proficiency and problem-solving.'})),
      ...finalCompany.sort(() => 0.5 - Math.random()).slice(0, 2).map(q => ({ question: q, category: 'company-specific', difficulty: 'medium', expectedAnswer: 'Shows research and interest in the company.'}))
    ];

    // Ensure we return about 7-9 questions in total, mimicking the Gemini prompt's request for 10 but allowing for some variation.
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const numQuestionsToReturn = Math.max(7, Math.min(9, shuffledQuestions.length));

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(shuffledQuestions.slice(0, numQuestionsToReturn));
      }, 500);
    });
  }

  _mockLearningRecommendations(skills) { // Keep the original generalQuestions array definition for reference if needed
    const originalGeneralQuestions = [
      "Tell me about yourself.",
      "Why are you interested in working at our company?",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Describe a challenging situation at work and how you handled it.",
      "Why are you leaving your current position?",
      "How do you handle pressure and stress?",
      "What would your previous boss say about you?",
      "What questions do you have for me?"
    ];
    // Technical questions based on job title
    const technicalQuestions = {
      "Tell me about yourself.",
      "Why are you interested in working at our company?",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Describe a challenging situation at work and how you handled it.",
      "Why are you leaving your current position?",
      "How do you handle pressure and stress?",
      "What would your previous boss say about you?",
      "What questions do you have for me?"
    ];
    
    // Technical questions based on job title
    const technicalQuestions = {
      "Software Engineer": [
        "What is the difference between a stack and a queue?",
        "Explain the concept of time complexity.",
        "What is object-oriented programming?",
        "How would you optimize a slow SQL query?",
        "Explain how HTTP works.",
        "What is the difference between GET and POST requests?",
        "How would you design a scalable web application?"
      ],
      "Frontend Developer": [
        "Explain the box model in CSS.",
        "What is the virtual DOM in React?",
        "How does event bubbling work in JavaScript?",
        "What are closures in JavaScript?",
        "Explain the difference between flexbox and grid in CSS.",
        "What are the new features in ES6?",
        "How would you optimize website performance?"
      ],
      "Data Scientist": [
        "Explain the difference between supervised and unsupervised learning.",
        "What is overfitting and how can you prevent it?",
        "Explain the bias-variance tradeoff.",
        "How would you handle missing data in a dataset?",
        "What are the assumptions of linear regression?",
        "Explain the ROC curve.",
        "How would you evaluate a classification model?"
      ]
    };
    
    // Use default technical questions if job title doesn't match
    const defaultTechnicalQuestions = [
      "Describe your technical skills.",
      "How do you stay updated with the latest technologies?",
      "Tell me about a technical project you're proud of.",
      "How do you approach learning new technologies?",
      "Describe your problem-solving process.",
      "How do you ensure code quality?",
      "What development methodologies are you familiar with?"
    ];
    
    // Company-specific questions based on company
    const companySpecificQuestions = {
      "Google": [
        "How would you improve Google Search?",
        "Tell me about a time you had to make a decision with incomplete information.",
        "How would you design a recommendation system for YouTube?",
        "How do you prioritize competing projects?"
      ],
      "Microsoft": [
        "How would you improve Microsoft Teams?",
        "Tell me about a time when you had to work with a difficult team member.",
        "How do you approach complex technical problems?",
        "What Microsoft products do you use and how would you improve them?"
      ],
      "Amazon": [
        "Tell me about a time you had to make a decision that would impact customers.",
        "How would you design a feature for Amazon's e-commerce platform?",
        "Describe a situation where you had to make a tradeoff between quality and speed.",
        "Which of Amazon's leadership principles resonates with you most and why?"
      ]
    };
    
    // Default company questions if company doesn't match
    const defaultCompanyQuestions = [
      "What do you know about our company?",
      "Why are you interested in working here?",
      "How would you contribute to our company culture?",
      "What innovations do you think our company should pursue?"
    ];
    
    // Get the appropriate questions based on job title and company
    let technical = technicalQuestions[jobTitle] || defaultTechnicalQuestions;
    const company_specific = companySpecificQuestions[company] || defaultCompanyQuestions;

    // Further filter technical questions by skills if provided
    if (skills && skills.length > 0) {
      const skillBasedTechnical = [];
      skills.forEach(skill => {
        // Example: if skill is 'React', add React-specific questions
        if (skill.toLowerCase().includes('react') && technicalQuestions['Frontend Developer']) {
          skillBasedTechnical.push(...technicalQuestions['Frontend Developer'].filter(q => q.toLowerCase().includes('react')));
        }
        // Add more skill-based filtering logic here for other skills
      });
      if (skillBasedTechnical.length > 0) {
        technical = [...new Set([...skillBasedTechnical, ...technical])]; // Combine and remove duplicates
      }
    }

    // Adjust number of questions based on experience level or interview type if needed (example)
    let numGeneral = 5, numTechnical = 5, numCompany = 3;
    if (experienceLevel && experienceLevel.toLowerCase().includes('entry')) {
      numTechnical = 3; // Fewer technical for entry level
    }
    if (interviewType && interviewType.toLowerCase().includes('behavioral')){
        numTechnical = 2; // Fewer technical for behavioral
        numGeneral = 7;
    }

    // Shuffle questions
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    
    // Consolidate all questions into a single array of objects, matching Gemini's expected format
    const allQuestions = [];
    shuffle(generalQuestions).slice(0, numGeneral).forEach(q => allQuestions.push({ question: q, category: 'general', difficulty: 'medium', expectedAnswer: 'Varies based on question.' }));
    shuffle(technical).slice(0, numTechnical).forEach(q => allQuestions.push({ question: q, category: 'technical', difficulty: 'medium', expectedAnswer: 'Varies based on question.' }));
    shuffle(company_specific).slice(0, numCompany).forEach(q => allQuestions.push({ question: q, category: 'company_specific', difficulty: 'medium', expectedAnswer: 'Varies based on question.' }));

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(shuffle(allQuestions)); // Return a single shuffled array
      }, 1000);
    });
  }

  _mockLearningRecommendations(skills) {
    const courses = [
      {
        title: "Modern JavaScript: From Fundamentals to Advanced",
        platform: "Udemy",
        url: "https://udemy.com/course/modern-javascript",
        description: "Comprehensive JavaScript course covering ES6 and beyond",
        duration: "20 hours",
        level: "Intermediate",
        rating: 4.8,
        skills: ["JavaScript", "ES6", "Web Development"],
        price: "$59.99"
      },
      {
        title: "Complete React Developer Course",
        platform: "Coursera",
        url: "https://coursera.org/learn/react-development",
        description: "Learn React from the ground up including Hooks, Context API, and Redux",
        duration: "30 hours",
        level: "Intermediate",
        rating: 4.7,
        skills: ["React", "JavaScript", "Frontend Development"],
        price: "$49.99"
      },
      {
        title: "Python for Data Science and Machine Learning",
        platform: "edX",
        url: "https://edx.org/learn/python-data-science",
        description: "Learn Python libraries like NumPy, Pandas, and sci-kit learn",
        duration: "40 hours",
        level: "Advanced",
        rating: 4.9,
        skills: ["Python", "Data Science", "Machine Learning"],
        price: "$199.99"
      },
      {
        title: "AWS Certified Solutions Architect",
        platform: "A Cloud Guru",
        url: "https://acloudguru.com/aws-solutions-architect",
        description: "Prepare for the AWS Solutions Architect certification",
        duration: "25 hours",
        level: "Advanced",
        rating: 4.8,
        skills: ["AWS", "Cloud Computing", "Architecture"],
        price: "$129.99"
      },
      {
        title: "Full Stack Web Development Bootcamp",
        platform: "Udemy",
        url: "https://udemy.com/course/fullstack-web-development",
        description: "Learn frontend, backend, and database technologies",
        duration: "60 hours",
        level: "Beginner to Advanced",
        rating: 4.6,
        skills: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
        price: "$89.99"
      },
      {
        title: "UX Design Professional Certificate",
        platform: "Coursera",
        url: "https://coursera.org/professional-certificates/ux-design",
        description: "Comprehensive UX design course created by Google",
        duration: "6 months",
        level: "Beginner",
        rating: 4.8,
        skills: ["UX Design", "UI Design", "User Research"],
        price: "$39/month"
      },
      {
        title: "DevOps Engineering on AWS",
        platform: "LinkedIn Learning",
        url: "https://linkedin.com/learning/devops-engineering-aws",
        description: "Learn DevOps practices using AWS services",
        duration: "15 hours",
        level: "Intermediate",
        rating: 4.7,
        skills: ["DevOps", "AWS", "CI/CD"],
        price: "$29.99"
      }
    ];
    
    // Get 3-7 random course recommendations
    const numCourses = 3 + Math.floor(Math.random() * 5);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(courses.sort(() => Math.random() - 0.5).slice(0, numCourses));
      }, 1000);
    });
  }

  _mockMarketInsights(occupation) {
    const occupationData = {
      "Software Developer": {
        growth_rate: 22,
        median_salary: 110000,
        top_industries: ["Technology", "Finance", "Healthcare", "E-commerce"],
        outlook: "Excellent job prospects with continued growth expected through 2030",
        in_demand_skills: ["JavaScript", "Python", "Cloud Computing", "DevOps", "React"]
      },
      "Data Scientist": {
        growth_rate: 31,
        median_salary: 125000,
        top_industries: ["Technology", "Finance", "Healthcare", "E-commerce", "Manufacturing"],
        outlook: "Very strong growth prospects with increasing demand for data-driven decision making",
        in_demand_skills: ["Python", "Machine Learning", "SQL", "Tableau", "TensorFlow"]
      },
      "UX Designer": {
        growth_rate: 18,
        median_salary: 98000,
        top_industries: ["Technology", "E-commerce", "Finance", "Healthcare"],
        outlook: "Growing demand as companies increasingly focus on user experience",
        in_demand_skills: ["User Research", "Wireframing", "Prototyping", "Figma", "UI Design"]
      },
      "DevOps Engineer": {
        growth_rate: 25,
        median_salary: 120000,
        top_industries: ["Technology", "Finance", "Healthcare", "Retail"],
        outlook: "Strong demand as companies adopt DevOps practices for faster delivery",
        in_demand_skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms", "Infrastructure as Code"]
      }
    };
    
    // Default data if occupation not found
    const defaultData = {
      occupation: occupation,
      growth_rate: 15,
      median_salary: 95000,
      top_industries: ["Technology", "Finance", "Healthcare", "Education"],
      outlook: "Positive outlook with steady growth expected",
      in_demand_skills: ["Communication", "Problem Solving", "Technical Expertise", "Project Management"]
    };
    
    // Get data for the requested occupation or use default
    const data = occupationData[occupation] || defaultData;
    
    // Add the occupation to the data
    data.occupation = occupation;
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  }

  _getAuthToken() {
    // In a real implementation, this would retrieve the auth token from storage
    return 'mock_auth_token';
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.CareerAPI = CareerAPI;
}