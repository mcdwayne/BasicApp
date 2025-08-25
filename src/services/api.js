import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Address-related API calls
export const addressAPI = {
  // Search for news by address
  search: async (address, userId = 1) => {
    try {
      const response = await api.post('/addresses/search', { address, userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to search address');
    }
  },

  // Get all addresses for a user
  getAll: async (userId = 1) => {
    try {
      const response = await api.get(`/addresses?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch addresses');
    }
  },

  // Get specific address
  getById: async (id) => {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch address');
    }
  },

  // Get search statistics
  getStats: async (userId = 1) => {
    try {
      const response = await api.get(`/addresses/stats?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  },

  // Get search history
  getHistory: async (userId = 1, limit = 50) => {
    try {
      const response = await api.get(`/addresses/history?userId=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch search history');
    }
  },

  // Delete address
  delete: async (id) => {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete address');
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await axios.get(API_BASE_URL.replace('/api', '/health'));
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};

export default api;
