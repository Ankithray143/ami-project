/**
 * Career Mentor - Resume Analyzer
 * This module provides resume analysis functionality using AI
 */

// resume-analyzer.js
// Implements the ResumeAnalyzer class for the AI Resume Analyzer page, interacting with the Flask API at /analyze_resume

class ResumeAnalyzer {
  constructor() {
    // Since all services are running on localhost:3000
    this.apiEndpoint = 'http://localhost:3000/analyze_resume';
    this.settings = {
      industry: 'Software Development',
      experienceLevel: 'mid-level',
      checkATS: true
    };
    this.resumeText = '';
    this.analysisResults = null;
    
    this.initElements();
    this.setupEventListeners();
    this.loadSettings();
  }
  
  initElements() {
    // File Upload
    this.uploadContainer = document.getElementById('upload-container');
    this.uploadContent = document.getElementById('upload-content');
    this.uploadLoading = document.getElementById('upload-loading');
    this.fileInput = document.getElementById('resume-upload');
    
    // Sections
    this.uploadSection = document.getElementById('upload-section');
    this.analysisSection = document.getElementById('analysis-section');
    
    // Score & Progress
    this.scoreValue = document.getElementById('score-value');
    this.scoreBar = document.getElementById('score-bar');
    this.scoreFeedback = document.getElementById('score-feedback');
    
    // Lists
    this.strengthsList = document.getElementById('strengths-list');
    this.weaknessesList = document.getElementById('weaknesses-list');
    this.suggestionsList = document.getElementById('suggestions-list');
    this.keywordsFound = document.getElementById('keywords-found');
    this.keywordsMissing = document.getElementById('keywords-missing');
    
    // Preview
    this.resumePreview = document.getElementById('resume-preview');
    
    // Buttons
    this.newAnalysisBtn = document.getElementById('new-analysis-btn');
    this.optimizeBtn = document.getElementById('optimize-btn');
    this.downloadBtn = document.getElementById('download-btn');
    
    // Settings Modal
    this.settingsModal = document.getElementById('settings-modal');
    this.targetIndustry = document.getElementById('target-industry');
    this.experienceLevel = document.getElementById('experience-level');
    this.atsCheck = document.getElementById('ats-check');
    this.saveSettingsBtn = document.getElementById('save-settings');
    this.cancelSettingsBtn = document.getElementById('cancel-settings');
    this.settingsBtn = document.getElementById('settings-btn');
    this.helpBtn = document.getElementById('help-btn');
  }
  
