/**
 * Smart Job Autofill
 * This class handles the automatic filling of job application forms
 * with user profile information.
 */
class SmartJobAutofill {
  constructor() {
    this.userData = this.getUserProfileData();
    this.formPatterns = this.loadFormPatterns();
    
    // Initialize event listeners
    this.initEventListeners();
    
    console.log('Smart Job Autofill initialized');
  }
  
  /**
   * Get user profile data - In a real app, this would come from the user's account
   * For this demo, we're using sample data
   */
  getUserProfileData() {
    // This would normally be loaded from the user's account
    const userData = {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States',
        linkedin: 'linkedin.com/in/johndoe',
        website: 'johndoe.com'
      },
      resume: {
        currentPosition: 'Senior Software Engineer',
        currentCompany: 'Tech Innovations Inc.',
        yearsOfExperience: 5,
        highestDegree: 'Master of Science in Computer Science',
        university: 'University of Technology',
        graduationYear: '2018',
        skills: [
          'JavaScript', 'React', 'Node.js', 'AWS', 'GraphQL', 'Docker',
          'TypeScript', 'Python', 'CI/CD', 'Kubernetes', 'SQL'
        ],
        certifications: [
          'AWS Certified Solutions Architect',
          'Google Cloud Professional Developer'
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Spanish', proficiency: 'Professional' }
        ]
      },
      preferences: {
        jobTypes: ['Full-time', 'Remote'],
        salaryExpectation: '$120,000 - $150,000',
        locations: ['San Francisco', 'Remote'],
        willingToRelocate: false
      }
    };
    
