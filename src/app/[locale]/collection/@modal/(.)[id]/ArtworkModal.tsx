/**
 * Artwork Modal Component
 * Modal overlay version of artwork detail
 * Displays on top of collection page without unmounting it
 * 
 * Uses client-side fetch for instant modal display
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { artworksAPI, getImageUrl, getLocalizedSlug, type Artwork } from '@/lib/api';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n/config';
import './ArtworkModal.css';

interface ArtworkModalProps {
  artworkId: string;
}

export function ArtworkModal({ artworkId }: ArtworkModalProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [artistImageLoaded, setArtistImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'artist'>('details');
  const [isClosing, setIsClosing] = useState(false);

  // Refs for image elements to check if they're already loaded from cache
  const artworkImageRef = useRef<HTMLImageElement>(null);
  const artistImageRef = useRef<HTMLImageElement>(null);

  // Fetch artwork data client-side for instant modal display
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const data = await artworksAPI.getById(artworkId);
        setArtwork(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching artwork:', err);
        setError('Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  // Close modal handler
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to complete
    setTimeout(() => {
      router.back();
    }, 200);
  }, [router]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Check if images are already loaded from cache
  useEffect(() => {
    // Check artwork image
    if (artworkImageRef.current?.complete) {
      setImageLoaded(true);
    }

    // Check artist image
    if (artistImageRef.current?.complete) {
      setArtistImageLoaded(true);
    }
  }, [artwork]);

  // Loading state - show modal skeleton immediately
  if (loading) {
    return (
      <div
        className={`artwork-modal-backdrop ${isClosing ? 'closing' : ''}`}
        onClick={handleBackdropClick}
      >
        <div className="artwork-modal">
          <button className="artwork-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="artwork-modal-content">
            <div className="artwork-modal-left">
              <div className="artwork-modal-skeleton-image"></div>
            </div>
            <div className="artwork-modal-right">
              <div className="artwork-modal-skeleton-title"></div>
              <div className="artwork-modal-skeleton-subtitle"></div>
              <div className="artwork-modal-skeleton-tabs"></div>
              <div className="artwork-modal-skeleton-content">
                <div className="artwork-modal-skeleton-line"></div>
                <div className="artwork-modal-skeleton-line"></div>
                <div className="artwork-modal-skeleton-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !artwork) {
    return (
      <div
        className={`artwork-modal-backdrop ${isClosing ? 'closing' : ''}`}
        onClick={handleBackdropClick}
      >
        <div className="artwork-modal">
          <button className="artwork-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="artwork-modal-error">
            <h2>Artwork Not Found</h2>
            <p>{error || 'The artwork you are looking for could not be found.'}</p>
            <button onClick={handleClose} className="artwork-modal-error-button">
              Back to Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(artwork.image);
  const artistImageUrl = getImageUrl(artwork.artist?.image);

  return (
    <div
      className={`artwork-modal-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="artwork-modal">
        {/* Close Button */}
        <button className="artwork-modal-close" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Open in new page link */}
        <Link
          href={`/collection/${getLocalizedSlug(artwork, locale)}`}
          className="artwork-modal-expand"
          title="Open in full page"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 3H21V9M21 3L13 11M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Main Content */}
        <div className="artwork-modal-content">
          {/* Left: Artwork Image */}
          <div className="artwork-modal-left">
            <div className={`artwork-modal-image ${imageLoaded ? 'loaded' : ''}`}>
              {imageUrl ? (
                <img
                  ref={artworkImageRef}
                  src={imageUrl}
                  alt={artwork.title}
                  onLoad={() => setImageLoaded(true)}
                  className={imageLoaded ? 'loaded' : 'loading'}
                />
              ) : (
                <div className="artwork-modal-image-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M21 15L16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 18L10 14L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            {/* Image Info below image */}
            {artwork.image && (
              <div className="artwork-modal-image-info">
                {artwork.imageWidth && artwork.imageHeight && (
                  <span className="artwork-modal-image-dimensions">
                    {artwork.imageWidth} × {artwork.imageHeight} px
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Artwork Info */}
          <div className="artwork-modal-right">
            {/* Header */}
            <div className="artwork-modal-header">
              <h1 className="artwork-modal-title">{artwork.title}</h1>
              {artwork.titleEn && artwork.titleEn !== artwork.title && (
                <p className="artwork-modal-title-en">{artwork.titleEn}</p>
              )}

              {/* Artist Link */}
              {artwork.artist && (
                <Link href={`/artists/${artwork.artist.id}`} className="artwork-modal-artist-link">
                  <span className="artwork-modal-artist-label">by</span>
                  <span className="artwork-modal-artist-name">{artwork.artist.fullName}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Tabs */}
            <div className="artwork-modal-tabs">
              <button
                className={`artwork-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Artwork Details
              </button>
              <button
                className={`artwork-modal-tab ${activeTab === 'artist' ? 'active' : ''}`}
                onClick={() => setActiveTab('artist')}
              >
                Artist Info
              </button>
            </div>

            {/* Tab Content */}
            <div className="artwork-modal-tab-content">
              {activeTab === 'details' && (
                <div className="artwork-modal-info-section">
                  {/* Basic Info */}
                  <div className="artwork-modal-info-group">
                    <h3 className="artwork-modal-info-group-title">Basic Information</h3>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Title (Vietnamese)</span>
                      <span className="artwork-modal-info-value">{artwork.title || '—'}</span>
                    </div>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Title (English)</span>
                      <span className="artwork-modal-info-value">{artwork.titleEn || '—'}</span>
                    </div>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Inventory Number</span>
                      <span className="artwork-modal-info-value artwork-modal-info-value--code">
                        {artwork.inventoryNumber || '—'}
                      </span>
                    </div>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Date Created</span>
                      <span className="artwork-modal-info-value">{artwork.dateCreated || '—'}</span>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="artwork-modal-info-group">
                    <h3 className="artwork-modal-info-group-title">Collection Information</h3>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Belongs to A&V Collection</span>
                      <span className={`artwork-modal-info-value artwork-modal-info-badge ${artwork.belongsToAVCollection ? 'artwork-modal-info-badge--yes' : 'artwork-modal-info-badge--no'}`}>
                        {artwork.belongsToAVCollection ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {(artwork.description || artwork.descriptionEn) && (
                    <div className="artwork-modal-info-group">
                      <h3 className="artwork-modal-info-group-title">Description</h3>

                      {artwork.description && (
                        <div className="artwork-modal-info-block">
                          <p className="artwork-modal-info-text">{artwork.description}</p>
                        </div>
                      )}

                      {artwork.descriptionEn && (
                        <div className="artwork-modal-info-block">
                          <p className="artwork-modal-info-text artwork-modal-info-text--en">
                            {artwork.descriptionEn}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'artist' && artwork.artist && (
                <div className="artwork-modal-info-section">
                  {/* Artist Card */}
                  <div className="artwork-modal-artist-card">
                    <Link href={`/artists/${artwork.artist.id}`} className="artwork-modal-artist-info">
                      <div className={`artwork-modal-artist-avatar ${artistImageLoaded ? 'loaded' : ''}`}>
                        {artistImageUrl ? (
                          <img
                            ref={artistImageRef}
                            src={artistImageUrl}
                            alt={artwork.artist.fullName}
                            onLoad={() => setArtistImageLoaded(true)}
                            className={artistImageLoaded ? 'loaded' : 'loading'}
                          />
                        ) : (
                          <div className="artwork-modal-artist-avatar-placeholder">
                            {artwork.artist.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="artwork-modal-artist-details">
                        <h3 className="artwork-modal-artist-card-name">{artwork.artist.fullName}</h3>
                        <span className="artwork-modal-artist-view">View full profile →</span>
                      </div>
                    </Link>
                  </div>

                  {/* Artist Details */}
                  <div className="artwork-modal-info-group">
                    <h3 className="artwork-modal-info-group-title">Artist Information</h3>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Full Name</span>
                      <span className="artwork-modal-info-value">{artwork.artist.fullName || '—'}</span>
                    </div>

                    <div className="artwork-modal-info-row">
                      <span className="artwork-modal-info-label">Artist Code</span>
                      <span className="artwork-modal-info-value artwork-modal-info-value--code">
                        {artwork.artist.artistCode || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Artist Bio */}
                  {(artwork.artist.bioSummary || artwork.artist.bioSummaryEn) && (
                    <div className="artwork-modal-info-group">
                      <h3 className="artwork-modal-info-group-title">Biography Summary</h3>

                      {artwork.artist.bioSummary && (
                        <div className="artwork-modal-info-block">
                          <p className="artwork-modal-info-text">{artwork.artist.bioSummary}</p>
                        </div>
                      )}

                      {artwork.artist.bioSummaryEn && (
                        <div className="artwork-modal-info-block">
                          <p className="artwork-modal-info-text artwork-modal-info-text--en">
                            {artwork.artist.bioSummaryEn}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