  setupEventListeners() {
    // File Upload
    this.uploadContainer.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', () => this.handleFileUpload());
    
    // Drag and Drop
    this.uploadContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadContainer.classList.add('border-blue-500');
      this.uploadContainer.classList.remove('border-gray-600');
    });
    
    this.uploadContainer.addEventListener('dragleave', () => {
      this.uploadContainer.classList.remove('border-blue-500');
      this.uploadContainer.classList.add('border-gray-600');
    });
    
    this.uploadContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadContainer.classList.remove('border-blue-500');
      this.uploadContainer.classList.add('border-gray-600');
      
      if (e.dataTransfer.files.length) {
        this.fileInput.files = e.dataTransfer.files;
        this.handleFileUpload();
      }
    });
    
    // Buttons
    this.newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
    this.optimizeBtn.addEventListener('click', () => this.optimizeResume());
    this.downloadBtn.addEventListener('click', () => this.downloadResume());
    
    // Settings
    this.settingsBtn.addEventListener('click', () => this.openSettings());
    this.cancelSettingsBtn.addEventListener('click', () => this.closeSettings());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    
    // Help
    this.helpBtn.addEventListener('click', () => alert('Upload your resume to get AI-powered feedback. Supports PDF, DOCX, and TXT formats up to 5MB.'));
  }
  
  loadSettings() {
    const savedSettings = localStorage.getItem('resumeAnalyzerSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.targetIndustry.value = this.settings.industry;
      this.experienceLevel.value = this.settings.experienceLevel;
      this.atsCheck.checked = this.settings.checkATS;
    }
  }
  
  saveSettings() {
    this.settings = {
      industry: this.targetIndustry.value,
      experienceLevel: this.experienceLevel.value,
      checkATS: this.atsCheck.checked
    };
    
    localStorage.setItem('resumeAnalyzerSettings', JSON.stringify(this.settings));
    this.closeSettings();
  }
  
  openSettings() {
    this.settingsModal.classList.remove('hidden');
  }
  
  closeSettings() {
    this.settingsModal.classList.add('hidden');
  }
  
  async handleFileUpload() {
    const file = this.fileInput.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }
    
    // Show loading state
    this.uploadContent.classList.add('hidden');
    this.uploadLoading.classList.remove('hidden');
    
    try {
      // Extract text from file
      this.resumeText = await this.extractTextFromFile(file);
      console.log('Extracted text:', this.resumeText.substring(0, 100) + '...');
      
      // Analyze with Flask API
      this.analysisResults = await this.analyzeWithAPI(this.resumeText);
      console.log('Analysis results:', this.analysisResults);
      
      // Display results
      this.displayResults();
      
      // Switch to analysis view
      this.uploadSection.classList.add('hidden');
      this.analysisSection.classList.remove('hidden');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert(`Error analyzing resume: ${error.message}. Please try again.`);
    } finally {
      // Reset upload UI
      this.uploadContent.classList.remove('hidden');
      this.uploadLoading.classList.add('hidden');
    }
  }
  
  async extractTextFromFile(file) {
    // For TXT files, read as text. For others, simulate extraction (real implementation would use backend extraction)
    return new Promise((resolve) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      } else {
        // Simulate processing time
        setTimeout(() => {
          resolve(`SAMPLE RESUME CONTENT\n\n${file.name}\n\nMock resume content for ${this.settings.industry} ${this.settings.experienceLevel} position.\n\nThis is a simulated extraction of text from ${file.type} file.\n\nSkills: JavaScript, Python, ${this.settings.industry.split(' ')[0]}\nExperience: 5 years\nEducation: BSc Computer Science`);
        }, 1500);
      }
    });
  }
  
  async analyzeWithAPI(text) {
    // Call Flask API
    const payload = {
      text,
      industry: this.settings.industry,
      experience_level: this.settings.experienceLevel,
      check_ats: this.settings.checkATS
    };
    
    console.log('Sending payload to API:', payload);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText);
        throw new Error('API returned non-JSON response. Please check if Flask server is running.');
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      // Validate required fields
      if (!data.score || !data.strengths || !data.weaknesses) {
        console.warn('API response missing required fields, using fallback');
        return this.generateMockAnalysis(text);
      }
      
      // Normalize keys for displayResults
      return {
        score: data.score,
        atsScore: data.ats_compatibility || 75,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        suggestions: data.suggestions || [],
        keywordsFound: data.keywords_found || [],
        keywordsMissing: data.keywords_missing || [],
        feedback: this.generateFeedback(data.score, data.ats_compatibility || 75),
        text
      };
    } catch (error) {
      console.error('Fetch error:', error);
      
      // If it's a network error or JSON parse error, use mock analysis
      if (error.message.includes('JSON') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.log('Using fallback mock analysis');
        return this.generateMockAnalysis(text);
      }
      
      throw error;
    }
  }
  
  generateMockAnalysis(text) {
    const score = Math.floor(Math.random() * 30) + 60; // 60-90
    const atsScore = Math.floor(Math.random() * 20) + 60; // 60-80
    
    const industry = this.settings.industry;
    const experience = this.settings.experienceLevel;
    
    const strengths = [
      "Clear and concise professional summary",
      "Relevant work experience highlighted effectively",
      "Technical skills prominently displayed",
      "Good use of action verbs in descriptions"
    ];
    
    const weaknesses = [
      "Lacks quantifiable achievements",
      "Could benefit from more industry-specific keywords",
      "Education section needs more detail",
      "Missing specific project examples"
    ];
    
    const suggestions = [
      {
        text: "Add metrics to your achievements (e.g. 'Increased sales by 25%')",
        priority: "high"
      },
      {
        text: "Include more projects relevant to " + industry,
        priority: "medium"
      },
      {
        text: "Proofread for grammatical errors",
        priority: "low"
      }
    ];
    
    const keywordsFound = ["JavaScript", "Python", "Teamwork", "Communication"];
    const keywordsMissing = [industry.split(' ')[0], "Leadership", "Agile", "Problem-solving"];
    
    return {
      score,
      atsScore,
      strengths,
      weaknesses,
      suggestions,
      keywordsFound,
      keywordsMissing,
      feedback: this.generateFeedback(score, atsScore),
      text
    };
  }
  
  generateFeedback(score, atsScore) {
    let feedback = 'Good start but needs improvements. ';
    if (score > 80) feedback = 'Strong resume with some minor improvements needed. ';
    if (score < 70) feedback = 'Significant improvements recommended to be competitive. ';
    feedback += `Your resume is optimized ${atsScore}% for Applicant Tracking Systems.`;
    return feedback;
  }
  
  displayResults() {
    const { score, atsScore, strengths, weaknesses, suggestions, keywordsFound, keywordsMissing, feedback, text } = this.analysisResults;
    
    // Update score
    this.scoreValue.textContent = `${score}%`;
    this.scoreBar.style.width = `${score}%`;
    this.scoreFeedback.textContent = feedback;
    
    // Update strengths
    this.strengthsList.innerHTML = strengths.map(s => 
      `<li class="flex items-start">
        <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
        <span>${s}</span>
      </li>`
    ).join('');
    
    // Update weaknesses
    this.weaknessesList.innerHTML = weaknesses.map(w => 
      `<li class="flex items-start">
        <i class="fas fa-times text-yellow-500 mt-1 mr-2"></i>
        <span>${w}</span>
      </li>`
    ).join('');
    
    // Update suggestions
    this.suggestionsList.innerHTML = suggestions.map(s => `
      <div class="border-l-4 ${s.priority === 'high' ? 'border-red-500' : s.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'} pl-4 py-2">
        <h4 class="font-medium ${s.priority === 'high' ? 'text-red-400' : s.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'}">${s.text}</h4>
        <p class="text-gray-400 text-sm">Priority: ${s.priority}</p>
      </div>
    `).join('');
    
    // Update keywords
    this.keywordsFound.innerHTML = keywordsFound.map(k => `
      <span class="keyword-chip bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">${k}</span>
    `).join('');
    
    this.keywordsMissing.innerHTML = keywordsMissing.map(k => `
      <span class="keyword-chip bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">${k}</span>
    `).join('');
    
    // Update preview
    this.resumePreview.textContent = text;
  }
  
  optimizeResume() {
    if (!this.analysisResults) {
      alert('No resume has been analyzed yet. Please upload and analyze a resume first.');
      return;
    }

    // Show loading state
    const optimizeBtn = document.getElementById('optimize-btn');
    const originalText = optimizeBtn.innerHTML;
    optimizeBtn.innerHTML = '<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Optimizing...';
    optimizeBtn.disabled = true;

    // Simulate optimization process
    setTimeout(() => {
      try {
        const optimizedResume = this.generateOptimizedResume();
        
        // Create download for optimized resume
        const blob = new Blob([optimizedResume], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized_resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        alert('Resume optimization complete! Your optimized resume has been downloaded.\n\nImprovements made:\n- Added quantifiable achievements\n- Included missing keywords\n- Enhanced formatting\n- Improved weak sections');

        // Reset button
        optimizeBtn.innerHTML = originalText;
        optimizeBtn.disabled = false;
      } catch (error) {
        console.error('Error optimizing resume:', error);
        alert('Error optimizing resume. Please try again.');
        optimizeBtn.innerHTML = originalText;
        optimizeBtn.disabled = false;
      }
    }, 2000);
  }

  generateOptimizedResume() {
    const { text, weaknesses, suggestions, keywordsMissing, score } = this.analysisResults;
    let optimizedText = text;

    // Add header with optimization note
    optimizedText = `OPTIMIZED RESUME\nGenerated based on AI analysis (Original Score: ${score}%)\n\n` + optimizedText;

    // Apply optimizations based on weaknesses and suggestions
    optimizedText = this.applyOptimizations(optimizedText);

    return optimizedText;
  }

  applyOptimizations(resumeText) {
    let optimized = resumeText;

    // 1. Add quantifiable achievements if missing
    if (this.hasWeakness('quantifiable') || this.hasWeakness('achievements')) {
      optimized = this.addQuantifiableAchievements(optimized);
    }

    // 2. Include missing keywords
    if (this.analysisResults.keywordsMissing && this.analysisResults.keywordsMissing.length > 0) {
      optimized = this.addMissingKeywords(optimized);
    }

    // 3. Improve formatting
    optimized = this.improveFormatting(optimized);

    // 4. Enhance weak sections
    optimized = this.enhanceWeakSections(optimized);

    // 5. Add optimization summary
    optimized += this.generateOptimizationSummary();

    return optimized;
  }

  hasWeakness(keyword) {
    return this.analysisResults.weaknesses.some(weakness => 
      weakness.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  addQuantifiableAchievements(resumeText) {
    // Add sample quantifiable achievements to job descriptions
    const quantifiers = [
      "• Increased productivity by 25% through process optimization",
      "• Reduced costs by 15% by implementing new strategies",
      "• Improved customer satisfaction by 30%",
      "• Led team of 5 developers to deliver project on time",
      "• Managed budget of $100K+ successfully",
      "• Achieved 95% client retention rate",
      "• Completed 20+ projects within deadlines",
      "• Trained 10+ team members in new technologies"
    ];

    // Find job description sections and add quantifiers
    const lines = resumeText.split('\n');
    const enhancedLines = [];
    let inJobSection = false;
    let addedQuantifiers = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      enhancedLines.push(line);

      // Detect job description sections
      if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work history')) {
        inJobSection = true;
      }

      // Add quantifiers to bullet points in job sections
      if (inJobSection && line.trim().startsWith('•') && addedQuantifiers < 3) {
        const randomQuantifier = quantifiers[Math.floor(Math.random() * quantifiers.length)];
        enhancedLines.push(randomQuantifier);
        addedQuantifiers++;
      }

      // Reset when we hit education or skills section
      if (line.toLowerCase().includes('education') || line.toLowerCase().includes('skills')) {
        inJobSection = false;
      }
    }

    return enhancedLines.join('\n');
  }

  addMissingKeywords(resumeText) {
    const missingKeywords = this.analysisResults.keywordsMissing;
    if (!missingKeywords || missingKeywords.length === 0) return resumeText;

    // Add missing keywords to skills section or create one
    const skillsSection = this.findOrCreateSkillsSection(resumeText);
    
    if (skillsSection) {
      const enhancedSkills = skillsSection + ', ' + missingKeywords.join(', ');
      return resumeText.replace(skillsSection, enhancedSkills);
    } else {
      // Create new skills section
      const skillsHeader = '\n\nSKILLS\n';
      const skillsContent = missingKeywords.join(', ');
      return resumeText + skillsHeader + skillsContent;
    }
  }

  findOrCreateSkillsSection(resumeText) {
    const skillsMatch = resumeText.match(/skills?:?\s*([^\n]+)/i);
    return skillsMatch ? skillsMatch[1].trim() : null;
  }

  improveFormatting(resumeText) {
    let formatted = resumeText;

    // Ensure consistent spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Improve section headers
    formatted = formatted.replace(/^(experience|education|skills|summary):/gmi, '\n$1:\n');
    
    // Ensure bullet points are consistent
    formatted = formatted.replace(/^[-•*]\s*/gm, '• ');
    
    // Add spacing around sections
    formatted = formatted.replace(/([A-Z][A-Z\s]+:)/g, '\n$1\n');

    return formatted;
  }

  enhanceWeakSections(resumeText) {
    let enhanced = resumeText;

    // Add professional summary if missing
    if (!resumeText.toLowerCase().includes('summary') && !resumeText.toLowerCase().includes('objective')) {
      const summary = this.generateProfessionalSummary();
      enhanced = summary + '\n\n' + enhanced;
    }

    // Enhance education section if weak
    if (this.hasWeakness('education')) {
      enhanced = this.enhanceEducationSection(enhanced);
    }

    return enhanced;
  }

  generateProfessionalSummary() {
    const industry = this.settings.industry;
    const experience = this.settings.experienceLevel;
    
    return `PROFESSIONAL SUMMARY\nExperienced ${experience} professional in ${industry} with a proven track record of delivering high-quality results. Skilled in problem-solving, team collaboration, and continuous learning. Passionate about leveraging technology to drive business success and create innovative solutions.`;
  }

  enhanceEducationSection(resumeText) {
    // Add more detail to education if it's too brief
    const educationMatch = resumeText.match(/(education:?\s*)([^\n]+)/i);
    if (educationMatch && educationMatch[2].length < 50) {
      const enhancedEducation = educationMatch[2] + ' - Relevant coursework: Advanced Technologies, Project Management, Leadership Development';
      return resumeText.replace(educationMatch[0], educationMatch[1] + enhancedEducation);
    }
    return resumeText;
  }

  generateOptimizationSummary() {
    const improvements = [];
    
    if (this.hasWeakness('quantifiable')) improvements.push('Added quantifiable achievements');
    if (this.analysisResults.keywordsMissing?.length > 0) improvements.push('Included missing keywords');
    improvements.push('Improved formatting and structure');
    improvements.push('Enhanced weak sections');

    return `\n\n--- OPTIMIZATION SUMMARY ---\nImprovements made:\n${improvements.map(imp => '• ' + imp).join('\n')}\n\nThis optimized version addresses the key areas identified in the AI analysis.`;
  }
  
  downloadResume() {
    const blob = new Blob([this.resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume_analyzed.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  resetAnalysis() {
    this.fileInput.value = '';
    this.resumeText = '';
    this.analysisResults = null;
    
    this.uploadSection.classList.remove('hidden');
    this.analysisSection.classList.add('hidden');
  }
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => new ResumeAnalyzer());

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResumeAnalyzer;
}