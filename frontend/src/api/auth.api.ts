import { userServiceClient } from './client.ts';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api.types.ts';
import type { User } from '@/types/user.types.ts';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await userServiceClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await userServiceClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await userServiceClient.get<User>('/users/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await userServiceClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

