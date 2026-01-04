// Mock data for the Job Board application

export const mockJobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Cameroon',
    salary: '$80,000 - $120,000',
    description: 'We are looking for a skilled software engineer to join our team. Experience with React and Node.js is preferred.',
    employerId: 1,
    postedDate: '2024-01-15',
    applicationDeadline: '2024-02-15'
  },
  {
    id: 2,
    title: 'Data Analyst',
    company: 'Data Insights',
    location: 'San Francisco',
    salary: '$70,000 - $90,000',
    description: 'Join our data team to analyze and visualize complex datasets. SQL and Python experience required.',
    employerId: 1,
    postedDate: '2024-01-10'
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'Creative Solutions',
    location: 'Los Angeles',
    salary: '$75,000 - $95,000',
    description: 'Create beautiful and intuitive user experiences. Portfolio required.',
    employerId: 2,
    postedDate: '2024-01-12'
  }
];

export const mockApplications = [
  {
    id: 1,
    jobId: 1,
    applicantId: 1,
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    status: 'New',
    appliedDate: '2024-01-16'
  },
  {
    id: 2,
    jobId: 1,
    applicantId: 2,
    applicantName: 'Jane Smith',
    applicantEmail: 'jane@example.com',
    status: 'Reviewing',
    appliedDate: '2024-01-17'
  },
  {
    id: 3,
    jobId: 2,
    applicantId: 1,
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    status: 'Rejected',
    appliedDate: '2024-01-18'
  }
];

// Utility functions
export const getJobsByEmployer = (employerId) => {
  return mockJobs.filter(job => job.employerId === employerId);
};

export const getApplicationsByJob = (jobId) => {
  return mockApplications.filter(app => app.jobId === jobId);
};

export const getApplicationsByApplicant = (applicantId) => {
  return mockApplications.filter(app => app.applicantId === applicantId);
};

export const addJob = (jobData) => {
  const newJob = {
    ...jobData,
    id: mockJobs.length + 1,
    postedDate: new Date().toISOString().split('T')[0]
  };
  mockJobs.push(newJob);
  return newJob;
};

export const addApplication = (applicationData) => {
  const newApplication = {
    ...applicationData,
    id: mockApplications.length + 1,
    status: 'New',
    appliedDate: new Date().toISOString().split('T')[0]
  };
  mockApplications.push(newApplication);
  return newApplication;
};

export const updateApplicationStatus = (applicationId, newStatus) => {
  const application = mockApplications.find(app => app.id === applicationId);
  if (application) {
    application.status = newStatus;
  }
};
