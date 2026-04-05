/**
 * Collection Detail Page - Server Component
 * Server-side data fetching for SEO + loading.tsx for instant navigation
 */

import type { Metadata } from 'next';
import { CollectionDetailClient } from './CollectionDetailClient';
import { artworksAPI } from '@/lib/api';
import { getLocalizedSeoTitle, getLocalizedSeoDescription, getLocalizedSeoKeywords, getOgImage, getLocalizedSlug } from '@/lib/api/localization-helpers';
import type { Locale } from '@/i18n/config';

interface CollectionDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

/**
 * Dynamic SEO Metadata Generation
 * Loads artwork data and generates localized metadata for SEO
 */
export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const typedLocale = locale as Locale;

  try {
    const artwork = await artworksAPI.getById(id);

    // Get localized SEO fields with fallbacks
    const title = getLocalizedSeoTitle(artwork, typedLocale);
    const description = getLocalizedSeoDescription(artwork, typedLocale);
    const keywords = getLocalizedSeoKeywords(artwork, typedLocale);
    const ogImage = getOgImage(artwork);

    // Get artist name for additional context
    const artistName = artwork.artist?.fullName || '';
    const fullTitle = artistName ? `${title} - ${artistName}` : title;

    return {
      title: `${fullTitle} | A&V Foundation`,
      description: description || `View detailed information about ${title} from the A&V Foundation collection`,
      keywords: keywords.length > 0 ? keywords : undefined,
      openGraph: {
        title: fullTitle,
        description: description || undefined,
        images: ogImage ? [{ url: ogImage }] : undefined,
        locale: typedLocale === 'vi' ? 'vi_VN' : 'en_US',
        type: 'article',
        siteName: 'A&V Foundation',
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: description || undefined,
        images: ogImage ? [ogImage] : undefined,
      },
      alternates: {
        languages: {
          'vi': `/vi/collection/${getLocalizedSlug(artwork, 'vi')}`,
          'en': `/en/collection/${getLocalizedSlug(artwork, 'en')}`,
        },
      },
    };
  } catch (error) {
    // Fallback metadata if artwork fetch fails
    return {
      title: 'Artwork Detail | A&V Foundation',
      description: 'View detailed information about this artwork from the A&V Foundation collection',
    };
  }
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { id } = await params;

  try {
    // Server-side fetch for SEO
    const artwork = await artworksAPI.getById(id);
    return <CollectionDetailClient artwork={artwork} />;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return <CollectionDetailClient artwork={null} error="Failed to load artwork" />;
  }
}
