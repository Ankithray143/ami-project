/**
 * Career Mentor - Learning Paths
 * This module provides personalized learning recommendations and course paths
 */

class LearningPathManager {
  constructor() {
    this.apiKeys = {
      coursera: '', // Set your Coursera API key here
      youtube: '',  // Set your YouTube API key here
      udemy: ''     // Set your Udemy API key here
    };
    
    // Define skills taxonomy (simplified version)
    this.skillsTaxonomy = {
      programming: ["JavaScript", "Python", "Java", "C++", "Go", "Rust", "TypeScript", "PHP", "Ruby", "Swift", "Kotlin"],
      web_development: ["HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails", "Next.js"],
      data_science: ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Data Visualization"],
      cloud: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "CloudFormation", "Lambda"],
      design: ["UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "User Research", "Usability Testing", "Design Systems"],
      product_management: ["Agile", "Scrum", "User Stories", "Product Strategy", "Market Research", "Roadmapping", "A/B Testing", "KPIs"],
      soft_skills: ["Communication", "Leadership", "Problem Solving", "Critical Thinking", "Teamwork", "Time Management", "Negotiation"]
    };
    
    // Create courses database (simulated)
    this.coursesDatabase = this.generateCoursesDatabase();
    
    // Cache for learning paths
    this.cachedLearningPaths = {};
  }
  
