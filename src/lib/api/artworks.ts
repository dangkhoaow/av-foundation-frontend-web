/**
 * API - Artworks
 * Artwork-related API endpoints
 */

import { apiClient } from './client';
import { env } from '@/config/env';
import { resolveImageUrl } from '@/lib/assets';

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
  return resolveImageUrl(imagePath, env.imageBaseUrl);
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
    return apiClient.get<ArtworkApiResponse>(`/api/public/artworks?${params.toString()}`, undefined, {
      maxAttempts: 1,
      timeoutMs: 20_000,
    });
  },

  /**
   * Get single artwork by ID
   */
  getById: async (id: string): Promise<Artwork> => {
    const response = await apiClient.get<{ success: boolean; data: Artwork; message: string }>(
      `/api/public/artworks/${id}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
    return response.data;
  },

  /**
   * Search artworks
   */
  search: async (query: string, page: number = 1, limit: number = 22): Promise<ArtworkApiResponse> => {
    return apiClient.get<ArtworkApiResponse>(
      `/api/public/artworks/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },
};

export default artworksAPI;

