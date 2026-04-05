/**
 * API - Featured Artworks
 * Featured artworks for homepage display
 */

import { apiClient } from './client';
import { getImageUrl } from './artworks';

// Featured artwork interface for public API
export interface FeaturedArtwork {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string | null;
  slugEn: string | null;
  image: string | null;
  artist: string | null;
  artistName: string | null;
  dateCreated: string | null;
  displayOrder: number;
  bio: string | null;
  nationality: string | null;
  birthYear: number | null;
  deathYear: number | null;
}

// API response structure
export interface FeaturedArtworksApiResponse {
  success: boolean;
  data: FeaturedArtwork[];
  message: string;
}

// Transform featured artwork to include full image URL
export const transformFeaturedArtwork = (artwork: FeaturedArtwork): FeaturedArtwork => ({
  ...artwork,
  image: getImageUrl(artwork.image),
});

export const featuredArtworksAPI = {
  /**
   * Get featured artworks for homepage
   * @param locale - Language locale ('vi' | 'en')
   * @param limit - Maximum number of items (default: 8)
   */
  getAll: async (locale: 'vi' | 'en' = 'vi', limit: number = 8): Promise<FeaturedArtwork[]> => {
    const response = await apiClient.get<FeaturedArtworksApiResponse>(
      `/api/public/featured-artworks?locale=${locale}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );

    // Transform images to full URLs
    return response.data.map(transformFeaturedArtwork);
  },
};

export default featuredArtworksAPI;

