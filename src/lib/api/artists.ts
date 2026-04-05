/**
 * API - Artists
 * Artist-related API endpoints based on actual backend response
 */

import { apiClient } from './client';
import { env } from '@/config/env';
import { resolveImageUrl } from '@/lib/assets';

// ========================
// INTERFACES (Based on actual API)
// ========================

/**
 * Basic Artist Information (from list endpoint)
 */
export interface Artist {
  id: string;
  fullName: string;
  artistCode: string;
  portraitImage: string | null;
  generation: string;
  nationality: string;
  placeOfBirth: string | null;
  currentResidence: string | null;
  artworksCount: number;
}

/**
 * Social Media Link
 */
export interface ArtistSocial {
  platform: string;
  url: string;
}

/**
 * Detailed Artist Information (from detail endpoint)
 */
export interface ArtistDetail extends Artist {
  bioSummary: string;
  bioSummaryEn: string | null;
  education: string[];
  mentors: string[];
  workshops: string[];
  period: string | null;
  specialization: string | null;
  specializationEn: string | null;
  artInfluences: string[];
  soloExhibitions: string[];
  groupExhibitions: string[];
  internationalExhibitions: string[];
  awards: string[];
  pressLinks: string[];
  booksCatalogues: string[];
  otherEvents: string[];
  interviewsVideos: string[];
  website: string | null;
  representatives: string[];
  milestones: string[];
  artistStatement: string | null;
  artistStatementEn: string | null;
  biography: string;
  biographyEn: string | null;
  description: string;
  descriptionEn: string | null;
  primaryMaterials: string[];
  techniques: string[];
  styles: string[];
  themes: string[];
  socials: ArtistSocial[];
  files: any[]; // File structure depends on backend
}

/**
 * Meta information for pagination
 */
export interface ArtistMeta {
  page: number;
  limit: number;
  total: number;
}

/**
 * Artists List API Response
 */
export interface ArtistsApiResponse {
  success: boolean;
  data: {
    data: Artist[];
    meta: ArtistMeta;
  };
  message: string;
}

/**
 * Single Artist Detail API Response
 */
export interface ArtistDetailApiResponse {
  success: boolean;
  data: ArtistDetail;
  message: string;
}

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Get full image URL for artist portrait
 * @param imagePath - Relative or absolute image path
 * @returns Full URL or null
 */
export const getArtistImageUrl = (imagePath: string | null): string | null => {
  return resolveImageUrl(imagePath, env.imageBaseUrl);
};

/**
 * Get artist display name
 * Handles null/undefined cases
 */
export const getArtistDisplayName = (artist: Artist | null | undefined): string => {
  if (!artist) return 'Unknown Artist';
  return artist.fullName || 'Unknown Artist';
};

/**
 * Get artist bio with language fallback
 */
export const getArtistBio = (artist: ArtistDetail, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && artist.bioSummaryEn) {
    return artist.bioSummaryEn;
  }
  return artist.bioSummary || artist.biography || artist.description || '';
};

/**
 * Get artist nationality with fallback
 */
export const getArtistNationality = (artist: Artist): string => {
  return artist.nationality || 'Unknown';
};

/**
 * Check if artist has social media
 */
export const hasArtistSocials = (artist: ArtistDetail): boolean => {
  return artist.socials && artist.socials.length > 0;
};

/**
 * Get social media link by platform
 */
export const getSocialLink = (artist: ArtistDetail, platform: string): string | null => {
  if (!artist.socials) return null;
  const social = artist.socials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
  return social ? social.url : null;
};

// ========================
// API METHODS
// ========================

export const artistsAPI = {
  /**
   * Get all artists with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 24)
   * @returns List of artists with pagination meta
   * 
   * @example
   * const response = await artistsAPI.getAll(1, 24);
   * console.log(response.data.data); // Array of artists
   * console.log(response.data.meta); // { page: 1, limit: 24, total: 26 }
   */
  getAll: async (page: number = 1, limit: number = 24): Promise<ArtistsApiResponse> => {
    return apiClient.get<ArtistsApiResponse>(
      `/api/public/artists?page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },

  /**
   * Get single artist by ID with full details
   * @param id - Artist UUID
   * @returns Detailed artist information
   * 
   * @example
   * const artist = await artistsAPI.getById('c63e642b-2108-41f9-8bf3-78f8cddfcc43');
   * console.log(artist.fullName); // "Alix Aymé"
   * console.log(artist.biography); // Full biography text
   */
  getById: async (id: string): Promise<ArtistDetail> => {
    const response = await apiClient.get<ArtistDetailApiResponse>(
      `/api/public/artists/${id}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
    return response.data;
  },

  /**
   * Search artists by name or keyword
   * @param query - Search keyword
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 24)
   * @returns Matching artists with pagination
   * 
   * @example
   * const results = await artistsAPI.search('Alix', 1, 24);
   * console.log(results.data.data); // Artists matching "Alix"
   */
  search: async (query: string, page: number = 1, limit: number = 24): Promise<ArtistsApiResponse> => {
    return apiClient.get<ArtistsApiResponse>(
      `/api/public/artists?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },
};

export default artistsAPI;

