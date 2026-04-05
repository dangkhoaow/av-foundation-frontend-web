/**
 * ArtistCollectionCard Component
 * Auto-playing image slider with artist info
 * Client Component - Uses state for slider
 */

'use client';

import React, { useState, useEffect } from 'react';
import './ArtistCollectionCard.css';

export interface ArtistInfo {
  name: string;
  avatar: string;
  artworkCount: number;
  description: string;
}

export interface ArtworkImage {
  id: number;
  url: string;
  alt: string;
  artist: ArtistInfo;
}

export interface ArtistCollectionCardProps {
  artworks: ArtworkImage[];
  onDetailClick?: () => void;
  className?: string;
}

export function ArtistCollectionCard({
  artworks,
  onDetailClick,
  className = ''
}: ArtistCollectionCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get current artist info based on current slide
  const currentArtist = artworks[currentSlide]?.artist;

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [artworks.length]);

  return (
    <div
      className={`artist-collection-card ${className}`}
      data-node-id="427:1643"
    >
      {/* Left: Artist Info Panel */}
      <div className="artist-collection-card__info">
        <div className="artist-collection-card__header">
          {/* Avatar */}
          <div className="artist-collection-card__avatar">
            {currentArtist?.avatar ? (
              <img
                src={currentArtist.avatar}
                alt={currentArtist.name}
              />
            ) : (
              <div className="artist-collection-card__avatar-placeholder">
                {currentArtist?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
          </div>

          {/* Artist Details */}
          <div className="artist-collection-card__details">
            <p className="artist-collection-card__name">
              {currentArtist?.name}
            </p>
            <p className="artist-collection-card__count">
              {currentArtist?.artworkCount} Tác phẩm
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="artist-collection-card__description">
          {currentArtist?.description}
        </p>
      </div>

      {/* Right: Gallery Panel */}
      <div className="artist-collection-card__gallery">
        {/* Image Slider */}
        <div className="artist-collection-card__slider">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`artist-collection-card__slide ${index === currentSlide ? 'artist-collection-card__slide--active' : ''
                }`}
            >
              {/* Blurred Background Layer */}
              <div
                className="artist-collection-card__slide-bg"
                style={{ backgroundImage: `url(${artwork.url})` }}
              />

              {/* Main Image */}
              <img
                src={artwork.url}
                alt={artwork.alt}
                className="artist-collection-card__slide-img"
              />
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="artist-collection-card__nav">
          {/* Pagination Dots */}
          <div className="artist-collection-card__dots">
            {artworks.map((_, index) => (
              <div
                key={index}
                className={`artist-collection-card__dot ${index === currentSlide ? 'artist-collection-card__dot--active' : ''
                  }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistCollectionCard;

