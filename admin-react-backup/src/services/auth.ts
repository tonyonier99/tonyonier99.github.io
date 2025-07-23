import { apiRequest } from './api';
import { AuthStatus, User } from '@/types';

export const authService = {
  // Get GitHub OAuth URL
  getGitHubAuthUrl: async () => {
    return apiRequest<{ authUrl: string }>('GET', '/auth/github');
  },

  // Get current user info
  getCurrentUser: async () => {
    return apiRequest<{ user: User; isOwner: boolean }>('GET', '/auth/me');
  },

  // Check authentication status
  checkAuthStatus: async () => {
    return apiRequest<AuthStatus>('GET', '/auth/status');
  },

  // Logout
  logout: async () => {
    return apiRequest('POST', '/auth/logout');
  },
};