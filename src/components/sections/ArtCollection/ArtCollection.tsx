/**
 * ArtCollection Component
 * Horizontal scroll gallery with overlay cards
 * Client Component - Fetches featured artworks
 */

'use client';

import { useEffect, useState } from 'react';
import { ArtCollectionClient } from './ArtCollectionClient';
import { featuredArtworksAPI, type FeaturedArtwork } from '@/lib/api';
import './ArtCollection.css';

export interface Artwork {
  id: string | number;
  title: string;
  artist: string;
  artistAvatar: string;
  email: string;
  phone: string;
  description: string;
  expandedContent: string;
  image: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

interface ArtCollectionProps {
  locale?: 'vi' | 'en';
}

export function ArtCollection({ locale = 'vi' }: ArtCollectionProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchArtworks = async () => {
      try {
        console.info('[ArtCollection] Fetching featured artworks', { locale });
        setIsLoading(true);
        const apiArtworks: FeaturedArtwork[] = await featuredArtworksAPI.getAll(locale);

        if (!isActive) return;

        const mappedArtworks: Artwork[] = apiArtworks.map((art) => ({
          id: art.id,
          title: art.title,
          artist: art.artistName || art.artist || 'Unknown Artist',
          artistAvatar: `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(
            art.artistName || art.artist || 'A'
          )}`,
          email: '',
          phone: '',
          description: art.dateCreated ? `Created in ${art.dateCreated}` : '',
          expandedContent: art.bio || 'Thông tin chi tiết về nghệ sĩ và tác phẩm đang được cập nhật...',
          image: art.image || '/images/placeholder.jpg',
          socialLinks: {
            facebook: '#',
            instagram: '#',
          },
        }));

        setArtworks(mappedArtworks);
        console.info('[ArtCollection] Artworks loaded', { count: mappedArtworks.length });
      } catch (error) {
        if (!isActive) return;
        console.error('[ArtCollection] Failed to fetch featured artworks', { error });
        setArtworks([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchArtworks();

    return () => {
      isActive = false;
    };
  }, [locale]);

  if (isLoading || artworks.length === 0) {
    return null;
  }

  return (
    <section className="art-collection section">
      <div className="container">
        {/* Title and Description */}
        <div className="art-collection__intro">
          <h2 className="art-collection__title">
            Art & Venture Art Collection
          </h2>
        </div>

        {/* Client Component handles scrolling and modal */}
        <ArtCollectionClient artworks={artworks} />
      </div>
    </section>
  );
}

export default ArtCollection;

