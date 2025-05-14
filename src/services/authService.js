/**
 * Authentication service using axios instead of fetch
 * Provides methods for any custom authentication operations
 * that might be needed outside of ApperSDK
 */

import axios from 'axios';

// Create axios instance with default configuration
const authAxios = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
authAxios.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear local auth data
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

/**
 * Custom authentication methods that use axios instead of fetch
 * for any requests not handled by ApperSDK
 */

// Verify token validity
export const verifyToken = async (token) => {
  try {
    const response = await authAxios.post('/api/auth/verify', { token });
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};

// Refresh authentication token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await authAxios.post('/api/auth/refresh', { refreshToken });
    
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// Get authentication status
export const getAuthStatus = async () => {
  try {
    const response = await authAxios.get('/api/auth/status');
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};