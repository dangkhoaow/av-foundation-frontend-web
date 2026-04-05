/**
 * Sitemap generation for i18n
 * Generates sitemap with all locales
 */

import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avfoundation.vn';
  
  // Define routes that should be in sitemap
  const routes = [
    '',
    '/collection',
    '/artists',
    '/events',
    '/news',
    '/knowledge',
    '/who-we-are',
  ];

  // Generate sitemap entries for each locale and route
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}



