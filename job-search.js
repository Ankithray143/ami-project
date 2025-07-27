// Job Search API Integration with Gemini API

class JobSearchAPI {
  constructor() {
    this.initialized = false;
  }

  init() {
    console.log('Initializing Job Search API');
    this.initialized = true;
    
    // Make available globally
    if (typeof window !== 'undefined') {
      window.JobSearchAPI = this;
    }
    
    console.log('Job Search API initialized successfully');
    return this;
  }

  // Get Gemini API key from CareerMentorApp
  getGeminiApiKey() {
    if (window.careerMentorApp && typeof window.careerMentorApp.getGeminiApiKey === 'function') {
      return window.careerMentorApp.getGeminiApiKey();
    }
    return null;
  }

  // Get Gemini API model from CareerMentorApp
  getGeminiApiModel() {
    if (window.careerMentorApp && typeof window.careerMentorApp.getGeminiApiModel === 'function') {
      return window.careerMentorApp.getGeminiApiModel();
    }
    return 'gemini-pro';
  }

  // Search for jobs using Gemini API
  async searchJobs(query, location, filters = {}) {
    console.log(`Searching jobs with query: ${query}, location: ${location}`);
    
    try {
      const geminiApiKey = this.getGeminiApiKey();
      if (!geminiApiKey) {
        console.error('Gemini API key is missing. Please configure it in initialize.js. Falling back to mock data.');
        return this._mockJobSearch(query, location, filters);
      }

      const prompt = `Generate 5 realistic job listings based on the following search criteria:\n\n
        Job Query: ${query}\n
        Location: ${location}\n
        Filters: ${JSON.stringify(filters)}\n\n
        Format the response as a JSON array of objects with the following structure:\n
        [\n
          {\n
            "title": "Job title",\n
            "company": "Company name",\n
            "location": "Job location",\n
            "salary_range": "Salary range in USD",\n
            "job_type": "Full-time, Part-time, Contract, etc.",\n
            "experience_level": "Entry, Mid, Senior, etc.",\n
            "description": "Brief job description",\n
            "required_skills": ["Skill 1", "Skill 2", ...],\n
            "match_score": A number between 70 and 100 representing match percentage,\n
            "posted_date": "YYYY-MM-DD"\n
          },\n
          ...\n
        ]\n\n
        Make the job listings realistic and relevant to the search criteria.`;

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.getGeminiApiModel()}:generateContent?key=${geminiApiKey}`, {
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
        // Fallback to mock data if Gemini API fails
        return this._mockJobSearch(query, location, filters);
      }

      const data = await geminiResponse.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        console.error('Could not extract JSON from Gemini response');
        // Fallback to mock data if JSON extraction fails
        return this._mockJobSearch(query, location, filters);
      }

      const jobs = JSON.parse(jsonMatch[0]);
      return jobs;

    } catch (error) {
      console.error('Error fetching jobs from Gemini API:', error);
      // Fallback to mock data if Gemini API fails
      return this._mockJobSearch(query, location, filters);
    }
  }

  // Mock job search for fallback
  _mockJobSearch(query, location, filters = {}) {
    console.log(`Using mock job search for query: ${query}, location: ${location}`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        const companies = ["Microsoft", "Google", "Amazon", "Apple", "Meta", "IBM", "Oracle"];
        const jobTitles = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer"];
        const locations = [location || "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote"];
        const skills = ["JavaScript", "React", "Python", "AWS", "Docker", "TypeScript", "Node.js", "SQL", "Machine Learning"];
        
        const jobs = [];
        const count = 5;
        
        for (let i = 0; i < count; i++) {
          const company = companies[Math.floor(Math.random() * companies.length)];
          const title = query ? `${query} ${jobTitles[Math.floor(Math.random() * jobTitles.length)]}` : jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const jobLocation = locations[Math.floor(Math.random() * locations.length)];
          const matchScore = Math.floor(70 + Math.random() * 30);
          const requiredSkills = [];
          const skillCount = 3 + Math.floor(Math.random() * 3);
          
          for (let j = 0; j < skillCount; j++) {
            const skill = skills[Math.floor(Math.random() * skills.length)];
            if (!requiredSkills.includes(skill)) {
              requiredSkills.push(skill);
            }
          }
          
          const minSalary = 70000 + Math.floor(Math.random() * 30000);
          const maxSalary = minSalary + 30000 + Math.floor(Math.random() * 50000);
          
          const today = new Date();
          const postedDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
          
          jobs.push({
            title: title,
            company: company,
            location: jobLocation,
            salary_range: `${(minSalary / 1000).toFixed(0)}k - ${(maxSalary / 1000).toFixed(0)}k`,
            job_type: Math.random() > 0.3 ? "Full-time" : "Contract",
            experience_level: Math.random() > 0.5 ? "Mid" : "Senior",
            description: `We're looking for an experienced ${title} to join our team. You'll be working on cutting-edge technologies and helping to build scalable solutions.`,
            required_skills: requiredSkills,
            match_score: matchScore,
            posted_date: postedDate.toISOString().split('T')[0]
          });
        }
        
        resolve(jobs);
      }, 800);
    });
  }

  // Apply for a job
  async applyForJob(jobId, resume) {
    console.log(`Applying for job ID: ${jobId}`);
    
    // In a real implementation, this would send the application to a backend API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          applicationId: `app-${Date.now()}`,
          message: "Your application has been submitted successfully!"
        });
      }, 1000);
    });
  }

  // Save job to favorites
  saveJob(jobId) {
    console.log(`Saving job ID: ${jobId} to favorites`);
    
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    }
    
    return true;
  }

  // Remove job from favorites
  unsaveJob(jobId) {
    console.log(`Removing job ID: ${jobId} from favorites`);
    
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const updatedJobs = savedJobs.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    
    return true;
  }

  // Get saved jobs
  getSavedJobs() {
    return JSON.parse(localStorage.getItem('savedJobs') || '[]');
  }
}

// Initialize JobSearchAPI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize Job Search API
  const jobSearchAPI = new JobSearchAPI().init();
  
  // Set up event listeners for job search form
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const queryInput = document.querySelector('input[placeholder="Job title, skills, or company"]');
      const locationInput = document.querySelector('input[placeholder="Location"]');
      
      if (queryInput && locationInput) {
        const query = queryInput.value.trim();
        const location = locationInput.value.trim();
        
        // Get filters
        const filters = {
          jobType: [],
          experienceLevel: [],
          salary: {
            min: null,
            max: null
          }
        };
        
        // Job Type filters
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
          const label = checkbox.nextElementSibling.textContent.trim();
          if (['Full-time', 'Remote', 'Contract', 'Internship'].includes(label)) {
            filters.jobType.push(label);
          } else if (['Entry Level', 'Mid Level', 'Senior Level', 'Lead'].includes(label)) {
            filters.experienceLevel.push(label);
          }
        });
        
        // Salary range
        const minSalaryInput = document.querySelector('input[placeholder="Min"]');
        const maxSalaryInput = document.querySelector('input[placeholder="Max"]');
        
        if (minSalaryInput && minSalaryInput.value) {
          filters.salary.min = parseInt(minSalaryInput.value);
        }
        
        if (maxSalaryInput && maxSalaryInput.value) {
          filters.salary.max = parseInt(maxSalaryInput.value);
        }
        
        // Show loading state
        const jobListings = document.querySelector('.job-listings');
        if (jobListings) {
          jobListings.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i><p class="mt-4 text-gray-400">Searching for jobs...</p></div>';
        }
        
        // Search for jobs
        try {
          const jobs = await jobSearchAPI.searchJobs(query, location, filters);
          displayJobResults(jobs);
        } catch (error) {
          console.error('Error searching for jobs:', error);
          if (jobListings) {
            jobListings.innerHTML = '<div class="text-center py-8"><i class="fas fa-exclamation-circle text-3xl text-red-500"></i><p class="mt-4 text-gray-400">Error searching for jobs. Please try again.</p></div>';
          }
        }
      }
    });
  }
  
  // Function to display job results
  function displayJobResults(jobs) {
    const jobListings = document.querySelector('.job-listings');
    if (!jobListings) return;
    
    if (!jobs || jobs.length === 0) {
      jobListings.innerHTML = '<div class="text-center py-8"><i class="fas fa-search text-3xl text-gray-500"></i><p class="mt-4 text-gray-400">No jobs found. Try different search criteria.</p></div>';
      return;
    }
    
    let html = '';
    
    jobs.forEach(job => {
      const skillsHtml = job.required_skills.map(skill => 
        `<span class="bg-indigo-900/30 text-indigo-300 px-3 py-1 rounded-full text-sm">${skill}</span>`
      ).join('');
      
      html += `
        <div class="job-card dark-glassmorphism rounded-xl p-6 relative" data-job-id="${job.id || 'job-' + Date.now()}">
          <div class="match-score">${job.match_score}%</div>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-white mb-2">${job.title}</h3>
              <div class="flex items-center space-x-4 text-gray-400">
                <span class="flex items-center">
                  <i class="fas fa-building mr-2"></i>${job.company}
                </span>
                <span class="flex items-center">
                  <i class="fas fa-map-marker-alt mr-2"></i>${job.location}
                </span>
                <span class="flex items-center">
                  <i class="fas fa-dollar-sign mr-2"></i>${job.salary_range}
                </span>
              </div>
            </div>
            <button class="save-job-btn bg-indigo-600/20 hover:bg-indigo-600/30 text-white px-4 py-2 rounded-lg transition-all duration-200">
              <i class="fas fa-bookmark mr-2"></i>Save
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${skillsHtml}
          </div>
          
          <p class="text-gray-400 mb-4">
            ${job.description}
          </p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-gray-400">
              <span class="flex items-center">
                <i class="fas fa-clock mr-2"></i>${job.job_type}
              </span>
              <span class="flex items-center">
                <i class="fas fa-briefcase mr-2"></i>${job.experience_level}
              </span>
              <span class="flex items-center">
                <i class="fas fa-calendar mr-2"></i>Posted ${formatDate(job.posted_date)}
              </span>
            </div>
            <button class="apply-job-btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
              Apply Now
            </button>
          </div>
        </div>
      `;
    });
    
    jobListings.innerHTML = html;
    
    // Add event listeners for save and apply buttons
    document.querySelectorAll('.save-job-btn').forEach(button => {
      button.addEventListener('click', function() {
        const jobCard = this.closest('.job-card');
        const jobId = jobCard.dataset.jobId;
        
        if (this.classList.contains('saved')) {
          jobSearchAPI.unsaveJob(jobId);
          this.classList.remove('saved');
          this.classList.remove('bg-indigo-600');
          this.classList.add('bg-indigo-600/20');
          this.innerHTML = '<i class="fas fa-bookmark mr-2"></i>Save';
        } else {
          jobSearchAPI.saveJob(jobId);
          this.classList.add('saved');
          this.classList.remove('bg-indigo-600/20');
          this.classList.add('bg-indigo-600');
          this.innerHTML = '<i class="fas fa-check mr-2"></i>Saved';
        }
      });
    });
    
    document.querySelectorAll('.apply-job-btn').forEach(button => {
      button.addEventListener('click', function() {
        const jobCard = this.closest('.job-card');
        const jobId = jobCard.dataset.jobId;
        const jobTitle = jobCard.querySelector('h3').textContent;
        const company = jobCard.querySelector('.fas.fa-building').nextSibling.textContent.trim();
        
        // In a real app, this would open an application form or modal
        alert(`You are applying for the ${jobTitle} position at ${company}. In a complete implementation, this would open an application form.`);
      });
    });
  }
  
  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
});