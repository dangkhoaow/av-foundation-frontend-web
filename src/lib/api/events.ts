/**
 * API - Events
 * Event-related API endpoints
 */

import { apiClient } from './client';
import { env } from '@/config/env';
import { resolveImageUrl } from '@/lib/assets';

// ========================
// INTERFACES
// ========================

/**
 * Event from API
 */
export interface Event {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  featuredImage: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  locationEn: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string | null;
  categoryEn: string | null;
  slug: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
}

/**
 * Meta information for pagination
 */
export interface EventMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

/**
 * Events List API Response
 */
export interface EventsApiResponse {
  success: boolean;
  data: {
    data: Event[];
    meta: EventMeta;
  };
  message: string;
}

/**
 * Single Event Detail API Response
 */
export interface EventDetailApiResponse {
  success: boolean;
  data: Event;
  message: string;
}

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Get full image URL for event featured image
 * @param imagePath - Relative or absolute image path
 * @returns Full URL or null
 */
export const getEventImageUrl = (imagePath: string | null): string | null => {
  return resolveImageUrl(imagePath, env.imageBaseUrl);
};

/**
 * Format event date to Vietnamese format
 * @param dateString - ISO date string
 * @returns Formatted date (DD/MM/YYYY)
 */
export const formatEventDate = (dateString: string): string => {
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
 * Get event title with language fallback
 * @param event - Event
 * @param language - Preferred language ('vi' or 'en')
 * @returns Title in preferred language or fallback
 */
export const getEventTitle = (event: Event, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && event.titleEn) {
    return event.titleEn;
  }
  return event.title || 'Untitled';
};

/**
 * Get event description with language fallback
 * @param event - Event
 * @param language - Preferred language ('vi' or 'en')
 * @returns Description in preferred language or fallback
 */
export const getEventDescription = (event: Event, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && event.descriptionEn) {
    return event.descriptionEn;
  }
  return event.description || '';
};

/**
 * Get event excerpt with language fallback
 * @param event - Event
 * @param language - Preferred language ('vi' or 'en')
 * @returns Excerpt in preferred language or fallback
 */
export const getEventExcerpt = (event: Event, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en' && event.excerptEn) {
    return event.excerptEn;
  }
  return event.excerpt || '';
};

/**
 * Get event location with language fallback
 * @param event - Event
 * @param language - Preferred language ('vi' or 'en')
 * @returns Location or null
 */
export const getEventLocation = (event: Event, language: 'vi' | 'en' = 'vi'): string | null => {
  if (language === 'en' && event.locationEn) {
    return event.locationEn;
  }
  return event.location;
};

// ========================
// API METHODS
// ========================

export const eventsAPI = {
  /**
   * Get all events with pagination and sorting
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @param sortBy - Sort field (default: 'startDate')
   * @param sortOrder - Sort order: 'asc' or 'desc' (default: 'desc')
   * @returns List of events with pagination meta
   * 
   * @example
   * const response = await eventsAPI.getAll(1, 12, 'startDate', 'desc');
   * console.log(response.data.data); // Array of events
   * console.log(response.data.meta); // { page: 1, limit: 12, total: 50 }
   */
  getAll: async (
    page: number = 1,
    limit: number = 12,
    sortBy: string = 'startDate',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<EventsApiResponse> => {
    return apiClient.get<EventsApiResponse>(
      `/api/public/events?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  },

  /**
   * Get single event by ID
   * @param id - Event UUID or slug
   * @returns Detailed event information
   * 
   * @example
   * const event = await eventsAPI.getById('123e4567-e89b-12d3-a456-426614174000');
   * console.log(event.title); // "Art Exhibition 2024"
   */
  getById: async (id: string): Promise<Event> => {
    const response = await apiClient.get<EventDetailApiResponse>(
      `/api/public/events/${id}`
    );
    return response.data;
  },

  /**
   * Search events by keyword
   * @param query - Search keyword
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns Matching events with pagination
   * 
   * @example
   * const results = await eventsAPI.search('exhibition', 1, 12);
   * console.log(results.data.data); // Events matching "exhibition"
   */
  search: async (
    query: string,
    page: number = 1,
    limit: number = 12
  ): Promise<EventsApiResponse> => {
    return apiClient.get<EventsApiResponse>(
      `/api/public/events?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  /**
   * Get events by status
   * @param status - Event status ('upcoming', 'ongoing', 'past', 'cancelled')
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns Events with specified status
   * 
   * @example
   * const results = await eventsAPI.getByStatus('upcoming', 1, 12);
   */
  getByStatus: async (
    status: 'upcoming' | 'ongoing' | 'past' | 'cancelled',
    page: number = 1,
    limit: number = 12
  ): Promise<EventsApiResponse> => {
    return apiClient.get<EventsApiResponse>(
      `/api/public/events?status=${status}&page=${page}&limit=${limit}`
    );
  },

  /**
   * Get events by category
   * @param category - Category name or slug
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 12)
   * @returns Events in specified category
   * 
   * @example
   * const results = await eventsAPI.getByCategory('exhibitions', 1, 12);
   */
  getByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 12
  ): Promise<EventsApiResponse> => {
    return apiClient.get<EventsApiResponse>(
      `/api/public/events?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`
    );
  },
};

export default eventsAPI;

