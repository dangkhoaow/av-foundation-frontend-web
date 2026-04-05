/**
 * Environment Configuration
 * Centralized environment variables and configuration for Next.js
 * 
 * NOTE: NEXT_PUBLIC_* variables must be accessed directly via process.env.NEXT_PUBLIC_*
 * for Next.js to properly inline them during build time.
 */

const metaEnv = ((import.meta as { env?: Record<string, string | boolean> }).env || process.env) as Record<
  string,
  string | boolean | undefined
>;

export const env = {
  // App Info
  appName: 'Art & Venture Foundation',
  appVersion: '1.0.0',

  // Environment
  isDevelopment: metaEnv.NODE_ENV === 'development',
  isProduction: metaEnv.NODE_ENV === 'production',
  isTest: metaEnv.NODE_ENV === 'test',

  // API Configuration (Vite uses VITE_*)
  apiUrl: (metaEnv.VITE_API_URL as string) || 'http://localhost:3001',
  // Artwork detail payloads can take longer than the old 10s default.
  apiTimeout: parseInt((metaEnv.VITE_API_TIMEOUT as string) || '30000', 10),

  // Image base URL (same as API URL for this project)
  imageBaseUrl: (metaEnv.VITE_IMAGE_BASE_URL as string) || 'http://localhost:3001/',

  // Feature Flags
  features: {
    enableSearch: ((metaEnv.VITE_ENABLE_SEARCH as string) || 'true') === 'true',
    enableLanguageSwitch: ((metaEnv.VITE_ENABLE_LANGUAGE_SWITCH as string) || 'true') === 'true',
    enableDarkMode: ((metaEnv.VITE_ENABLE_DARK_MODE as string) || 'false') === 'true',
    enableAnalytics: ((metaEnv.VITE_ENABLE_ANALYTICS as string) || 'false') === 'true',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: (metaEnv.VITE_GA_ID as string) || '',
  },

  // Social Links
  social: {
    facebook: (metaEnv.VITE_FACEBOOK as string) || 'https://facebook.com/artventurefoundation',
    instagram: (metaEnv.VITE_INSTAGRAM as string) || 'https://instagram.com/artventurefoundation',
    twitter: (metaEnv.VITE_TWITTER as string) || 'https://twitter.com/artventurefnd',
  },

  // Contact
  contact: {
    email: (metaEnv.VITE_CONTACT_EMAIL as string) || 'info@artventurefoundation.org',
    phone: (metaEnv.VITE_CONTACT_PHONE as string) || '+84 123 456 789',
    address: (metaEnv.VITE_CONTACT_ADDRESS as string) || 'Ho Chi Minh City, Vietnam',
  },
} as const;

export type EnvConfig = typeof env;

export default env;

