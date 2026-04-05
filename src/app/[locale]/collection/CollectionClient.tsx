/**
 * Collection Page - Client Component
 * Masonry grid with infinite scroll, filtering, and lazy loading
 * Uses TanStack Query for caching - data persists when navigating back
 */

'use client';

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocation } from 'react-router-dom';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ArtistCollectionCard } from '@/components/business/ArtistCollectionCard';
import type { ArtworkImage } from '@/components/business/ArtistCollectionCard';
import { calculateRowSpan, getColumnWidth, debounce } from './utils/gridCalculations';
import { artworksAPI, getImageUrl, getLocalizedSlug, type Artwork as APIArtwork } from '@/lib/api';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n/config';
import './CollectionPage.css';

interface Artwork {
  id: string;
  title: string;
  slug: string | null;
  slugEn: string | null;
  artist: string;
  artistAvatar: string | null;
  artistArtworkCount: number;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  category: string;
}

// Default avatar placeholder (first letter of name)


// Predefined heights to create masonry-like effect without randomness
const SKELETON_HEIGHTS = [45, 35, 55, 40, 50, 38, 48, 42, 52, 36, 46, 58, 44, 34, 54, 39, 49, 43, 53, 37, 47, 57];

// Skeleton colors - Subtle tints for elegant art gallery feel
const SKELETON_COLORS = [
  'linear-gradient(135deg, #F5F2EE 0%, #EBE5DD 100%)',  // Warm cream
  'linear-gradient(135deg, #F2EFE8 0%, #E8E3D8 100%)',  // Soft sand
  'linear-gradient(135deg, #F0EDE6 0%, #E5E0D5 100%)',  // Light taupe
  'linear-gradient(135deg, #EEE8E0 0%, #E3DBD0 100%)',  // Pale stone
  'linear-gradient(135deg, #F3F0E8 0%, #E8E2D5 100%)',  // Antique white
  'linear-gradient(135deg, #F1ECE3 0%, #E6DFD2 100%)',  // Champagne
];

// Generate consistent heights for skeleton items (seeded by index)
const getSkeletonRowSpan = (index: number): number => {
  return SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length];
};

// Limit for pagination - 40 items per page for better initial viewport fill
const LIMIT = 40;

// Key for storing scroll position
const SCROLL_POSITION_KEY = 'collection_scroll_position';
// Key for storing loaded images
const LOADED_IMAGES_KEY = 'collection_loaded_images';

// Get loaded images from sessionStorage
const getLoadedImages = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const stored = sessionStorage.getItem(LOADED_IMAGES_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
};

// Save loaded images to sessionStorage
const saveLoadedImages = (images: Set<string>) => {
  sessionStorage.setItem(LOADED_IMAGES_KEY, JSON.stringify([...images]));
};

// Map API artwork to local Artwork type
const mapArtwork = (artwork: APIArtwork): Artwork => ({
  id: artwork.id,
  title: artwork.title,
  slug: artwork.slug,
  slugEn: artwork.slugEn,
  artist: artwork.artist?.fullName || 'Unknown Artist',
  artistAvatar: getImageUrl(artwork.artist?.image),
  // TODO: Replace with actual artworkCount from API when available
  artistArtworkCount: 0,
  image: getImageUrl(artwork.image),
  imageWidth: artwork.imageWidth,
  imageHeight: artwork.imageHeight,
  category: 'all', // Backend doesn't have category yet, will use 'all'
});


