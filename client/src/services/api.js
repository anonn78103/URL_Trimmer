import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// URL API calls
export const urlAPI = {
  // Get user's URLs
  getUserUrls: () => api.get('/api/urls'),
  
  // Get analytics summary
  getAnalytics: () => api.get('/api/urls/analytics/summary'),
  
  // Create new URL
  createUrl: (data) => api.post('/api/urls', data),
  
  // Update URL
  updateUrl: (id, data) => api.put(`/api/urls/${id}`, data),
  
  // Delete URL
  deleteUrl: (id) => api.delete(`/api/urls/${id}`),
};

// Auth API calls
export const authAPI = {
  // Register user
  register: (userData) => api.post('/api/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/api/auth/profile'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/api/auth/profile', profileData),
};

export default api;