  // Generate simulated courses database
  generateCoursesDatabase() {
    const courses = [];
    
    // Coursera courses
    courses.push(...[
      {
        id: "coursera-1",
        title: "Machine Learning",
        provider: "Coursera",
        instructor: "Andrew Ng",
        university: "Stanford University",
        skills: ["Machine Learning", "Python", "Data Science"],
        level: "Intermediate",
        duration: "11 weeks",
        hours_per_week: 6,
        rating: 4.9,
        reviews: 150000,
        url: "https://www.coursera.org/learn/machine-learning",
        description: "This course provides a broad introduction to machine learning, data mining, and statistical pattern recognition.",
        price: "Free (Certificate: $79)",
        image: "https://via.placeholder.com/150"
      },
      {
        id: "coursera-2",
        title: "Web Development with React",
        provider: "Coursera",
        instructor: "Jogesh Muppala",
        university: "Hong Kong University of Science and Technology",
        skills: ["React", "JavaScript", "Web Development"],
        level: "Intermediate",
        duration: "4 weeks",
        hours_per_week: 5,
        rating: 4.7,
        reviews: 35000,
        url: "https://www.coursera.org/learn/react",
        description: "Learn front-end and hybrid mobile development with React and React Native.",
        price: "Free (Certificate: $49)",
        image: "https://via.placeholder.com/150"
      },
      {
        id: "coursera-3",
        title: "Google Cloud Platform Fundamentals",
        provider: "Coursera",
        instructor: "Google Cloud Team",
        university: "Google",
        skills: ["Google Cloud", "Cloud Computing", "DevOps"],
        level: "Beginner",
        duration: "3 weeks",
        hours_per_week: 4,
        rating: 4.6,
        reviews: 25000,
        url: "https://www.coursera.org/learn/gcp-fundamentals",
        description: "This course introduces you to important concepts and terminology for working with Google Cloud Platform.",
        price: "Free (Certificate: $49)",
        image: "https://via.placeholder.com/150"
      }
    ]);
    
    // Udemy courses
    courses.push(...[
      {
        id: "udemy-1",
        title: "The Complete 2023 Web Development Bootcamp",
        provider: "Udemy",
        instructor: "Dr. Angela Yu",
        university: null,
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
        level: "All Levels",
        duration: "55 hours",
        hours_per_week: 10,
        rating: 4.7,
        reviews: 240000,
        url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
        description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB and more!",
        price: "$19.99",
        image: "https://via.placeholder.com/150"
      },
      {
        id: "udemy-2",
        title: "Python for Data Science and Machine Learning Bootcamp",
        provider: "Udemy",
        instructor: "Jose Portilla",
        university: null,
        skills: ["Python", "Data Science", "Machine Learning", "NumPy", "Pandas", "Matplotlib"],
        level: "Intermediate",
        duration: "25 hours",
        hours_per_week: 8,
        rating: 4.6,
        reviews: 170000,
        url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
        description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, and more!",
        price: "$19.99",
        image: "https://via.placeholder.com/150"
      }
    ]);
    
    // YouTube courses/playlists
    courses.push(...[
      {
        id: "youtube-1",
        title: "React JS Crash Course",
        provider: "YouTube",
        instructor: "Traversy Media",
        university: null,
        skills: ["React", "JavaScript", "Web Development"],
        level: "Beginner",
        duration: "1.5 hours",
        hours_per_week: 1.5,
        rating: 4.8,
        reviews: 52000,
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        description: "Learn the React JavaScript library from the ground up in this crash course.",
        price: "Free",
        image: "https://via.placeholder.com/150"
      },
      {
        id: "youtube-2",
        title: "Python Tutorial for Beginners",
        provider: "YouTube",
        instructor: "Programming with Mosh",
        university: null,
        skills: ["Python", "Programming"],
        level: "Beginner",
        duration: "6 hours",
        hours_per_week: 6,
        rating: 4.9,
        reviews: 180000,
        url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        description: "Python tutorial - Python for beginners. Learn Python programming for a career in machine learning, data science & web development.",
        price: "Free",
        image: "https://via.placeholder.com/150"
      }
    ]);
    
    // Add more courses for various categories
    const courseTemplates = [
      {
        title: "Advanced JavaScript Concepts",
        skills: ["JavaScript", "Web Development"],
        level: "Advanced",
        duration: "15 hours",
        hours_per_week: 5,
        price: "$15.99"
      },
      {
        title: "AWS Certified Solutions Architect",
        skills: ["AWS", "Cloud Computing", "DevOps"],
        level: "Intermediate",
        duration: "25 hours",
        hours_per_week: 8,
        price: "$19.99"
      },
      {
        title: "UI/UX Design Fundamentals",
        skills: ["UI Design", "UX Design", "Figma"],
        level: "Beginner",
        duration: "12 hours",
        hours_per_week: 4,
        price: "$12.99"
      },
      {
        title: "Full Stack Data Science",
        skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
        level: "Intermediate",
        duration: "30 hours",
        hours_per_week: 7,
        price: "$24.99"
      },
      {
        title: "Product Management Essentials",
        skills: ["Product Strategy", "Agile", "User Stories"],
        level: "Beginner",
        duration: "10 hours",
        hours_per_week: 3,
        price: "$14.99"
      }
    ];
    
    // Generate variations of course templates
    const providers = ["Udemy", "Coursera", "YouTube", "edX", "Pluralsight"];
    const instructors = ["John Smith", "Jane Doe", "Robert Johnson", "Sarah Williams", "David Miller"];
    const universities = [null, "MIT", "Stanford University", "Harvard University", null];
    
    for (let i = 0; i < 20; i++) {
      const template = courseTemplates[i % courseTemplates.length];
      const provider = providers[i % providers.length];
      const instructor = instructors[i % instructors.length];
      const university = universities[i % universities.length];
      
      courses.push({
        id: `${provider.toLowerCase()}-extra-${i}`,
        title: `${template.title} ${i % 3 === 0 ? 'Masterclass' : i % 3 === 1 ? 'Bootcamp' : 'Course'}`,
        provider: provider,
        instructor: instructor,
        university: university,
        skills: template.skills,
        level: template.level,
        duration: template.duration,
        hours_per_week: template.hours_per_week,
        rating: 4.0 + Math.random() * 0.9,
        reviews: Math.floor(1000 + Math.random() * 100000),
        url: `https://www.example.com/course-${i}`,
        description: `Learn ${template.skills.join(", ")} in this ${template.level.toLowerCase()} level ${i % 3 === 0 ? 'masterclass' : i % 3 === 1 ? 'bootcamp' : 'course'}.`,
        price: template.price,
        image: "https://via.placeholder.com/150"
      });
    }
    
    return courses;
  }
  
