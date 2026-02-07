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
