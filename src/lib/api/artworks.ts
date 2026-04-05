/**
 * API - Artworks
 * Artwork-related API endpoints
 */

import { apiClient } from './client';
import { env } from '@/config/env';

// Artist interface for artwork (simplified version used in artwork response)
export interface ArtworkArtist {
  id: string;
  fullName: string;
  artistCode: string;
  image: string | null;
  bioSummary: string;
  bioSummaryEn: string | null;
}

// Artwork interface based on backend response
export interface Artwork {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string | null;
  slugEn: string | null;
  inventoryNumber: string;
  description: string | null;
  descriptionEn: string | null;
  image: string | null;
  imageWidth: number | null;   // Image dimensions for masonry layout
  imageHeight: number | null;  // Image dimensions for masonry layout
  dateCreated: string;
  belongsToAVCollection: boolean;
  avArtCollectionId: string | null;
  artist: ArtworkArtist;
  files?: any[]; // Using any[] temporarily, or define PublicFileAttachment type here if available
}

// Meta information for pagination
export interface ArtworkMeta {
  page: number;
  limit: number;
  total: number;
}

// Backend API response structure
export interface ArtworkApiResponse {
  success: boolean;
  data: {
    data: Artwork[];
    meta: ArtworkMeta;
  };
  message: string;
}

// Helper function to get full image URL
export const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Use URL API to properly handle slashes and construct full URL
  // This prevents double slashes like: https://domain.com//api/file/...
  try {
    return new URL(imagePath, env.imageBaseUrl).href;
  } catch (error) {
    console.error('Invalid image URL:', { imagePath, baseUrl: env.imageBaseUrl }, error);
    return null;
  }
};

export const artworksAPI = {
  /**
   * Get all artworks with pagination and optional sorting
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 22)
   * @param options - Optional sorting options
   */
  getAll: async (
    page: number = 1,
    limit: number = 22,
    options?: { sortBy?: 'title' | 'dateCreated' | 'createdAt'; sortOrder?: 'asc' | 'desc'; artistId?: string }
  ): Promise<ArtworkApiResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.artistId) params.append('artistId', options.artistId);
    return apiClient.get<ArtworkApiResponse>(`/api/public/artworks?${params.toString()}`);
  },

  /**
   * Get single artwork by ID
   */
  getById: async (id: string): Promise<Artwork> => {
    const response = await apiClient.get<{ success: boolean; data: Artwork; message: string }>(
      `/api/public/artworks/${id}`
    );
    return response.data;
  },

  /**
   * Search artworks
   */
  search: async (query: string, page: number = 1, limit: number = 22): Promise<ArtworkApiResponse> => {
    return apiClient.get<ArtworkApiResponse>(
      `/api/public/artworks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },
};

export default artworksAPI;

