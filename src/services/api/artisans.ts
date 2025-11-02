// Artisans API Service
import apiClient from './client';
import type { ArtisanProfile, PaginatedResponse } from './types';

export const artisansApi = {
  // Get all artisans with pagination
  getArtisans: async (params?: {
    page?: number;
    limit?: number;
    craft?: string;
    location?: string;
  }): Promise<PaginatedResponse<ArtisanProfile>> => {
    const response = await apiClient.get('/artisans', { params });
    return response.data;
  },

  // Get single artisan by ID
  getArtisan: async (id: string): Promise<ArtisanProfile> => {
    const response = await apiClient.get(`/artisans/${id}`);
    return response.data;
  },

  // Get artisan profile (authenticated)
  getArtisanProfile: async (): Promise<ArtisanProfile> => {
    const response = await apiClient.get('/artisan/profile');
    return response.data;
  },

  // Update artisan profile
  updateArtisanProfile: async (
    data: Partial<ArtisanProfile>
  ): Promise<ArtisanProfile> => {
    const response = await apiClient.put('/artisan/profile', data);
    return response.data;
  },

  // Upload artisan avatar
  uploadArtisanAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/artisan/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },
};

export default artisansApi;
