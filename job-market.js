/**
 * Career Mentor - Job Market Predictions
 * This module provides job market trend analysis and predictions
 */

class JobMarketAnalyzer {
  constructor() {
    this.apiKeys = {
      indeed: '',   // Set your Indeed API key here
      linkedin: ''  // Set your LinkedIn API key here
    };
    
    this.historicalData = {
      technology: this.generateHistoricalData("technology"),
      healthcare: this.generateHistoricalData("healthcare"),
      finance: this.generateHistoricalData("finance"),
      education: this.generateHistoricalData("education"),
      manufacturing: this.generateHistoricalData("manufacturing")
    };
    
    this.predictedData = {};
    this.cachedResults = {};
    
    // Initialize predicted data
    this.initPredictions();
  }
  
  // Generate historical job market data (2019-2023)
  generateHistoricalData(industry) {
    // Base values for different industries
    const baseValues = {
      technology: { jobs: 120000, salary: 95000, growth: 0.12 },
      healthcare: { jobs: 150000, salary: 85000, growth: 0.09 },
      finance: { jobs: 110000, salary: 90000, growth: 0.07 },
      education: { jobs: 90000, salary: 65000, growth: 0.04 },
      manufacturing: { jobs: 100000, salary: 70000, growth: 0.03 }
    };
    
    // Apply industry-specific patterns
    const base = baseValues[industry] || { jobs: 100000, salary: 75000, growth: 0.05 };
    
    // Generate data for 5 years (2019-2023)
    const data = [];
    let currentJobs = base.jobs;
    let currentSalary = base.salary;
    
    for (let year = 2019; year <= 2023; year++) {
      // Add some natural variability
      const growthVariability = base.growth * (0.7 + Math.random() * 0.6);
      
      currentJobs = Math.round(currentJobs * (1 + growthVariability));
      
      // Salary increases a bit more consistently but with some variation
      const salaryGrowth = 0.03 + (base.growth / 3) + (Math.random() * 0.02);
      currentSalary = Math.round(currentSalary * (1 + salaryGrowth));
      
      // Special case for 2020 (COVID impact)
      if (year === 2020) {
        // Technology grew during COVID, others declined
        if (industry === "technology") {
          currentJobs = Math.round(currentJobs * 1.05);
          currentSalary = Math.round(currentSalary * 1.07);
        } else {
          currentJobs = Math.round(currentJobs * 0.92);
          // Salaries didn't decline as much
          currentSalary = Math.round(currentSalary * 0.99);
        }
      }
      
      data.push({
        year: year,
        jobs: currentJobs,
        salary: currentSalary,
        growth: growthVariability
      });
    }
    
    return data;
  }
  
  // Initialize predictions for future years
  initPredictions() {
    // Calculate predictions for each industry
    for (const industry in this.historicalData) {
      this.predictedData[industry] = this.predictFutureData(this.historicalData[industry]);
    }
  }
  
  // Predict future market data based on historical trends (2024-2026)
  predictFutureData(historicalData) {
    const predictions = [];
    
    // Get the last year's data as starting point
    const lastYearData = historicalData[historicalData.length - 1];
    let currentJobs = lastYearData.jobs;
    let currentSalary = lastYearData.salary;
    
    // Calculate average growth from historical data
    const jobGrowths = historicalData.slice(1).map((data, i) => data.jobs / historicalData[i].jobs - 1);
    const salaryGrowths = historicalData.slice(1).map((data, i) => data.salary / historicalData[i].salary - 1);
    
    // Calculate average growth (excluding outlier years)
    const avgJobGrowth = jobGrowths.reduce((sum, growth) => sum + growth, 0) / jobGrowths.length;
    const avgSalaryGrowth = salaryGrowths.reduce((sum, growth) => sum + growth, 0) / salaryGrowths.length;
    
    // Predict for next 3 years (2024-2026)
    for (let year = 2024; year <= 2026; year++) {
      // Apply some variability to make predictions realistic
      const jobGrowthWithVariability = avgJobGrowth * (0.9 + Math.random() * 0.4);
      const salaryGrowthWithVariability = avgSalaryGrowth * (0.95 + Math.random() * 0.2);
      
      currentJobs = Math.round(currentJobs * (1 + jobGrowthWithVariability));
      currentSalary = Math.round(currentSalary * (1 + salaryGrowthWithVariability));
      
      predictions.push({
        year: year,
        jobs: currentJobs,
        salary: currentSalary,
        growth: jobGrowthWithVariability,
        predicted: true
      });
    }
    
    return predictions;
  }
  
