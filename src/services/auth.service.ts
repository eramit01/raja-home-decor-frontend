import { api } from './api';
import { store } from '../store';

export interface SendOTPRequest {
  email?: string;
  phone?: string;
}

export interface VerifyOTPRequest {
  email?: string;
  phone?: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'customer' | 'admin';
      phone?: string;
    };
    accessToken: string;
    csrfToken?: string; // CSRF token for state-changing requests
  };
}

export const authService = {
  checkUser: async (phone: string) => {
    const response = await api.post('/auth/check-user', { phone });
    return response.data;
  },

  register: async (data: { phone: string; password?: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { phone: string; password?: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Deprecated but kept for type safety if needed temporarily
  sendOTP: async (data: SendOTPRequest) => {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  import { store } from '../store';

  logout: async () => {
    const { token } = store.getState().auth;
    // If no token, we are already logged out on the client side.
    // We skip the backend call to avoid 401/400 errors.
    if (!token) {
      return { success: true };
    }
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      // If logout fails (e.g. 401), we just ignore it as we are clearing client state anyway
      return { success: true };
    }
  },
};
