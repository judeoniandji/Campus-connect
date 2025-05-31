// API functions for Senegal jobs

// Fonction pour récupérer un job spécifique (utilisée dans JobDetails.jsx)
export const getSenegalJob = async (id) => {
  // This is a placeholder function to fix build errors
  // It can be implemented properly later if needed
  console.log('getSenegalJob called with id:', id);
  return {
    id,
    title: 'Placeholder Job',
    company: 'Placeholder Company',
    location: 'Senegal',
    description: 'This is a placeholder job description.',
    requirements: ['Placeholder requirement'],
    salary: 'Competitive',
    date: new Date().toISOString(),
    industry: 'Technology',
    type: 'Full-time',
    skills: ['JavaScript', 'React', 'Node.js']
  };
};

// Fonction pour récupérer plusieurs jobs (utilisée dans JobMatchingComponent.jsx)
export const getSenegalJobs = async (filters) => {
  // This is a placeholder function to fix build errors
  // It can be implemented properly later if needed
  console.log('getSenegalJobs called with filters:', filters);
  return {
    jobs: [
      {
        id: 1,
        title: 'Placeholder Job 1',
        company: 'Placeholder Company',
        location: 'Senegal',
        description: 'This is a placeholder job description.',
        requirements: ['Placeholder requirement'],
        salary: 'Competitive',
        date: new Date().toISOString(),
        industry: 'Technology',
        type: 'Full-time',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      {
        id: 2,
        title: 'Placeholder Job 2',
        company: 'Another Company',
        location: 'Senegal',
        description: 'This is another placeholder job description.',
        requirements: ['Placeholder requirement'],
        salary: 'Competitive',
        date: new Date().toISOString(),
        industry: 'Finance',
        type: 'Part-time',
        skills: ['Python', 'Data Analysis']
      }
    ],
    total: 2
  };
};

// Fonction pour récupérer les industries (utilisée dans JobMatchingComponent.jsx)
export const getSenegalIndustries = async () => {
  // This is a placeholder function to fix build errors
  console.log('getSenegalIndustries called');
  return {
    industries: [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Finance' },
      { id: 3, name: 'Healthcare' },
      { id: 4, name: 'Education' },
      { id: 5, name: 'Manufacturing' }
    ]
  };
};

// Anticipation d'autres fonctions potentiellement nécessaires
export const getSenegalJobTypes = async () => {
  return {
    types: [
      { id: 1, name: 'Full-time' },
      { id: 2, name: 'Part-time' },
      { id: 3, name: 'Contract' },
      { id: 4, name: 'Internship' },
      { id: 5, name: 'Remote' }
    ]
  };
};

export const getSenegalLocations = async () => {
  return {
    locations: [
      { id: 1, name: 'Dakar' },
      { id: 2, name: 'Thiès' },
      { id: 3, name: 'Saint-Louis' },
      { id: 4, name: 'Ziguinchor' },
      { id: 5, name: 'Kaolack' }
    ]
  };
};

export const getSenegalSkills = async () => {
  return {
    skills: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Python' },
      { id: 3, name: 'React' },
      { id: 4, name: 'Node.js' },
      { id: 5, name: 'Data Analysis' },
      { id: 6, name: 'Project Management' },
      { id: 7, name: 'Communication' },
      { id: 8, name: 'Leadership' }
    ]
  };
};

export const applySenegalJob = async (jobId, applicationData) => {
  console.log('applySenegalJob called with:', jobId, applicationData);
  return {
    success: true,
    message: 'Application submitted successfully',
    applicationId: Math.floor(Math.random() * 1000)
  };
};

export const saveSenegalJob = async (jobId) => {
  console.log('saveSenegalJob called with:', jobId);
  return {
    success: true,
    message: 'Job saved successfully'
  };
};

export const unsaveSenegalJob = async (jobId) => {
  console.log('unsaveSenegalJob called with:', jobId);
  return {
    success: true,
    message: 'Job removed from saved jobs'
  };
};
