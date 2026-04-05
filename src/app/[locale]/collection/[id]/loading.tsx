/**
 * Collection Detail Loading State
 * Displays skeleton UI instantly while server fetches data
 * This enables instant navigation + SEO
 */

import Link from 'next/link';
import './CollectionDetailPage.css';

export default function CollectionDetailLoading() {
  return (
    <div className="collection-detail-page">
      <div className="collection-detail-container">
        {/* Back Button - functional even during loading */}
        <Link href="/collection" className="collection-detail-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="collection-detail-main">
          {/* Left: Image Skeleton */}
          <div className="collection-detail-left">
            <div className="collection-detail-image skeleton-shimmer">
              <div className="skeleton-image-placeholder"></div>
            </div>
          </div>

          {/* Right: Info Skeleton */}
          <div className="collection-detail-right">
            {/* Title Skeleton */}
            <div className="collection-detail-header">
              <div className="skeleton-title skeleton-shimmer"></div>
              <div className="skeleton-subtitle skeleton-shimmer"></div>
            </div>

            {/* Artist Link Skeleton */}
            <div className="skeleton-artist-link skeleton-shimmer"></div>

            {/* Metadata Grid Skeleton */}
            <div className="collection-detail-meta">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="collection-detail-meta-item">
                  <div className="skeleton-meta-label skeleton-shimmer"></div>
                  <div className="skeleton-meta-value skeleton-shimmer"></div>
                </div>
              ))}
            </div>

            {/* Artist Card Skeleton */}
            <div className="collection-detail-artist-card">
              <div className="skeleton-section-title skeleton-shimmer"></div>
              <div className="skeleton-artist-card">
                <div className="skeleton-avatar skeleton-shimmer"></div>
                <div className="skeleton-artist-info">
                  <div className="skeleton-artist-name skeleton-shimmer"></div>
                  <div className="skeleton-artist-bio skeleton-shimmer"></div>
                  <div className="skeleton-artist-bio-2 skeleton-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

