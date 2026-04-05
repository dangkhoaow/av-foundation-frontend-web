/**
 * ArtCollectionClient Component
 * Client Component for horizontal scroll and modal interactions
 */

'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/design-system/atoms/Icon';
import { Typography } from '@/design-system/atoms/Typography';
import { Card } from '@/design-system/molecules/Card';
import { ContentModal } from '@/components/business/ContentModal';
import type { Artwork } from './ArtCollection';

interface ArtCollectionClientProps {
  artworks: Artwork[];
}

export function ArtCollectionClient({ artworks }: ArtCollectionClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 564; // 564px card width
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  return (
    <>
      {/* Slider */}
      <div className="art-collection__grid" ref={scrollContainerRef}>
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="artwork-card"
            onClick={() => handleArtworkClick(artwork)}
          >
            <Card className="artwork-card__container" padding="none">
              <Card.Image
                src={artwork.image}
                alt={artwork.title}
                aspectRatio="4/3"
                className="artwork-card__image"
              />
              <div className="artwork-card__overlay">
                <div className="artwork-card__content">
                  <div className="artwork-card__header">
                    <div className="artwork-card__avatar">
                      <img
                        src={artwork.artistAvatar}
                        alt="Artist avatar"
                        className="artwork-card__avatar-img"
                      />
                    </div>
                    <Typography variant="body-sm" weight="semibold" className="artwork-card__artist">
                      {artwork.artist}
                    </Typography>
                    <button className="artwork-card__icon" aria-label="More options">
                      <Icon name="menu" size="md" />
                    </button>
                  </div>
                  <div className="artwork-card__text">
                    <Typography variant="h4" as="h4" className="artwork-card__title">
                      {artwork.title}
                    </Typography>
                    <Typography variant="body-sm" className="artwork-card__description">
                      {artwork.description}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Footer: VIEW ALL + Navigation buttons */}
      <div className="art-collection__footer">
        <button className="art-collection__view-all">
          <span>VIEW ALL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="art-collection__navigation">
          <button
            className="art-collection__nav-button"
            onClick={() => scroll('left')}
            aria-label="Previous"
          >
            <Icon name="chevron-left" size="lg" />
          </button>
          <button
            className="art-collection__nav-button"
            onClick={() => scroll('right')}
            aria-label="Next"
          >
            <Icon name="chevron-right" size="lg" />
          </button>
        </div>
      </div>

      {/* Dark Modal for Artwork Details */}
      {selectedArtwork && (
        <ContentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          variant="dark"
          size="medium"
          type="artwork"
          imageUrl={selectedArtwork.image}
          title={selectedArtwork.title}
          description={selectedArtwork.description}
          expandedContent={selectedArtwork.expandedContent}
          showAuthorCard={true}
          authorData={{
            avatar: selectedArtwork.artistAvatar,
            name: selectedArtwork.artist,
            email: selectedArtwork.email,
            phone: selectedArtwork.phone,
            socialLinks: selectedArtwork.socialLinks
          }}
        />
      )}
    </>
  );
}