    return userData;
  }
  
  /**
   * Load form patterns - these are patterns that help identify common form fields
   * across different job application platforms
   */
  loadFormPatterns() {
    return {
      // Common field patterns for name fields
      firstName: ['first name', 'given name', 'fname', 'first-name', 'firstname'],
      lastName: ['last name', 'family name', 'lname', 'last-name', 'lastname', 'surname'],
      fullName: ['full name', 'name', 'your name'],
      
      // Contact information
      email: ['email', 'e-mail', 'email address', 'e-mail address'],
      phone: ['phone', 'telephone', 'mobile', 'cell', 'phone number'],
      
      // Location information
      address: ['address', 'street address', 'mailing address'],
      city: ['city', 'town'],
      state: ['state', 'province', 'region'],
      zipCode: ['zip', 'zip code', 'postal code', 'postal'],
      country: ['country', 'nation'],
      
      // Professional information
      currentCompany: ['current company', 'company', 'employer', 'current employer'],
      currentPosition: ['current position', 'position', 'job title', 'current title', 'title', 'current job title', 'role'],
      experience: ['years of experience', 'experience', 'work experience', 'exp', 'years exp'],
      
      // Education
      degree: ['degree', 'highest degree', 'education level', 'qualification'],
      university: ['university', 'college', 'school', 'institution', 'educational institution'],
      graduationYear: ['graduation year', 'year of graduation', 'completion year'],
      
      // Skills and qualifications
      skills: ['skills', 'technical skills', 'qualifications', 'competencies'],
      languages: ['languages', 'spoken languages', 'language proficiency'],
      certifications: ['certifications', 'certificates', 'credentials'],
      
      // Cover letter and others
      coverLetter: ['cover letter', 'letter', 'why do you want to work here', 'introduction', 'introduction letter'],
      salary: ['salary', 'expected salary', 'salary expectation', 'salary requirement', 'compensation expectation']
    };
  }
  
  /**
   * Initialize event listeners for page interactions
   */
  initEventListeners() {
    // In a real extension, this would add listeners to detect forms
    // For this demo, we're just handling the demo form
  }
  
  /**
   * Detect job application forms on the current page
   * In a real extension, this would scan the page for common job application forms
   */
  detectForms() {
    // In a real extension, this would return all detected forms on the page
    return document.querySelectorAll('form');
  }
  
  /**
   * Analyze a form to determine which fields map to which user data
   * @param {HTMLFormElement} form - The form to analyze
   * @returns {Object} Mapping of form fields to user data
   */
  analyzeForm(form) {
    const fieldMapping = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const fieldType = this.identifyFieldType(input);
      if (fieldType) {
        fieldMapping[input.id || input.name] = fieldType;
      }
    });
    
    return fieldMapping;
  }
  
  /**
   * Identify what type of field this is based on attributes and context
   * @param {HTMLElement} input - The input element to identify
   * @returns {String|null} The identified field type or null if not identified
   */
  identifyFieldType(input) {
    const nameAttr = input.name ? input.name.toLowerCase() : '';
    const idAttr = input.id ? input.id.toLowerCase() : '';
    const labelText = this.getLabelText(input).toLowerCase();
    const placeholderText = input.placeholder ? input.placeholder.toLowerCase() : '';
    
    // Check all field types against the input attributes
    for (const [fieldType, patterns] of Object.entries(this.formPatterns)) {
      for (const pattern of patterns) {
        if (
          nameAttr.includes(pattern) || 
          idAttr.includes(pattern) ||
          labelText.includes(pattern) ||
          placeholderText.includes(pattern)
        ) {
          return fieldType;
        }
      }
    }
    
    // Special case for email input type
    if (input.type === 'email') {
      return 'email';
    }
    
    // Special case for tel input type
    if (input.type === 'tel') {
      return 'phone';
    }
    
    return null;
  }
  
  /**
   * Get the text content of the label associated with an input
   * @param {HTMLElement} input - The input element
   * @returns {String} The label text, or empty string if no label found
   */
  getLabelText(input) {
    // Try to find label by for attribute
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        return label.textContent.trim();
      }
    }
    
    // Try to find parent label
    let parent = input.parentElement;
    while (parent) {
      if (parent.tagName === 'LABEL') {
        // Extract text content excluding the input's siblings
        const clone = parent.cloneNode(true);
        const inputInClone = clone.querySelector(`#${input.id}`);
        if (inputInClone) {
          inputInClone.remove();
        }
        return clone.textContent.trim();
      }
      
      // Check if parent contains a label
      const labelInParent = parent.querySelector('label');
      if (labelInParent && !labelInParent.getAttribute('for')) {
        return labelInParent.textContent.trim();
      }
      
      parent = parent.parentElement;
    }
    
    return '';
  }
  
  /**
   * Fill a form with user data based on the field mapping
   * @param {HTMLFormElement} form - The form to fill
   * @param {Object} fieldMapping - Mapping of form fields to user data types
   */
  fillForm(form, fieldMapping) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let filledCount = 0;
    
    inputs.forEach(input => {
      const fieldId = input.id || input.name;
      if (fieldMapping[fieldId]) {
        const fieldType = fieldMapping[fieldId];
        const value = this.getValueForField(fieldType);
        
        if (value !== null) {
          this.setInputValue(input, value);
          filledCount++;
        }
      }
    });
    
    return {
      success: true,
      fieldsAutofilled: filledCount,
      totalFields: inputs.length
    };
  }
  
  /**
   * Get the appropriate value from user data for a given field type
   * @param {String} fieldType - The type of field to get data for
   * @returns {String|null} The value to use, or null if not found
   */
  getValueForField(fieldType) {
    const { profile, resume, preferences } = this.userData;
    
    // Map field types to user data
    const fieldValueMap = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      state: profile.state,
      zipCode: profile.zipCode,
      country: profile.country,
      currentCompany: resume.currentCompany,
      currentPosition: resume.currentPosition,
      experience: resume.yearsOfExperience,
      degree: resume.highestDegree,
      university: resume.university,
      graduationYear: resume.graduationYear,
      skills: resume.skills.join(', '),
      certifications: resume.certifications.join(', '),
      languages: resume.languages.map(l => `${l.name} (${l.proficiency})`).join(', '),
      salary: preferences.salaryExpectation,
      coverLetter: this.generateCoverLetter()
    };
    
    return fieldValueMap[fieldType] || null;
  }
  
  /**
   * Set the value of an input element based on its type
   * @param {HTMLElement} input - The input element to set
   * @param {String} value - The value to set
   */
  setInputValue(input, value) {
    if (input.tagName === 'SELECT') {
      // For select elements, find the option that best matches the value
      const options = Array.from(input.options);
      const option = options.find(opt => 
        opt.text.toLowerCase().includes(value.toString().toLowerCase())
      );
      
      if (option) {
        input.value = option.value;
      }
    } else if (input.type === 'checkbox' || input.type === 'radio') {
      // For checkboxes and radios, check if the value matches
      if (input.value.toLowerCase() === value.toString().toLowerCase()) {
        input.checked = true;
      }
    } else {
      // For regular inputs and textareas
      input.value = value;
      
      // Trigger input event to activate any listeners
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
      
      // For some forms, change event is also needed
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  }
  
  /**
   * Generate a generic cover letter - in a real app, this would be more personalized
   * @returns {String} A generated cover letter
   */
  generateCoverLetter() {
    const { firstName, lastName } = this.userData.profile;
    const { currentPosition, currentCompany } = this.userData.resume;
    
    return `Dear Hiring Manager,

I am writing to express my interest in the position at your company. As a ${currentPosition} at ${currentCompany}, I have developed a strong skill set that aligns well with the requirements outlined in your job posting.

My experience includes working on complex projects that required creative problem-solving, collaboration with cross-functional teams, and a deep understanding of industry best practices. I believe these skills would make me a valuable addition to your team.

I am excited about the opportunity to bring my experience and enthusiasm to your company and would welcome the chance to discuss how my background, skills, and qualifications would be beneficial to your organization.

Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,
${firstName} ${lastName}`;
  }
  
  /**
   * Simulate autofill for the demo form
   * @param {String} formSelector - CSS selector for the form
   * @returns {Object} Result of the autofill operation
   */
  simulateAutofill(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) {
      console.error('Form not found:', formSelector);
      return { success: false, message: 'Form not found' };
    }
    
    // Analyze the form to create field mapping
    const fieldMapping = {
      'first-name': 'firstName',
      'last-name': 'lastName',
      'email': 'email',
      'phone': 'phone',
      'current-company': 'currentCompany',
      'current-position': 'currentPosition',
      'years-experience': 'experience',
      'degree': 'degree',
      'skills': 'skills',
      'cover-letter': 'coverLetter'
    };
    
    // Fill the form with user data
    return this.fillForm(form, fieldMapping);
  }
}

// Initialize if in browser context
if (typeof window !== 'undefined') {
  // Create global instance once DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    window.SmartJobAutofill = SmartJobAutofill;
    
    // Add to the Career Mentor app namespace if it exists
    if (window.careerMentorApp) {
      window.careerMentorApp.smartJobAutofill = new SmartJobAutofill();
    }
  });
} 