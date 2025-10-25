import axios from 'axios';
import type { ApiError } from '@/types/api.types.ts';

// Service-specific base URLs
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:9001';
const PROMPT_SERVICE_URL = import.meta.env.VITE_PROMPT_SERVICE_URL || 'http://localhost:9002';
const TEST_SERVICE_URL = import.meta.env.VITE_TEST_SERVICE_URL || 'http://localhost:9003';
const MARKETPLACE_SERVICE_URL = import.meta.env.VITE_MARKETPLACE_SERVICE_URL || 'http://localhost:9004';

// Legacy API_BASE_URL for backward compatibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || USER_SERVICE_URL;

// Create axios instance (default to user service)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout to prevent indefinite hangs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service-specific clients
export const userServiceClient = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const promptServiceClient = axios.create({
  baseURL: PROMPT_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const testServiceClient = axios.create({
  baseURL: TEST_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const marketplaceServiceClient = axios.create({
  baseURL: MARKETPLACE_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor function - Add auth token and user ID
const requestInterceptor = (config: any) => {
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add user ID and username headers if available
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id) {
        config.headers['X-User-Id'] = user.id;
      }
      if (user.username) {
        config.headers['X-Username'] = user.username;
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }

  return config;
};

// Response interceptor function - Handle errors
const responseInterceptor = (response: any) => response;

const errorInterceptor = (error: any) => {
  // Handle 401 Unauthorized - clear auth and redirect to login
  if (error.response?.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Transform error to ApiError format
  const apiError: ApiError = {
    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
    status: error.response?.status || 500,
    errors: error.response?.data?.errors,
  };

  return Promise.reject(apiError);
};

// Apply interceptors to all clients
[apiClient, userServiceClient, promptServiceClient, testServiceClient, marketplaceServiceClient].forEach(client => {
  client.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
  client.interceptors.response.use(responseInterceptor, errorInterceptor);
});

