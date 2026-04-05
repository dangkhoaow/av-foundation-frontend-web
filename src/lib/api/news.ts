/**
 * API - News
 * News-related API endpoints
 */

import { apiClient } from './client';
import { env } from '@/config/env';
import { resolveImageUrl } from '@/lib/assets';

// ========================
// INTERFACES
// ========================

/**
 * News Article from API
 */
export interface NewsArticle {
  id: string;
  title: string;
  titleEn: string | null;
  content: string;
  contentEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  featuredImage: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: string | null;
  authorEn: string | null;
  tags: string[];
  category: string | null;
  categoryEn: string | null;
  slug: string;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
}

/**
 * Meta information for pagination
 */
export interface NewsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

/**
 * News List API Response
 */
export interface NewsApiResponse {
  success: boolean;
  data: {
    data: NewsArticle[];
    meta: NewsMeta;
  };
  message: string;
}

/**
 * Single News Detail API Response
 */
export interface NewsDetailApiResponse {
  success: boolean;
  data: NewsArticle;
  message: string;
}

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Get full image URL for news featured image
 * @param imagePath - Relative or absolute image path
 * @returns Full URL or null
 */
export const getNewsImageUrl = (imagePath: string | null): string | null => {
  return resolveImageUrl(imagePath, env.imageBaseUrl);
};

/**
 * Format news date to Vietnamese format
 * @param dateString - ISO date string
 * @returns Formatted date (DD/MM/YYYY)
 */
export const formatNewsDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Invalid date string:', dateString, error);
    return dateString;
  }
};

/**
 * Get news title with language fallback
 * @param news - News article
 * @param language - Preferred language ('vi' or 'en')
 * @returns Title in preferred language or fallback
 */
export const getNewsTitle = (news: NewsArticle, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && news.titleEn) {
    return news.titleEn;
  }
  return news.title || 'Untitled';
};

/**
 * Get news content with language fallback
 * @param news - News article
 * @param language - Preferred language ('vi' or 'en')
 * @returns Content in preferred language or fallback
 */
export const getNewsContent = (news: NewsArticle, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && news.contentEn) {
    return news.contentEn;
  }
  return news.content || '';
};

/**
 * Get news excerpt with language fallback
 * @param news - News article
 * @param language - Preferred language ('vi' or 'en')
 * @returns Excerpt in preferred language or fallback
 */
export const getNewsExcerpt = (news: NewsArticle, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && news.excerptEn) {
    return news.excerptEn;
  }
  return news.excerpt || '';
};

/**
 * Get news author with language fallback
 * @param news - News article
 * @param language - Preferred language ('vi' or 'en')
 * @returns Author name or 'Unknown'
 */
export const getNewsAuthor = (news: NewsArticle, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && news.authorEn) {
    return news.authorEn;
  }
  return news.author || 'Unknown';
};

/**
 * Get news category with language fallback
 * @param news - News article
 * @param language - Preferred language ('vi' or 'en')
 * @returns Category or null
 */
export const getNewsCategory = (news: NewsArticle, language: 'vi' | 'en' = 'vi'): string | null => {
  if (language === 'en' && news.categoryEn) {
    return news.categoryEn;
  }
  return news.category;
};

// ========================
// API METHODS
// ========================

export const newsAPI = {
  /**
   * Get all news articles with pagination and sorting
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @param sortBy - Sort field (default: 'date')
   * @param sortOrder - Sort order: 'asc' or 'desc' (default: 'desc')
   * @returns List of news articles with pagination meta
   * 
   * @example
   * const response = await newsAPI.getAll(1, 12, 'date', 'desc');
   * console.log(response.data.data); // Array of news articles
   * console.log(response.data.meta); // { page: 1, limit: 12, total: 50 }
   */
  getAll: async (
    page: number = 1,
    limit: number = 12,
    sortBy: string = 'date',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<NewsApiResponse> => {
    return apiClient.get<NewsApiResponse>(
      `/api/public/news?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },

  /**
   * Get single news article by ID
   * @param id - News UUID or slug
   * @returns Detailed news article information
   * 
   * @example
   * const news = await newsAPI.getById('123e4567-e89b-12d3-a456-426614174000');
   * console.log(news.title); // "Breaking News Title"
   */
  getById: async (id: string): Promise<NewsArticle> => {
    const response = await apiClient.get<NewsDetailApiResponse>(
      `/api/public/news/${id}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
    return response.data;
  },

  /**
   * Search news articles by keyword
   * @param query - Search keyword
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns Matching news articles with pagination
   * 
   * @example
   * const results = await newsAPI.search('exhibition', 1, 12);
   * console.log(results.data.data); // News matching "exhibition"
   */
  search: async (
    query: string,
    page: number = 1,
    limit: number = 12
  ): Promise<NewsApiResponse> => {
    return apiClient.get<NewsApiResponse>(
      `/api/public/news?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },

  /**
   * Get news articles by category
   * @param category - Category name or slug
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns News articles in specified category
   * 
   * @example
   * const results = await newsAPI.getByCategory('exhibitions', 1, 12);
   */
  getByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 12
  ): Promise<NewsApiResponse> => {
    return apiClient.get<NewsApiResponse>(
      `/api/public/news?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },

  /**
   * Get news articles by tag
   * @param tag - Tag name
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns News articles with specified tag
   * 
   * @example
   * const results = await newsAPI.getByTag('contemporary-art', 1, 12);
   */
  getByTag: async (
    tag: string,
    page: number = 1,
    limit: number = 12
  ): Promise<NewsApiResponse> => {
    return apiClient.get<NewsApiResponse>(
      `/api/public/news?tag=${encodeURIComponent(tag)}&page=${page}&limit=${limit}`,
      undefined,
      { maxAttempts: 1, timeoutMs: 20_000 }
    );
  },
};

export default newsAPI;

