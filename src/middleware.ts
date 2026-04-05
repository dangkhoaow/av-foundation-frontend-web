/**
 * Middleware for i18n routing
 * Handles locale detection and routing
 */

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use prefix for locale URLs (e.g., /vi/page, /en/page)
  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  // Skip internal Next.js paths
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside public folder)
    // - _vercel (Vercel internals)
    // - all items with a file extension (e.g. favicon.ico)
    '/((?!api|_next|_static|_vercel|.*\\..*).*)',
  ],
};


