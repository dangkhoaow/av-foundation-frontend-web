/**
 * NewsEventsClient Component
 * Client Component for horizontal scrolling interactions
 */

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/design-system/molecules/Card';
import { Icon } from '@/design-system/atoms/Icon';
export interface NewsEvent {
  id: string; // Changed from number to string (UUID)
  title: string;
  description: string;
  image: string;
  slug: string;
}

interface NewsEventsClientProps {
  events: NewsEvent[];
}

export function NewsEventsClient({ events }: NewsEventsClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 769; // 737px card width + 32px gap
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

  return (
    <div className="news-events__content">
      <div className="news-events__grid" ref={scrollContainerRef}>
        {events.map((event) => (
          <Link href={`/events/${event.slug}`} key={event.id} className="news-card-link">
            <Card className="news-card" padding="none">
              <Card.Image
                src={event.image}
                alt={event.title}
                aspectRatio="16/9"
                className="news-card__image"
              />
              <div className="news-card__content">
                <h3 className="news-card__title">
                  {event.title}
                </h3>
                <p className="news-card__description">
                  {event.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
        <div className="news-events__spacer"></div>
      </div>

      <div className="news-events__footer">
        <button className="news-events__view-all">
          <span>VIEW ALL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="news-events__navigation">
          <button
            className="news-events__nav-button"
            onClick={() => scroll('left')}
            aria-label="Previous"
          >
            <Icon name="chevron-left" size="lg" />
          </button>
          <button
            className="news-events__nav-button"
            onClick={() => scroll('right')}
            aria-label="Next"
          >
            <Icon name="chevron-right" size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
