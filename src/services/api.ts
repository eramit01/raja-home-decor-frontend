import axios from 'axios';
import { store } from '../store';
import { setCsrfToken, logout as logoutAction } from '../store/slices/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    // Add CSRF token for state-changing requests
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (!safeMethods.includes(config.method?.toUpperCase() || '')) {
      const state = store.getState();
      const csrfToken = state.auth.csrfToken;
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await api.post('/auth/refresh-token');

        // Token refreshed successfully in cookie, retry original request
        return api.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logoutAction());
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fetch CSRF token after login
export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const response = await api.get('/auth/csrf-token');
    if (response.data.success && response.data.data.csrfToken) {
      store.dispatch(setCsrfToken(response.data.data.csrfToken));
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};
