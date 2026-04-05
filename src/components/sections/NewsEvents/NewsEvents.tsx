/**
 * NewsEvents Component
 * Horizontal scrolling event cards
 * Client Component - Data fetching
 */

'use client';

import { useEffect, useState } from 'react';
import { eventsAPI, getEventTitle, getEventDescription, getEventImageUrl, type Event } from '@/lib/api/events';
import { withBasePath } from '@/lib/assets';
import { NewsEventsClient } from './NewsEventsClient';
import './NewsEvents.css';

interface NewsEventsProps {
  locale: 'vi' | 'en';
}

export function NewsEvents({ locale }: NewsEventsProps) {
  const [events, setEvents] = useState<
    { id: string; title: string; description: string; image: string; slug: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchEvents = async () => {
      try {
        console.info('[NewsEvents] Fetching events', { locale });
        setIsLoading(true);
        const response = await eventsAPI.getAll(1, 6, 'startDate', 'desc');
        const apiEvents: Event[] = response.data.data;

        if (!isActive) return;

        const mappedEvents = apiEvents.map((event) => ({
          id: event.id,
          title: getEventTitle(event, locale),
          description: getEventDescription(event, locale),
          image: getEventImageUrl(event.featuredImage) || withBasePath('/images/placeholders/event-placeholder.jpg'),
          slug: event.slug,
        }));

        setEvents(mappedEvents);
        console.info('[NewsEvents] Events loaded', { count: mappedEvents.length });
      } catch (error) {
        if (!isActive) return;
        console.error('[NewsEvents] Failed to fetch events', { error });
        setEvents([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isActive = false;
    };
  }, [locale]);

  if (isLoading || events.length === 0) {
    return null;
  }

  return (
    <section className="news-events section">
      <div className="container">
        <h2 className="news-events__title">
          A&V Foundation Events
        </h2>
        <NewsEventsClient events={events} />
      </div>
    </section>
  );
}

export default NewsEvents;
