/**
 * i18n Configuration
 * Centralized configuration for internationalization
 */

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

export const localeLabels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
};



