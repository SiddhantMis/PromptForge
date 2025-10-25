import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api.types.ts';
import type { User } from '@/types/user.types.ts';

// In-memory user storage for mock API
const mockUsers: User[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@promptforge.com',
    firstName: 'Demo',
    lastName: 'User',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateMockToken = (userId: string): string => {
  return `mock.jwt.token.${userId}.${Date.now()}`;
};

export const mockAuthApi = {
  /**
   * Mock register
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    await delay(500); // Simulate network delay

    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.username === data.username || u.email === data.email
    );

    if (existingUser) {
      throw {
        message: 'User already exists',
        status: 400,
        errors: {
          username: existingUser.username === data.username ? ['Username already taken'] : [],
          email: existingUser.email === data.email ? ['Email already registered'] : [],
        },
      };
    }

    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      accessToken: generateMockToken(newUser.id),
      refreshToken: generateMockToken(newUser.id),
    };
  },

  /**
   * Mock login
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    await delay(500); // Simulate network delay

    // Find user by email
    const user = mockUsers.find(u => u.email === credentials.email);

    if (!user) {
      throw {
        message: 'Invalid credentials',
        status: 401,
      };
    }

    // In mock API, accept any password for simplicity
    // In real API, this would verify the password hash

    return {
      user,
      accessToken: generateMockToken(user.id),
      refreshToken: generateMockToken(user.id),
    };
  },

  /**
   * Mock get current user
   */
  getCurrentUser: async (): Promise<User> => {
    await delay(300);

    // In mock, return the first user
    // In real API, this would decode the JWT token
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }

    throw {
      message: 'Not authenticated',
      status: 401,
    };
  },

  /**
   * Mock refresh token
   */
  refreshToken: async (_refreshToken: string): Promise<AuthResponse> => {
    await delay(300);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw {
        message: 'Invalid refresh token',
        status: 401,
      };
    }

    const user = JSON.parse(userStr);

    return {
      user,
      accessToken: generateMockToken(user.id),
      refreshToken: generateMockToken(user.id),
    };
  },
};

