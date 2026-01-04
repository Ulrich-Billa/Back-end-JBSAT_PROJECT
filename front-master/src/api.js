/**
 * JBSAT API Service Layer
 * Handles all HTTP requests to the backend with JWT authentication
 */

import axios from 'axios';

// API base URL from environment variable
// Change this line to point to your Django server
const API_URL = 'http://127.0.0.1:8000';
// const API_URL = process.env.REACT_APP_API_URL || '';


// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ==================== Authentication API ====================

/**
 * Login user and get JWT tokens
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Response with access and refresh tokens
 */
export const login = async (email, password) => {
  const response = await api.post('/api/token/', { email, password });
  return response.data;
};

/**
 * Register a new user and get JWT tokens
 * @param {Object} userData - User data (full_name, email, password, role)
 * @returns {Promise} - Response with access, refresh tokens and message
 */
export const register = async (userData) => {
  const response = await api.post('/api/register/', userData);
  return response.data;
};



/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} - Response with new access token
 */
export const refreshToken = async (refreshToken) => {
  const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
  return response.data;
};

/**
 * Logout user - clear tokens from storage
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userName');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get user role from storage
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// ==================== Jobs API ====================

/**
 * Get all jobs with optional filters
 * @param {Object} params - Query parameters (title, type, location)
 */
export const getJobs = async (params = {}) => {
  const response = await api.get('/api/jobs/', { params });
  return response.data;
};

/**
 * Get single job by ID
 * @param {number} jobId - Job ID
 */
export const getJob = async (jobId) => {
  const response = await api.get(`/api/jobs/${jobId}/`);
  return response.data;
};

/**
 * Create new job posting (Employer only)
 * @param {Object} jobData - Job data
 */
export const createJob = async (jobData) => {
  const response = await api.post('/api/jobs/', jobData);
  return response.data;
};

/**
 * Update job posting (Employer only - owner)
 * @param {number} jobId - Job ID
 * @param {Object} jobData - Updated job data
 */
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/api/jobs/${jobId}/`, jobData);
  return response.data;
};

/**
 * Delete job posting (Employer only - owner)
 * @param {number} jobId - Job ID
 */
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/api/jobs/${jobId}/`);
  return response.data;
};

// ==================== Applications API ====================

/**
 * Apply to a job (Seeker only)
 * @param {number} jobId - Job ID
 * @param {string} resumeUrl - URL to resume file (Cloudinary URL)
 */
export const applyToJob = async (jobId, resumeUrl) => {
  const response = await api.post(`/api/jobs/${jobId}/apply/`, { resume_url: resumeUrl });
  return response.data;
};

/**
 * Get applications for employer's jobs
 * @param {number} jobId - Optional job ID filter
 */
export const getEmployerApplications = async (jobId = null) => {
  const params = jobId ? { job_id: jobId } : {};
  const response = await api.get('/api/employer/applications/', { params });
  return response.data;
};

/**
 * Get seeker's applications
 * @param {number} jobId - Optional job ID filter
 */
export const getSeekerApplications = async (jobId = null) => {
  const params = jobId ? { job_id: jobId } : {};
  const response = await api.get('/api/seeker/applications/', { params });
  return response.data;
};

/**
 * Update application status (Employer only)
 * @param {number} applicationId - Application ID
 * @param {string} status - New status (NEW, REVIEWING, ACCEPTED, REJECTED)
 */
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/api/applications/${applicationId}/status/`, { status });
  return response.data;
};

// ==================== File Upload ====================

/**
 * Upload file to Cloudinary (client-side)
 * Note: This uses Cloudinary's unsigned upload widget or API
 * @param {File} file - File to upload
 * @param {string} uploadPreset - Cloudinary upload preset
 */
export const uploadFile = async (file, uploadPreset = 'jbsat_applications') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', "my_name_is_preset");

  // Upload to Cloudinary directly from client
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'doqetnv1l';
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err.response?.data);
    throw err;
  }
};

export default api;