  // Get courses by skill
  getCoursesBySkill(skill, params = {}) {
    const { level = null, provider = null, maxResults = 10 } = params;
    
    // Filter courses by skill
    let filteredCourses = this.coursesDatabase.filter(course => 
      course.skills.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    
    // Additional filters
    if (level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === level.toLowerCase()
      );
    }
    
    if (provider) {
      filteredCourses = filteredCourses.filter(course => 
        course.provider.toLowerCase() === provider.toLowerCase()
      );
    }
    
    // Sort by rating (highest first)
    filteredCourses.sort((a, b) => b.rating - a.rating);
    
    // Return limited results
    return filteredCourses.slice(0, maxResults);
  }
  
  // Search courses by query
  searchCourses(query, params = {}) {
    const { level = null, provider = null, maxResults = 10 } = params;
    
    // Normalize query
    const normalizedQuery = query.toLowerCase();
    
    // Filter courses by query match in title, skills, or description
    let filteredCourses = this.coursesDatabase.filter(course => 
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.skills.some(skill => skill.toLowerCase().includes(normalizedQuery)) ||
      (course.description && course.description.toLowerCase().includes(normalizedQuery))
    );
    
    // Additional filters
    if (level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === level.toLowerCase()
      );
    }
    
    if (provider) {
      filteredCourses = filteredCourses.filter(course => 
        course.provider.toLowerCase() === provider.toLowerCase()
      );
    }
    
    // Sort by relevance (matching title is most relevant)
    filteredCourses.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(normalizedQuery) ? 1 : 0;
      
      if (aTitleMatch !== bTitleMatch) {
        return bTitleMatch - aTitleMatch;
      }
      
