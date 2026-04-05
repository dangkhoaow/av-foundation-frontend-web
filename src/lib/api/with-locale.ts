/**
 * API Helper with Locale Support
 * Helper to create API client with locale headers
 */

'use client';

import { useLocale } from 'next-intl';
import { ApiClient, apiClient } from './client';
import { env } from '@/config/env';

/**
 * Create an API client instance with locale header
 */
export function createLocalizedApiClient(locale: string): ApiClient {
  return new ApiClient(env.apiUrl, env.apiTimeout, locale);
}

/**
 * Hook to get localized API client
 * Use this in client components
 */
export function useLocalizedApi(): ApiClient {
  const locale = useLocale();
  
  // Set locale on the default client
  apiClient.setLocale(locale);
  
  return apiClient;
}
