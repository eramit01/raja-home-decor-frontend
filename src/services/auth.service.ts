import { api } from './api';

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

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