  // Get job listings from Indeed (simulated)
  async getJobListings(role, location) {
    // In a real app, this would use the Indeed API
    console.log(`Fetching jobs for ${role} in ${location}`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate sample job listings based on role and location
        const jobCount = 50 + Math.floor(Math.random() * 100);
        const companies = this.generateCompanyList(role);
        
        resolve({
          totalJobs: jobCount,
          companies: companies.slice(0, 10)
        });
      }, 1000);
    });
  }
  
  // Generate a list of relevant companies for a role
  generateCompanyList(role) {
    const techCompanies = ["Google", "Microsoft", "Amazon", "Apple", "Facebook", "Netflix", "Tesla", "IBM", "Oracle", "Adobe"];
    const financeCompanies = ["Goldman Sachs", "JP Morgan", "Morgan Stanley", "Bank of America", "Citigroup", "Wells Fargo", "BlackRock"];
    const healthcareCompanies = ["UnitedHealth", "Johnson & Johnson", "Pfizer", "Roche", "Novartis", "Merck", "Abbott"];
    const retailCompanies = ["Walmart", "Target", "Amazon", "Costco", "Home Depot", "CVS Health", "Walgreens"];
    
    // Select companies based on role
    let companies = [];
    if (role.toLowerCase().includes("develop") || role.toLowerCase().includes("software") || role.toLowerCase().includes("engineer")) {
      companies = [...techCompanies];
    } else if (role.toLowerCase().includes("data") || role.toLowerCase().includes("analyst")) {
      companies = [...techCompanies, ...financeCompanies].sort(() => Math.random() - 0.5);
    } else if (role.toLowerCase().includes("finance") || role.toLowerCase().includes("account")) {
      companies = [...financeCompanies, "Google", "Microsoft", "Amazon"];
    } else if (role.toLowerCase().includes("health") || role.toLowerCase().includes("medical")) {
      companies = [...healthcareCompanies];
    } else if (role.toLowerCase().includes("sales") || role.toLowerCase().includes("marketing")) {
      companies = [...retailCompanies, ...techCompanies].sort(() => Math.random() - 0.5);
    } else {
      // Mix of all companies for general roles
      companies = [...techCompanies, ...financeCompanies, ...healthcareCompanies, ...retailCompanies].sort(() => Math.random() - 0.5);
    }
    
    return companies;
  }
  
  // Get historical and predicted data for an industry
  getIndustryData(industry) {
    if (!this.historicalData[industry]) {
      return null;
    }
    
    return {
      historical: this.historicalData[industry],
      predicted: this.predictedData[industry]
    };
  }
  
  // Get all markets data for industries
  getAllMarketsData() {
    const result = {};
    
    for (const industry in this.historicalData) {
      result[industry] = {
        historical: this.historicalData[industry],
        predicted: this.predictedData[industry]
      };
    }
    
    return result;
  }
  
  // Get comprehensive market analysis for a specific industry, role, and location
  async getMarketAnalysis(industry, role, location) {
    // Create a cache key to avoid redundant calculations
    const cacheKey = `${industry}-${role}-${location}`;
    
    // Check if we have cached results
    if (this.cachedResults[cacheKey]) {
      return this.cachedResults[cacheKey];
    }
    
    // Get industry data
    const industryData = this.getIndustryData(industry) || this.getIndustryData("technology");
    
    // Get job listings (simulated API call)
    const jobListings = await this.getJobListings(role, location);
    
    // Calculate current average salary with some adjustments for location
    const locationFactor = this.getLocationSalaryFactor(location);
    const currentYear = new Date().getFullYear();
    const latestHistoricalData = industryData.historical[industryData.historical.length - 1];
    const baseSalary = latestHistoricalData.salary;
    const adjustedSalary = Math.round(baseSalary * locationFactor);
    
    // Get trending skills for the role
    const trendingSkills = this.getTrendingSkills(role, industry);
    
    // Generate geographic hotspots
    const geographicHotspots = this.getGeographicHotspots(industry);
    
    // Construct comprehensive analysis
    const analysis = {
      industry: industry,
      role: role,
      location: location,
      timestamp: new Date().toISOString(),
      
      marketOverview: {
        totalJobs: jobListings.totalJobs,
        growthRate: (industryData.predicted[0].growth * 100).toFixed(1) + "%",
        outlook: this.getOutlookDescription(industryData.predicted[0].growth),
        topEmployers: jobListings.companies
      },
      
      salaryTrends: {
        average: "$" + this.formatNumber(adjustedSalary),
        trend: "+" + (industryData.predicted[0].growth * 100).toFixed(1) + "% from last year",
        byExperience: {
          entry: "$" + this.formatNumber(Math.round(adjustedSalary * 0.7)),
          mid: "$" + this.formatNumber(adjustedSalary),
          senior: "$" + this.formatNumber(Math.round(adjustedSalary * 1.4))
        },
        chartData: {
          historical: industryData.historical.map(d => ({ 
            year: d.year, 
            salary: d.salary
          })),
          predicted: industryData.predicted.map(d => ({ 
            year: d.year, 
            salary: d.salary
          }))
        }
      },
      
      demandForecast: this.getOutlookDescription(industryData.predicted[0].growth),
      trendingSkills: trendingSkills.trending,
      emergingSkills: trendingSkills.emerging,
      geographicHotspots: geographicHotspots
    };
    
    // Cache the results
    this.cachedResults[cacheKey] = analysis;
    
    return analysis;
  }
  
  // Helper function to format numbers with commas
  formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Get location-based salary adjustment factor
  getLocationSalaryFactor(location) {
    const locationFactors = {
      "san francisco": 1.5,
      "new york": 1.4,
      "seattle": 1.3,
      "boston": 1.25,
      "austin": 1.1,
      "chicago": 1.15,
      "los angeles": 1.35,
      "remote": 1.05,
      "united states": 1.0,
      "europe": 0.85,
      "asia": 0.7
    };
    
    const normalizedLocation = location.toLowerCase();
    
    for (const key in locationFactors) {
      if (normalizedLocation.includes(key)) {
        return locationFactors[key];
      }
    }
    
    return 1.0; // Default factor
  }
  
  // Get description of job market outlook based on growth rate
  getOutlookDescription(growthRate) {
    if (growthRate >= 0.15) {
      return "Exceptional growth expected over next 3 years";
    } else if (growthRate >= 0.1) {
      return "High growth expected over next 3 years";
    } else if (growthRate >= 0.05) {
      return "Moderate growth expected over next 3 years";
    } else if (growthRate >= 0.02) {
      return "Stable outlook with slight growth expected";
    } else if (growthRate >= 0) {
      return "Stable market conditions expected";
    } else {
      return "Potential market contraction, consider upskilling";
    }
  }
  
  // Get trending and emerging skills for a role and industry
  getTrendingSkills(role, industry) {
    // Base skills that are trending across all tech roles
    const commonTechSkills = ["Cloud Computing", "DevOps", "Data Analysis", "AI/ML"];
    
    // Role-specific trending skills
    const roleSkills = {
      "software developer": ["React", "TypeScript", "Node.js", "AWS", "Docker", "Kubernetes"],
      "frontend developer": ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Web Performance"],
      "backend developer": ["Node.js", "Python", "Go", "Microservices", "Kubernetes", "Serverless"],
      "full stack developer": ["React", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS"],
      "mobile developer": ["Flutter", "React Native", "Swift", "Kotlin", "Mobile Security", "Offline-first"],
      "data scientist": ["Python", "TensorFlow", "PyTorch", "Data Visualization", "NLP", "MLOps"],
      "data analyst": ["SQL", "Python", "Power BI", "Tableau", "Statistics", "Excel"],
      "product manager": ["Agile", "User Research", "Data Analysis", "Product Strategy", "A/B Testing"],
      "ux designer": ["Figma", "User Research", "Design Systems", "Accessibility", "Prototyping"],
      "project manager": ["Agile", "Scrum", "JIRA", "Risk Management", "Stakeholder Management"]
    };
    
    // Emerging skills across all industries
    const commonEmergingSkills = ["Web3", "AR/VR", "Quantum Computing"];
    
    // Role-specific emerging skills
    const emergingRoleSkills = {
      "software developer": ["Rust", "WebAssembly", "Edge Computing", "Zero Trust Security"],
      "frontend developer": ["WebGPU", "Dynamic Island", "3D Web Interfaces", "Web NFC"],
      "backend developer": ["WebSockets", "GraphQL Federation", "QUIC Protocol", "Web3"],
      "full stack developer": ["Svelte", "Rust Full-stack", "Edge Functions", "WebAssembly"],
      "mobile developer": ["Super App Architecture", "On-device ML", "Foldable UX", "AR Kit/Core"],
      "data scientist": ["Quantum ML", "AI Ethics", "Explainable AI", "Federated Learning"],
      "data analyst": ["Augmented Analytics", "Data Storytelling", "AutoML", "Real-time Analytics"],
      "product manager": ["AI Product Management", "Growth Metrics", "Revenue Operations", "Voice UX"],
      "ux designer": ["Spatial Design", "Voice UI", "Mixed Reality", "Emotional Design"],
      "project manager": ["Distributed Teams", "Project Economics", "Sustainability Metrics"]
    };
    
    // Match role to skills
    let trendingSkills = commonTechSkills;
    let emergingSkills = commonEmergingSkills;
    
    // Convert role to lowercase for matching
    const normalizedRole = role.toLowerCase();
    
    // Find matching role skills
    for (const key in roleSkills) {
      if (normalizedRole.includes(key)) {
        trendingSkills = [...roleSkills[key], ...commonTechSkills].slice(0, 8);
        emergingSkills = [...emergingRoleSkills[key], ...commonEmergingSkills].slice(0, 5);
        break;
      }
    }
    
    // If no specific match found, use base skills
    if (trendingSkills === commonTechSkills) {
      // Add industry-specific skills
      if (industry === 'finance') {
        trendingSkills = [...commonTechSkills, "FinTech", "Blockchain", "Compliance", "Risk Analysis"];
      } else if (industry === 'healthcare') {
        trendingSkills = [...commonTechSkills, "HealthTech", "HIPAA Compliance", "Telehealth", "EMR Systems"];
      } else if (industry === 'education') {
        trendingSkills = [...commonTechSkills, "EdTech", "LMS", "Online Assessment", "Virtual Classrooms"];
      }
    }
    
    return {
      trending: trendingSkills,
      emerging: emergingSkills
    };
  }
  
  // Get geographic hotspots for an industry
  getGeographicHotspots(industry) {
    const commonHotspots = ["San Francisco", "New York", "Seattle", "Remote"];
    
    const industryHotspots = {
      technology: ["San Francisco", "Seattle", "Austin", "Boston", "Remote"],
      finance: ["New York", "Chicago", "London", "Hong Kong", "Singapore"],
      healthcare: ["Boston", "San Francisco", "San Diego", "Durham", "Minneapolis"],
      education: ["Boston", "Austin", "New York", "Remote", "Chicago"],
      manufacturing: ["Detroit", "Pittsburgh", "Houston", "Nashville", "Indianapolis"]
    };
    
    return industryHotspots[industry] || commonHotspots;
  }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JobMarketAnalyzer;
} 