/**
 * FeaturedArtworks Component
 * Displays featured artworks from CMS on homepage
 * Client Component with data fetching
 */

'use client';

import { useEffect, useState } from 'react';
import { FeaturedArtworksClient } from './FeaturedArtworksClient';
import { featuredArtworksAPI, type FeaturedArtwork } from '@/lib/api/featured-artworks';
import { homepageConfigAPI } from '@/lib/api/homepage-config';
import Link from 'next/link';

import './FeaturedArtworks.css';

interface FeaturedArtworksProps {
  locale?: 'vi' | 'en';
  limit?: number;
  title?: string;
  titleEn?: string;
}

export function FeaturedArtworks({
  locale = 'vi',
  limit = 8,
  title = 'Tác phẩm nổi bật',
  titleEn = 'Featured Artworks',
}: FeaturedArtworksProps) {
  const [artworks, setArtworks] = useState<FeaturedArtwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState(locale === 'en' ? titleEn : title);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchFeaturedArtworks = async () => {
      try {
        console.info('[FeaturedArtworks] Fetching data', { locale, limit });
        setIsLoading(true);
        const [config, fetchedArtworks] = await Promise.all([
          homepageConfigAPI.get(),
          featuredArtworksAPI.getAll(locale, limit),
        ]);

        if (!isActive) return;

        let updatedTitle = locale === 'en' ? titleEn : title;
        let visible = true;

        if (config) {
          if (!config.showFeaturedArtworks) {
            visible = false;
          }
          if (locale === 'en' && config.featuredArtworksTitleEn) {
            updatedTitle = config.featuredArtworksTitleEn;
          } else if (locale === 'vi' && config.featuredArtworksTitle) {
            updatedTitle = config.featuredArtworksTitle;
          }
        }

        setSectionTitle(updatedTitle);
        setIsVisible(visible);
        setArtworks(fetchedArtworks);
        setError(null);
        console.info('[FeaturedArtworks] Data loaded', { count: fetchedArtworks.length });
      } catch (err) {
        if (!isActive) return;
        console.error('[FeaturedArtworks] Failed to fetch data', { error: err });
        setError('Failed to load featured artworks');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchFeaturedArtworks();

    return () => {
      isActive = false;
    };
  }, [locale, limit, title, titleEn]);

  if (!isVisible || (!error && !isLoading && artworks.length === 0)) {
    return null;
  }

  return (
    <section className="featured-artworks section">
      <div className="container">
        {/* Section Header */}
        <div className="featured-artworks__header">
          <h2 className="featured-artworks__title">{sectionTitle}</h2>
          <Link href={`/${locale}/collection`} className="featured-artworks__view-all">
            {locale === 'en' ? 'View All' : 'Xem tất cả'}
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="featured-artworks__error">
            <p>{error}</p>
          </div>
        )}

        {/* Artworks Grid */}
        {!error && artworks.length > 0 && (
          <FeaturedArtworksClient artworks={artworks} locale={locale} />
        )}
      </div>
    </section>
  );
}

export default FeaturedArtworks;

