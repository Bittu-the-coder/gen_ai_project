// Auth API Service
import apiClient from './client';
import type { User } from './types';

export const authApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put('/profile', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Health check for profile service
  checkProfileHealth: async (): Promise<{
    status: string;
    firestore: string;
  }> => {
    try {
      const response = await apiClient.get('/profile/health');
      return response.data;
    } catch (error) {
      console.error('Profile health check failed:', error);
      throw error;
    }
  },

  // Set auth token
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // Clear auth token
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

export default authApi;