      // If title match is the same, sort by rating
      return b.rating - a.rating;
    });
    
    // Return limited results
    return filteredCourses.slice(0, maxResults);
  }
  
  // Generate a learning path based on target role and current skill level
  async generateLearningPath(targetRole, currentLevel = "Beginner", timeframe = "3 months") {
    // Create a cache key
    const cacheKey = `${targetRole}-${currentLevel}-${timeframe}`;
    
    // Check cache first
    if (this.cachedLearningPaths[cacheKey]) {
      return this.cachedLearningPaths[cacheKey];
    }
    
    // Define required skills for common roles
    const roleSkillsMap = {
      "frontend developer": {
        core: ["HTML", "CSS", "JavaScript", "React"],
        recommended: ["TypeScript", "Web Performance", "Responsive Design", "UI/UX Basics"],
        advanced: ["Next.js", "GraphQL", "Testing", "Accessibility"]
      },
      "backend developer": {
        core: ["JavaScript", "Node.js", "Express", "SQL", "NoSQL"],
        recommended: ["API Design", "Authentication", "Cloud Basics", "Docker"],
        advanced: ["Microservices", "Kubernetes", "Redis", "Message Queues"]
      },
      "full stack developer": {
        core: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL"],
        recommended: ["TypeScript", "API Design", "Git", "Cloud Basics"],
        advanced: ["GraphQL", "Docker", "CI/CD", "Testing"]
      },
      "data scientist": {
        core: ["Python", "SQL", "Statistics", "Machine Learning"],
        recommended: ["Pandas", "NumPy", "Data Visualization", "Scikit-Learn"],
        advanced: ["Deep Learning", "Natural Language Processing", "Big Data", "MLOps"]
      },
      "ui ux designer": {
        core: ["UI Design", "UX Design", "Figma", "User Research"],
        recommended: ["Typography", "Color Theory", "Usability Testing", "Design Systems"],
        advanced: ["Motion Design", "Prototyping", "Accessibility", "Design Strategy"]
      },
      "product manager": {
        core: ["Product Strategy", "Agile", "User Stories", "Market Research"],
        recommended: ["Data Analysis", "UI/UX Basics", "Roadmapping", "Stakeholder Management"],
        advanced: ["Growth Metrics", "A/B Testing", "Product Economics", "Technical Understanding"]
      }
    };
    
    // Find matching role skills
    let skills = {
      core: ["Problem Solving", "Communication"],
      recommended: ["Time Management", "Teamwork"],
      advanced: ["Leadership", "Negotiation"]
    };
    
    // Match role to skills (case insensitive)
    const normalizedRole = targetRole.toLowerCase();
    for (const role in roleSkillsMap) {
      if (normalizedRole.includes(role)) {
        skills = roleSkillsMap[role];
        break;
      }
    }
    
    // Generate learning path based on current level
    const learningPath = {
      targetRole: targetRole,
      currentLevel: currentLevel,
      timeframe: timeframe,
      estimatedCompletionTime: this.calculateCompletionTime(currentLevel, timeframe),
      skillsToLearn: {
        core: [],
        recommended: [],
        advanced: []
      },
      coursesByPhase: {
        phase1: [], // Fundamentals/Core
        phase2: [], // Intermediate/Recommended
        phase3: []  // Advanced
      }
    };
    
    // Add courses for each skill category based on current level
    if (currentLevel === "Beginner") {
      // Beginners focus on core skills first
      for (const skill of skills.core) {
        const courses = this.getCoursesBySkill(skill, { level: "Beginner", maxResults: 2 });
        learningPath.skillsToLearn.core.push({
          skill: skill,
          courses: courses.length,
          estimatedHours: courses.reduce((sum, c) => sum + (parseInt(c.hours_per_week) || 5), 0)
        });
        learningPath.coursesByPhase.phase1.push(...courses);
      }
      
      // Add a couple of recommended skills for phase 2
      for (const skill of skills.recommended.slice(0, 2)) {
        const courses = this.getCoursesBySkill(skill, { maxResults: 1 });
        learningPath.skillsToLearn.recommended.push({
          skill: skill,
          courses: courses.length,
          estimatedHours: courses.reduce((sum, c) => sum + (parseInt(c.hours_per_week) || 5), 0)
        });
        learningPath.coursesByPhase.phase2.push(...courses);
      }
    } 
    else if (currentLevel === "Intermediate") {
      // Intermediates focus on recommended skills and some advanced
      for (const skill of skills.recommended) {
        const courses = this.getCoursesBySkill(skill, { level: "Intermediate", maxResults: 2 });
        learningPath.skillsToLearn.recommended.push({
          skill: skill,
          courses: courses.length,
          estimatedHours: courses.reduce((sum, c) => sum + (parseInt(c.hours_per_week) || 5), 0)
        });
        learningPath.coursesByPhase.phase1.push(...courses);
      }
      
      // Add some advanced skills for phase 2
      for (const skill of skills.advanced.slice(0, 2)) {
        const courses = this.getCoursesBySkill(skill, { maxResults: 1 });
        learningPath.skillsToLearn.advanced.push({
          skill: skill,
          courses: courses.length,
          estimatedHours: courses.reduce((sum, c) => sum + (parseInt(c.hours_per_week) || 5), 0)
        });
        learningPath.coursesByPhase.phase2.push(...courses);
      }
    }
    else { // Advanced
      // Advanced users focus on advanced skills and latest trends
      for (const skill of skills.advanced) {
        const courses = this.getCoursesBySkill(skill, { level: "Advanced", maxResults: 2 });
        learningPath.skillsToLearn.advanced.push({
          skill: skill,
          courses: courses.length,
          estimatedHours: courses.reduce((sum, c) => sum + (parseInt(c.hours_per_week) || 5), 0)
        });
        learningPath.coursesByPhase.phase1.push(...courses);
      }
      
      // Add some specialized courses for phase 2
      const specializedCourses = this.searchCourses("Advanced " + targetRole, { maxResults: 2 });
      learningPath.coursesByPhase.phase2.push(...specializedCourses);
    }
    
    // Add project suggestions for phase 3
    learningPath.coursesByPhase.phase3 = this.generateProjectSuggestions(targetRole, currentLevel);
    
    // Cache the learning path
    this.cachedLearningPaths[cacheKey] = learningPath;
    
    return learningPath;
  }
  
  // Calculate estimated completion time based on level and timeframe
  calculateCompletionTime(currentLevel, timeframe) {
    // Parse timeframe
    const timeValue = parseInt(timeframe);
    const timeUnit = timeframe.replace(/[0-9]/g, '').trim();
    
    // Base hours per week based on level
    let hoursPerWeek;
    switch (currentLevel) {
      case "Beginner":
        hoursPerWeek = 10;
        break;
      case "Intermediate":
        hoursPerWeek = 12;
        break;
      case "Advanced":
        hoursPerWeek = 8; // Advanced learners often have other commitments
        break;
      default:
        hoursPerWeek = 10;
    }
    
    // Calculate total hours
    let totalHours;
    if (timeUnit.includes("week")) {
      totalHours = timeValue * hoursPerWeek;
    } else if (timeUnit.includes("month")) {
      totalHours = timeValue * 4 * hoursPerWeek;
    } else { // Assume years
      totalHours = timeValue * 52 * hoursPerWeek;
    }
    
    return {
      totalHours: totalHours,
      hoursPerWeek: hoursPerWeek,
      completionText: `Approximately ${totalHours} hours total, at ${hoursPerWeek} hours per week`
    };
  }
  
  // Generate project suggestions for applied learning
  generateProjectSuggestions(targetRole, level) {
    // Define projects by role and level
    const projectsByRole = {
      "frontend developer": {
        "Beginner": [
          {
            id: "project-fe-1",
            title: "Personal Portfolio Website",
            skills: ["HTML", "CSS", "JavaScript"],
            description: "Create a responsive personal portfolio website to showcase your projects and skills.",
            estimatedTime: "20 hours",
            resources: ["GitHub Pages (free hosting)", "MDN Web Docs", "YouTube tutorials"],
            difficulty: "Beginner"
          },
          {
            id: "project-fe-2",
            title: "Weather App",
            skills: ["JavaScript", "API Integration", "CSS"],
            description: "Build a weather app that fetches data from a weather API and displays forecast information.",
            estimatedTime: "15 hours",
            resources: ["OpenWeather API (free tier)", "JavaScript tutorials", "CodePen examples"],
            difficulty: "Beginner"
          }
        ],
        "Intermediate": [
          {
            id: "project-fe-3",
            title: "E-commerce Product Page",
            skills: ["React", "CSS", "State Management"],
            description: "Develop a dynamic product page with image gallery, reviews, and cart functionality.",
            estimatedTime: "25 hours",
            resources: ["React documentation", "Fake Store API", "GitHub repositories"],
            difficulty: "Intermediate"
          }
        ],
        "Advanced": [
          {
            id: "project-fe-4",
            title: "Real-time Dashboard",
            skills: ["React", "WebSockets", "Advanced CSS", "Data Visualization"],
            description: "Create a dashboard with real-time updates, charts, and interactive elements.",
            estimatedTime: "40 hours",
            resources: ["Socket.io", "D3.js or Chart.js", "React documentation"],
            difficulty: "Advanced"
          }
        ]
      },
      "data scientist": {
        "Beginner": [
          {
            id: "project-ds-1",
            title: "Exploratory Data Analysis Project",
            skills: ["Python", "Pandas", "Data Visualization"],
            description: "Analyze a public dataset and create visualizations to extract insights.",
            estimatedTime: "15 hours",
            resources: ["Kaggle datasets", "Pandas documentation", "Matplotlib tutorials"],
            difficulty: "Beginner"
          }
        ],
        "Intermediate": [
          {
            id: "project-ds-2",
            title: "Predictive Model for House Prices",
            skills: ["Machine Learning", "Python", "Feature Engineering"],
            description: "Build a regression model to predict house prices using various features.",
            estimatedTime: "30 hours",
            resources: ["Scikit-learn documentation", "Housing datasets", "Jupyter Notebook"],
            difficulty: "Intermediate"
          }
        ],
        "Advanced": [
          {
            id: "project-ds-3",
            title: "Recommendation System",
            skills: ["Python", "Collaborative Filtering", "Deep Learning"],
            description: "Develop a recommendation system for products or content using user behavior data.",
            estimatedTime: "50 hours",
            resources: ["TensorFlow or PyTorch", "MovieLens dataset", "Research papers"],
            difficulty: "Advanced"
          }
        ]
      }
    };
    
    // Generic projects for all roles
    const genericProjects = {
      "Beginner": [
        {
          id: "project-gen-1",
          title: "Portfolio Project",
          skills: ["Core Skills", "Documentation", "Project Management"],
          description: "Create a showcase of your skills with examples and documentation.",
          estimatedTime: "20 hours",
          resources: ["GitHub", "Documentation tools", "Online tutorials"],
          difficulty: "Beginner"
        }
      ],
      "Intermediate": [
        {
          id: "project-gen-2",
          title: "Collaborative Team Project",
          skills: ["Team Collaboration", "Version Control", "Communication"],
          description: "Work with 2-3 others to build a project that solves a real problem.",
          estimatedTime: "40 hours",
          resources: ["GitHub", "Communication tools", "Project management resources"],
          difficulty: "Intermediate"
        }
      ],
      "Advanced": [
        {
          id: "project-gen-3",
          title: "Open Source Contribution",
          skills: ["Advanced Technical Skills", "Collaboration", "Documentation"],
          description: "Contribute to an existing open source project relevant to your field.",
          estimatedTime: "30 hours",
          resources: ["GitHub", "Open source communities", "Documentation guides"],
          difficulty: "Advanced"
        }
      ]
    };
    
    // Find matching role projects
    let projects = [];
    
    // Convert role to lowercase for matching
    const normalizedRole = targetRole.toLowerCase();
    
    // Look for exact role match
    for (const role in projectsByRole) {
      if (normalizedRole.includes(role)) {
        projects = projectsByRole[role][level] || [];
        break;
      }
    }
    
    // If no specific projects found, use generic ones
    if (projects.length === 0) {
      projects = genericProjects[level] || [];
    }
    
    // Format projects as course-like objects for consistency
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      provider: "Project",
      skills: project.skills,
      level: project.difficulty,
      duration: project.estimatedTime,
      description: project.description,
      resources: project.resources.join(", "),
      isProject: true
    }));
  }
  
  // Get course recommendations based on user profile and interests
  async getRecommendations(userProfile) {
    const { skills = [], interests = [], role = "", experience_level = "Beginner" } = userProfile;
    
    // Prepare recommendations object
    const recommendations = {
      mostRelevant: [],
      quickUpskill: [],
      trendingInField: [],
      bestRated: []
    };
    
    // Get most relevant courses based on user skills and interests
    const relevantSkills = [...skills, ...interests].slice(0, 3);
    for (const skill of relevantSkills) {
      const courses = this.getCoursesBySkill(skill, { maxResults: 2 });
      recommendations.mostRelevant.push(...courses);
    }
    
    // Quick upskill courses (shorter duration)
    const allCourses = [...this.coursesDatabase];
    const quickCourses = allCourses.filter(course => {
      // Look for courses with duration less than 15 hours or 3 weeks
      const durationStr = course.duration.toLowerCase();
      if (durationStr.includes('hour')) {
        const hours = parseInt(durationStr);
        return hours && hours <= 15;
      } else if (durationStr.includes('week')) {
        const weeks = parseInt(durationStr);
        return weeks && weeks <= 3;
      }
      return false;
    });
    
    // Sort by rating and pick top 3
    quickCourses.sort((a, b) => b.rating - a.rating);
    recommendations.quickUpskill = quickCourses.slice(0, 3);
    
    // Trending courses in user's field
    let fieldKeywords = [];
    if (role.includes('front')) fieldKeywords = ['React', 'UI', 'Frontend'];
    else if (role.includes('back')) fieldKeywords = ['Node.js', 'API', 'Backend'];
    else if (role.includes('data')) fieldKeywords = ['Python', 'Data Science', 'ML'];
    else fieldKeywords = ['JavaScript', 'Web Development', 'Programming'];
    
    // Get courses matching field keywords
    for (const keyword of fieldKeywords) {
      const courses = this.searchCourses(keyword, { maxResults: 1 });
      recommendations.trendingInField.push(...courses);
    }
    
    // Best rated courses overall (rating > 4.7)
    const bestRatedCourses = allCourses.filter(course => course.rating >= 4.7);
    bestRatedCourses.sort((a, b) => b.reviews - a.reviews); // Sort by most reviews
    recommendations.bestRated = bestRatedCourses.slice(0, 3);
    
    // Remove duplicates across categories
    const seenIds = new Set();
    for (const category in recommendations) {
      recommendations[category] = recommendations[category].filter(course => {
        if (seenIds.has(course.id)) return false;
        seenIds.add(course.id);
        return true;
      });
    }
    
    return recommendations;
  }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LearningPathManager;
} 