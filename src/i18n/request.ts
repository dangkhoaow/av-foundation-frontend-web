/**
 * i18n Request Configuration
 * Server-side i18n setup for Next.js App Router
 */

import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = 'vi';
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});