export function CollectionClient() {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const location = useLocation();
  const artistId = searchParams.get('artist') ?? undefined;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [columnWidth, setColumnWidth] = useState<number>(500);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Track loaded images to skip animation on back navigation
  const loadedImagesRef = useRef<Set<string>>(getLoadedImages());
  // Check if this is a return visit (has cached data)
  const isReturnVisitRef = useRef<boolean>(false);

  // Query for "New Creation" section - fetch 5 newest artworks
  const { data: newCreationsData, isLoading: isLoadingNewCreations } = useQuery({
    queryKey: ['artworks', 'new-creations'],
    queryFn: async () => {
      const response = await artworksAPI.getAll(1, 5, { sortBy: 'createdAt', sortOrder: 'desc' });
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch new creations');
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Map API response to ArtworkImage[] for ArtistCollectionCard
  const newCreationArtworks: ArtworkImage[] = useMemo(() => {
    if (!newCreationsData || newCreationsData.length === 0) return [];
    return newCreationsData.map((artwork, index) => ({
      id: index + 1,
      url: getImageUrl(artwork.image) || '',
      alt: artwork.title,
      artist: {
        name: artwork.artist?.fullName || 'Unknown Artist',
        avatar: getImageUrl(artwork.artist?.image) || '',
        artworkCount: 0, // Not available from API yet
        description: artwork.artist?.bioSummary || '',
      },
    }));
  }, [newCreationsData]);

  // TanStack Query - useInfiniteQuery for infinite scroll with caching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['artworks', { artistId }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await artworksAPI.getAll(pageParam, LIMIT, artistId ? { artistId } : undefined);

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch artworks');
      }

      return {
        artworks: response.data.data.map(mapArtwork),
        meta: response.data.meta,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, meta } = lastPage;
      const totalPages = Math.ceil(meta.total / LIMIT);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    // Data stays fresh for 5 minutes - won't refetch when navigating back
    staleTime: 5 * 60 * 1000,
    // Keep cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    // Retry 2 times on error
    retry: 2,
    retryDelay: 3000,
  });

  // Flatten all pages into single artworks array
  const artworks = useMemo(() => {
    return data?.pages.flatMap(page => page.artworks) ?? [];
  }, [data]);

  // Get total items from last page meta
  const totalItems = data?.pages[0]?.meta.total ?? 0;

  // Restore scroll position when coming back from detail page
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition && artworks.length > 0) {
      // Mark as return visit to skip fade-in animations
      isReturnVisitRef.current = true;
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        // Clear after restoring
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
      });
    }
  }, [artworks.length]);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
    };

    // Save on page visibility change (when user clicks a link)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Save scroll position when component unmounts (navigating to detail)
      sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
      // Save loaded images
      saveLoadedImages(loadedImagesRef.current);
    };
  }, []);

  // Set column width on mount and resize
  useEffect(() => {
    const updateColumnWidth = () => {
      // Check if sidebar is present (only on desktop)
      const hasSidebar = document.querySelector('.app.with-sidebar') !== null;

      // Get actual sidebar width from DOM
      const sidebarEl = document.querySelector('.sidebar');
      const actualSidebarWidth = sidebarEl ? sidebarEl.getBoundingClientRect().width : 0;
      const sidebarWidth = hasSidebar && window.innerWidth >= 1024 ? actualSidebarWidth : 0;

      // Calculate available width (viewport - sidebar)
      // This is the actual content area width after sidebar takes space


      // CRITICAL: CSS media queries use VIEWPORT width for breakpoints
      // So we must pass VIEWPORT to match the same breakpoint as CSS!
      // Also pass sidebarWidth so calculation accounts for actual content area
      const calculatedColumnWidth = Math.floor(getColumnWidth(window.innerWidth, sidebarWidth));



      setColumnWidth(calculatedColumnWidth);

      // Set CSS variable for grid to use
      document.documentElement.style.setProperty('--grid-column-width', `${calculatedColumnWidth}px`);
    };

    updateColumnWidth();

    const handleResize = debounce(updateColumnWidth, 150);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When sentinel becomes visible and we have more items to load
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // Start loading 500px before reaching the sentinel
        rootMargin: '500px',
        threshold: 0
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredArtworks = artworks.filter(artwork => {
    // Don't filter by image - show artworks even without images (will show placeholder)
    // if (!artwork.image) return false;
    if (activeFilter === 'all') return true;
    return artwork.category === activeFilter;
  });

  const artworkRowSpans = useMemo(() => {
    const spans = filteredArtworks.map((artwork) => {
      const rowSpan = calculateRowSpan(artwork.imageWidth, artwork.imageHeight, columnWidth);



      return rowSpan;
    });

    return spans;
  }, [filteredArtworks, columnWidth]);

  // Show loading skeleton during initial load
  if (isLoading) {
    return (
      <div className="collection-page">
        <div className="collection-page__hero">
          <div className="collection-page__hero-content">
            <h1 className="collection-page__title">Collection</h1>
            <div className="collection-page__featured">
              <h2 className="collection-page__section-title">New creation</h2>

              {/* Featured Skeleton - matches ArtistCollectionCard layout */}
              <div className="skeleton-featured">
                <div className="skeleton-featured__info">
                  <div className="skeleton-featured__avatar"></div>
                  <div className="skeleton-featured__text">
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--short"></div>
                  </div>
                  <div className="skeleton-featured__text" style={{ marginTop: 'auto' }}>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                  </div>
                </div>
                <div className="skeleton-featured__gallery"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="collection-page__content">
          <div className="collection-page__filters">
            <h2 className="collection-page__section-title">Key works</h2>
          </div>
          <div className="collection-page__grid">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="skeleton-grid-item"
                style={{
                  background: SKELETON_COLORS[index % SKELETON_COLORS.length],
                  gridRowEnd: `span ${getSkeletonRowSpan(index)}`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state - show skeleton loading instead of error message
  if (isError) {
    return (
      <div className="collection-page">
        <div className="collection-page__hero">
          <div className="collection-page__hero-content">
            <h1 className="collection-page__title">Collection</h1>
            <div className="collection-page__featured">
              <h2 className="collection-page__section-title">New creation</h2>

              {/* Featured Skeleton - matches ArtistCollectionCard layout */}
              <div className="skeleton-featured">
                <div className="skeleton-featured__info">
                  <div className="skeleton-featured__avatar"></div>
                  <div className="skeleton-featured__text">
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--short"></div>
                  </div>
                  <div className="skeleton-featured__text" style={{ marginTop: 'auto' }}>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                  </div>
                </div>
                <div className="skeleton-featured__gallery"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="collection-page__content">
          <div className="collection-page__filters">
            <h2 className="collection-page__section-title">Key works</h2>
          </div>
          <div className="collection-page__grid">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <div
                key={`skeleton-error-${index}`}
                className="skeleton-grid-item"
                style={{
                  background: SKELETON_COLORS[index % SKELETON_COLORS.length],
                  gridRowEnd: `span ${getSkeletonRowSpan(index)}`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <div className="collection-page__hero">
        <div className="collection-page__hero-content">
          <h1 className="collection-page__title">Collection</h1>

          <div className="collection-page__featured">
            <h2 className="collection-page__section-title">New creation</h2>

            {isLoadingNewCreations ? (
              <div className="skeleton-featured">
                <div className="skeleton-featured__info">
                  <div className="skeleton-featured__avatar"></div>
                  <div className="skeleton-featured__text">
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--short"></div>
                  </div>
                  <div className="skeleton-featured__text" style={{ marginTop: 'auto' }}>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--long"></div>
                    <div className="skeleton-featured__line skeleton-featured__line--medium"></div>
                  </div>
                </div>
                <div className="skeleton-featured__gallery"></div>
              </div>
            ) : newCreationArtworks.length > 0 ? (
              <ArtistCollectionCard
                artworks={newCreationArtworks}
                onDetailClick={() => { }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="collection-page__content">
        <div className="collection-page__filters">
          <h2 className="collection-page__section-title">Key works</h2>

          <div className="collection-page__filter-tabs">
            <button
              className={`filter-tab ${activeFilter === 'all' ? 'filter-tab--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            {/* Filters temporarily disabled until backend supports categories */}
          </div>
        </div>

        {filteredArtworks.length > 0 && (
          <>
            <div
              className="collection-page__grid"

            >
              {/* eslint-disable-next-line react-hooks/refs */}
              {filteredArtworks.map((artwork, index) => {
                const rowSpan = artworkRowSpans[index] || 40;
                // Check if image was already loaded before (for instant display on back)
                const wasLoaded = artwork.image ? loadedImagesRef.current.has(artwork.image) : false;

                return (
                  <Link
                    key={artwork.id}
                    href={`/collection/${getLocalizedSlug(artwork, locale)}`}
                    scroll={false}
                    state={{ backgroundLocation: location }}
                    className="artwork-card-grid"
                    style={{
                      gridRowEnd: `span ${rowSpan}`
                    }}
                  >
                    <div className="artwork-card-grid__image">
                      {artwork.image && (
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          // If already loaded before, show instantly with 'loaded' class
                          className={wasLoaded ? 'loaded instant' : ''}
                          onLoad={(e) => {
                            e.currentTarget.classList.add('loaded');
                            // Track this image as loaded
                            if (artwork.image) {
                              loadedImagesRef.current.add(artwork.image);
                            }


                          }}
                          // Don't lazy load if returning to page (images in viewport)
                          loading={isReturnVisitRef.current ? 'eager' : 'lazy'}
                        />
                      )}
                      <div className="artwork-card-grid__overlay">
                        <div className="artwork-card-grid__info">
                          <div className="artwork-card-grid__artist">
                            {artwork.artistAvatar ? (
                              <img src={artwork.artistAvatar} alt={artwork.artist} />
                            ) : (
                              <div className="artwork-card-grid__artist-placeholder">
                                {artwork.artist.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="artwork-card-grid__text">
                            <span className="artwork-card-grid__artist-name">{artwork.artist}</span>
                            <span className="artwork-card-grid__artwork-count">
                              {artwork.artistArtworkCount > 0
                                ? `${artwork.artistArtworkCount} artworks`
                                : 'View artworks'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Loading skeleton for next page */}
              {isFetchingNextPage && hasNextPage && (
                <>
                  {Array.from({ length: Math.min(LIMIT, totalItems - artworks.length) }).map((_, index) => {
                    const rowSpan = getSkeletonRowSpan(index + artworks.length);

                    return (
                      <div
                        key={`loading-skeleton-${index}`}
                        className="skeleton-grid-item"
                        style={{
                          background: SKELETON_COLORS[index % SKELETON_COLORS.length],
                          gridRowEnd: `span ${rowSpan}`
                        }}
                      >
                        <div className="skeleton-image"></div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Sentinel element for Intersection Observer */}
            <div
              ref={sentinelRef}
              style={{ height: 1, width: '100%' }}
              aria-hidden="true"
            />

            {!hasNextPage && artworks.length > 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6B2128',
                fontSize: '14px',
                borderTop: '1px solid #e0e0e0',
                marginTop: '40px'
              }}>
                ✨ You&apos;ve reached the end
              </div>
            )}
          </>
        )}

        {filteredArtworks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B2128' }}>
            <p>No artworks found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
