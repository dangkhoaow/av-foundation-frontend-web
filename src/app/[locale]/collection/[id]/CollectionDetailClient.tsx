/**
 * Collection Detail Client Component
 * Renders artwork details - data is fetched server-side for SEO
 * Shows all artwork fields for data validation
 */

'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { getImageUrl, type Artwork } from '@/lib/api';
import './CollectionDetailPage.css';

interface CollectionDetailClientProps {
  artwork: Artwork | null;
  error?: string;
}

export function CollectionDetailClient({ artwork, error }: CollectionDetailClientProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [artistImageLoaded, setArtistImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'artist'>('details');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxClosing, setLightboxClosing] = useState(false);

  // Filter valid artwork images from the files array
  const artworkImages = (artwork?.files || [])
    .filter(file => file.purpose.startsWith('ARTWORK_'))
    .sort((a, b) => {
      // Sort by primary status first, then display order
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });

  // Initialize selected image with the main image
  useEffect(() => {
    if (artwork?.image && !selectedImage) {
      setSelectedImage(getImageUrl(artwork.image));
    }
  }, [artwork, selectedImage]);

  // Refs for image elements to check if they're already loaded from cache
  const artworkImageRef = useRef<HTMLImageElement>(null);
  const artistImageRef = useRef<HTMLImageElement>(null);

  // Scroll to top BEFORE paint (useLayoutEffect runs synchronously)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Check if images are already loaded from cache (important for new tab opens)
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, lightboxIndex, artworkImages.length]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setLightboxClosing(false);
  };

  const closeLightbox = () => {
    setLightboxClosing(true);
    setTimeout(() => {
      setLightboxOpen(false);
      setLightboxClosing(false);
    }, 300); // Match animation duration
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else if (direction === 'next' && lightboxIndex < artworkImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  // Error state
  if (error || !artwork) {
    return (
      <div className="collection-detail-page">
        <div className="collection-detail-container">
          <Link href="/collection" className="collection-detail-back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="collection-detail-error">
            <h2>Artwork Not Found</h2>
            <p>{error || 'The artwork you are looking for could not be found.'}</p>
            <Link href="/collection" className="collection-detail-error-button">
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* REMOVING this replacement to check CSS file first */
  const artistImageUrl = getImageUrl(artwork.artist?.image);

  return (
    <div className="collection-detail-page">
      <div className="collection-detail-container">


        {/* Main Content */}
        <div className="collection-detail-main">
          {/* Back Button */}
          <Link href="/collection" className="collection-detail-back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Left: Artwork Image */}
          <div className="collection-detail-left">
            <div
              className={`collection-detail-image ${imageLoaded ? 'loaded' : ''}`}
              onClick={() => {
                if (selectedImage && artworkImages.length > 0) {
                  const currentIndex = artworkImages.findIndex(
                    file => getImageUrl(file.url || file.webpUrl) === selectedImage
                  );
                  openLightbox(currentIndex >= 0 ? currentIndex : 0);
                }
              }}
              title="Click to view fullscreen"
            >
              {selectedImage ? (
                <img
                  key={selectedImage} // Reset loading state on image change
                  ref={artworkImageRef}
                  src={selectedImage}
                  alt={artwork.title}
                  onLoad={() => setImageLoaded(true)}
                  className={imageLoaded ? 'loaded' : 'loading'}
                />
              ) : (
                <div className="collection-detail-image-placeholder">
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

            {/* Thumbnail Gallery */}
            {artworkImages.length > 1 && (
              <div className="collection-detail-thumbnails">
                {artworkImages.map((file, index) => {
                  const thumbUrl = getImageUrl(file.thumbnailUrl || file.url || file.webpUrl);
                  const fullUrl = getImageUrl(file.url || file.webpUrl);
                  if (!thumbUrl) return null;

                  const isSelected = fullUrl === selectedImage;

                  return (
                    <button
                      key={file.id || index}
                      className={`collection-detail-thumbnail ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (fullUrl && fullUrl !== selectedImage) {
                          setImageLoaded(false); // Reset load state for smooth transition
                          setSelectedImage(fullUrl);
                        }
                      }}
                    >
                      <img src={thumbUrl} alt={file.altText || `View ${index + 1}`} loading="lazy" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Image Info below image */}
            {artwork.image && (
              <div className="collection-detail-image-info">
                {artwork.imageWidth && artwork.imageHeight && (
                  <span className="collection-detail-image-dimensions">
                    {artwork.imageWidth} × {artwork.imageHeight} px
                  </span>
                )}
                {/* File Count Indicator */}
                {artworkImages.length > 0 && (
                  <span className="collection-detail-image-count">
                    {artworkImages.length} image{artworkImages.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Artwork Info */}
          <div className="collection-detail-right">
            {/* Header */}
            <div className="collection-detail-header">
              <h1 className="collection-detail-title">{artwork.title}</h1>
              {artwork.titleEn && artwork.titleEn !== artwork.title && (
                <p className="collection-detail-title-en">{artwork.titleEn}</p>
              )}

              {/* Artist Link */}
              {artwork.artist && (
                <Link href={`/artists/${artwork.artist.id}`} className="collection-detail-artist-link">
                  <span className="collection-detail-artist-label">by</span>
                  <span className="collection-detail-artist-name">{artwork.artist.fullName}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Tabs */}
            <div className="collection-detail-tabs">
              <button
                className={`collection-detail-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Artwork Details
              </button>
              <button
                className={`collection-detail-tab ${activeTab === 'artist' ? 'active' : ''}`}
                onClick={() => setActiveTab('artist')}
              >
                Artist Info
              </button>
            </div>

            {/* Tab Content */}
            <div className="collection-detail-tab-content">
              {activeTab === 'details' && (
                <div className="collection-detail-info-section">
                  {/* Basic Info */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Basic Information</h3>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Title (Vietnamese)</span>
                      <span className="collection-detail-info-value">{artwork.title || '—'}</span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Title (English)</span>
                      <span className="collection-detail-info-value">{artwork.titleEn || '—'}</span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Inventory Number</span>
                      <span className="collection-detail-info-value collection-detail-info-value--code">
                        {artwork.inventoryNumber || '—'}
                      </span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Date Created</span>
                      <span className="collection-detail-info-value">{artwork.dateCreated || '—'}</span>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Collection Information</h3>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Belongs to A&V Collection</span>
                      <span className={`collection-detail-info-value collection-detail-info-badge ${artwork.belongsToAVCollection ? 'collection-detail-info-badge--yes' : 'collection-detail-info-badge--no'}`}>
                        {artwork.belongsToAVCollection ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Image Information</h3>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Image Width</span>
                      <span className="collection-detail-info-value">
                        {artwork.imageWidth ? `${artwork.imageWidth} px` : '—'}
                      </span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Image Height</span>
                      <span className="collection-detail-info-value">
                        {artwork.imageHeight ? `${artwork.imageHeight} px` : '—'}
                      </span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Image Path</span>
                      <span className="collection-detail-info-value collection-detail-info-value--code collection-detail-info-value--small">
                        {artwork.image || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Description</h3>

                    <div className="collection-detail-info-block">
                      <span className="collection-detail-info-label">Vietnamese</span>
                      <p className="collection-detail-info-text">
                        {artwork.description || 'No description available'}
                      </p>
                    </div>

                    <div className="collection-detail-info-block">
                      <span className="collection-detail-info-label">English</span>
                      <p className="collection-detail-info-text">
                        {artwork.descriptionEn || 'No English description available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'artist' && artwork.artist && (
                <div className="collection-detail-info-section">
                  {/* Artist Card */}
                  <div className="collection-detail-artist-card">
                    <Link href={`/artists/${artwork.artist.id}`} className="collection-detail-artist-info">
                      <div className={`collection-detail-artist-avatar ${artistImageLoaded ? 'loaded' : ''}`}>
                        {artistImageUrl ? (
                          <img
                            ref={artistImageRef}
                            src={artistImageUrl}
                            alt={artwork.artist.fullName}
                            onLoad={() => setArtistImageLoaded(true)}
                            className={artistImageLoaded ? 'loaded' : 'loading'}
                          />
                        ) : (
                          <div className="collection-detail-artist-avatar-placeholder">
                            {artwork.artist.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="collection-detail-artist-details">
                        <h3 className="collection-detail-artist-card-name">{artwork.artist.fullName}</h3>
                        <span className="collection-detail-artist-view">View full profile →</span>
                      </div>
                    </Link>
                  </div>

                  {/* Artist Details */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Artist Information</h3>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Full Name</span>
                      <span className="collection-detail-info-value">{artwork.artist.fullName || '—'}</span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Artist Code</span>
                      <span className="collection-detail-info-value collection-detail-info-value--code">
                        {artwork.artist.artistCode || '—'}
                      </span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Artist ID</span>
                      <span className="collection-detail-info-value collection-detail-info-value--code collection-detail-info-value--small">
                        {artwork.artist.id}
                      </span>
                    </div>

                    <div className="collection-detail-info-row">
                      <span className="collection-detail-info-label">Artist Image</span>
                      <span className="collection-detail-info-value collection-detail-info-value--code collection-detail-info-value--small">
                        {artwork.artist.image || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Artist Bio */}
                  <div className="collection-detail-info-group">
                    <h3 className="collection-detail-info-group-title">Biography Summary</h3>

                    <div className="collection-detail-info-block">
                      <span className="collection-detail-info-label">Vietnamese</span>
                      <p className="collection-detail-info-text">
                        {artwork.artist.bioSummary || 'No biography available'}
                      </p>
                    </div>

                    <div className="collection-detail-info-block">
                      <span className="collection-detail-info-label">English</span>
                      <p className="collection-detail-info-text">
                        {artwork.artist.bioSummaryEn || 'No English biography available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && artworkImages.length > 0 && (
          <div
            className={`collection-detail-lightbox ${lightboxClosing ? 'closing' : ''}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
          >
            <button
              className="collection-detail-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              className="collection-detail-lightbox-nav collection-detail-lightbox-nav--prev"
              onClick={() => navigateLightbox('prev')}
              disabled={lightboxIndex === 0}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className="collection-detail-lightbox-nav collection-detail-lightbox-nav--next"
              onClick={() => navigateLightbox('next')}
              disabled={lightboxIndex === artworkImages.length - 1}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="collection-detail-lightbox-content">
              <img
                src={getImageUrl(artworkImages[lightboxIndex]?.url || artworkImages[lightboxIndex]?.webpUrl || '') || ''}
                alt={artworkImages[lightboxIndex]?.altText || `${artwork.title} - Image ${lightboxIndex + 1}`}
                className="collection-detail-lightbox-image"
              />
            </div>

            <div className="collection-detail-lightbox-counter">
              {lightboxIndex + 1} / {artworkImages.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
