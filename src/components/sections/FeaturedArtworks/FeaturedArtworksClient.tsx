'use client';

/**
 * FeaturedArtworksClient Component
 * Client-side interactions for featured artworks grid
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedArtwork } from '@/lib/api';

interface FeaturedArtworksClientProps {
  artworks: FeaturedArtwork[];
  locale: 'vi' | 'en';
}

export function FeaturedArtworksClient({ artworks, locale }: FeaturedArtworksClientProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Get localized title
  const getTitle = (artwork: FeaturedArtwork) => {
    if (locale === 'en' && artwork.titleEn) {
      return artwork.titleEn;
    }
    return artwork.title;
  };

  // Get artwork link
  const getArtworkLink = (artwork: FeaturedArtwork) => {
    const slug = locale === 'en' ? artwork.slugEn : artwork.slug;
    if (slug) {
      return `/${locale}/artworks/${slug}`;
    }
    return `/${locale}/artworks/${artwork.id}`;
  };

  return (
    <div className="featured-artworks__grid">
      {artworks.map((artwork) => (
        <Link
          key={artwork.id}
          href={getArtworkLink(artwork)}
          className="featured-artworks__item"
          onMouseEnter={() => setHoveredId(artwork.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Image */}
          <div className="featured-artworks__image-wrapper">
            {artwork.image ? (
              <Image
                src={artwork.image}
                alt={getTitle(artwork)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="featured-artworks__image"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="featured-artworks__placeholder">
                <span>No image</span>
              </div>
            )}

            {/* Hover Overlay */}
            <div
              className={`featured-artworks__overlay ${
                hoveredId === artwork.id ? 'featured-artworks__overlay--visible' : ''
              }`}
            >
              <span className="featured-artworks__view-text">
                {locale === 'en' ? 'View Details' : 'Xem chi tiết'}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="featured-artworks__info">
            <h3 className="featured-artworks__artwork-title">{getTitle(artwork)}</h3>
            <p className="featured-artworks__artist">
              {artwork.artistName || artwork.artist || (locale === 'en' ? 'Unknown artist' : 'Nghệ sĩ chưa xác định')}
            </p>
            {artwork.dateCreated && (
              <p className="featured-artworks__date">{artwork.dateCreated}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default FeaturedArtworksClient;

