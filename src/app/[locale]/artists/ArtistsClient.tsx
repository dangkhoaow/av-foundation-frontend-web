/**
 * Artists Page - Client Component
 * Regular grid with infinite scroll, search with debounce, and lazy loading
 * Uses TanStack Query for caching - data persists when navigating back
 */

'use client';

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { artistsAPI, getArtistImageUrl, type Artist as APIArtist } from '@/lib/api';
import { withBasePath } from '@/lib/assets';
import './ArtistsPage.css';

interface Artist {
  id: string;
  fullName: string;
  portraitImage: string | null;
  artworksCount: number;
}

// Skeleton colors - Subtle tints for elegant art gallery feel (matching Collection page)
const SKELETON_COLORS = [
  'linear-gradient(135deg, #F5F2EE 0%, #EBE5DD 100%)',  // Warm cream
  'linear-gradient(135deg, #F2EFE8 0%, #E8E3D8 100%)',  // Soft sand
  'linear-gradient(135deg, #F0EDE6 0%, #E5E0D5 100%)',  // Light taupe
  'linear-gradient(135deg, #EEE8E0 0%, #E3DBD0 100%)',  // Pale stone
  'linear-gradient(135deg, #F3F0E8 0%, #E8E2D5 100%)',  // Antique white
  'linear-gradient(135deg, #F1ECE3 0%, #E6DFD2 100%)',  // Champagne
];

// Limit for pagination - 24 items per page
const LIMIT = 24;

// Key for storing scroll position
const SCROLL_POSITION_KEY = 'artists_scroll_position';
// Key for storing loaded images
const LOADED_IMAGES_KEY = 'artists_loaded_images';
// Key for storing search term
const SEARCH_TERM_KEY = 'artists_search_term';

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

// Get saved search term from sessionStorage
const getSavedSearchTerm = (): string => {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(SEARCH_TERM_KEY) || '';
};

// Map API artist to local Artist type
const mapArtist = (artist: APIArtist): Artist => ({
  id: artist.id,
  fullName: artist.fullName,
  portraitImage: getArtistImageUrl(artist.portraitImage),
  artworksCount: artist.artworksCount || 0,
});

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function ArtistsClient() {
  const [searchTerm, setSearchTerm] = useState<string>(() => getSavedSearchTerm());
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Track loaded images to skip animation on back navigation
  const loadedImagesRef = useRef<Set<string>>(getLoadedImages());
  // Check if this is a return visit (has cached data)
  const isReturnVisitRef = useRef<boolean>(false);

  // Debounce search term - 500ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Save search term to sessionStorage
      sessionStorage.setItem(SEARCH_TERM_KEY, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // TanStack Query - useInfiniteQuery for infinite scroll with caching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['artists', debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const response = debouncedSearchTerm.trim()
        ? await artistsAPI.search(debouncedSearchTerm, pageParam, LIMIT)
        : await artistsAPI.getAll(pageParam, LIMIT);

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch artists');
      }

      return {
        artists: response.data.data.map(mapArtist),
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

  // Flatten all pages into single artists array
  const artists = useMemo(() => {
    return data?.pages.flatMap(page => page.artists) ?? [];
  }, [data]);

  // Get total items from first page meta
  const totalItems = data?.pages[0]?.meta.total ?? 0;

  // Restore scroll position when coming back from detail page
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition && artists.length > 0) {
      // Mark as return visit to skip fade-in animations
      isReturnVisitRef.current = true;
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        // Clear after restoring
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
      });
    }
  }, [artists.length]);

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

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    sessionStorage.removeItem(SEARCH_TERM_KEY);
  };

  // Skeleton loading component with shimmer effect
  const renderSkeletonLoading = () => (
    <div className="artists-page">
      <div className="artists-page__container">
        <div className="artists-page__header">
          <h1 className="artists-page__title">Artists</h1>
          <div className="artists-page__search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input type="text" placeholder="Tìm kiếm" disabled />
          </div>
        </div>
        <div className="artists-page__grid">
          {Array.from({ length: LIMIT }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="artist-card skeleton-grid-item"
              style={{
                background: SKELETON_COLORS[index % SKELETON_COLORS.length],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Show loading skeleton during initial load
  if (isLoading) {
    return renderSkeletonLoading();
  }

  // Error state - show skeleton loading instead of error message
  if (isError) {
    return renderSkeletonLoading();
  }

  return (
    <div className="artists-page">
      <div className="artists-page__container">
        <div className="artists-page__header">
          <h1 className="artists-page__title">Artists</h1>

          <div className="artists-page__search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="artists-page__search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {(isFetching && !isLoading) && (
              <span className="artists-page__search-spinner" />
            )}
          </div>
        </div>

        {artists.length === 0 && !isFetching && (
          <div className="artists-page__empty">
            <p>Không tìm thấy nghệ sĩ nào{searchTerm ? ` với từ khóa "${searchTerm}"` : ''}.</p>
          </div>
        )}

        {artists.length > 0 && (
          <>
            <div className="artists-page__grid">
              {artists.map((artist, index) => {
                // Check if image was already loaded before (for instant display on back)
                const wasLoaded = artist.id ? loadedImagesRef.current.has(artist.id) : false;

                return (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.id}`}
                    className="artist-card"
                  >
                    <div className="artist-card__image">
                      <img
                        src={artist.portraitImage || withBasePath(`/images/artists/portrait-${(index % 4) + 1}.jpg`)}
                        alt={artist.fullName}
                        // If already loaded before, show instantly with 'loaded' class
                        className={wasLoaded ? 'loaded instant' : ''}
                        onLoad={(e) => {
                          e.currentTarget.classList.add('loaded');
                          // Track this image as loaded
                          if (artist.id) {
                            loadedImagesRef.current.add(artist.id);
                          }
                        }}
                        // Don't lazy load if returning to page (images in viewport)
                        loading={isReturnVisitRef.current ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="artist-card__overlay">
                      <div className="artist-card__info">
                        <h3 className="artist-card__name">{artist.fullName}</h3>
                        <div className="artist-card__badge">
                          <p className="artist-card__count">{artist.artworksCount} Tác phẩm</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Loading skeleton for next page */}
              {isFetchingNextPage && hasNextPage && (
                <>
                  {Array.from({ length: Math.min(LIMIT, totalItems - artists.length) }).map((_, index) => (
                    <div
                      key={`loading-skeleton-${index}`}
                      className="artist-card skeleton-grid-item"
                      style={{
                        background: SKELETON_COLORS[index % SKELETON_COLORS.length],
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Sentinel element for Intersection Observer */}
            <div
              ref={sentinelRef}
              style={{ height: 1, width: '100%' }}
              aria-hidden="true"
            />

            {!hasNextPage && artists.length > 0 && (
              <div className="artists-page__end-message">
                ✨ Bạn đã xem hết {totalItems} nghệ sĩ
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
