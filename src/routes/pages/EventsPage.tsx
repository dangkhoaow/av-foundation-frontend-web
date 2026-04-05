import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, getEventTitle, getEventDescription, getEventImageUrl, type Event } from '@/lib/api/events';
import { withBasePath } from '@/lib/assets';
import { Card } from '@/design-system/molecules/Card';
import { useLocale, useTranslations } from '@/i18n/LocaleProvider';
import '@/app/[locale]/events/EventsPage.css';

export function EventsPage() {
  const locale = useLocale();
  const t = useTranslations('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchEvents = async () => {
      try {
        console.info('[EventsPage] Fetching events', { locale });
        setIsLoading(true);
        const response = await eventsAPI.getAll(1, 100, 'startDate', 'desc');
        if (!isActive) return;
        setEvents(response.data?.data || []);
        console.info('[EventsPage] Events loaded', { count: response.data?.data?.length || 0 });
      } catch (error) {
        if (!isActive) return;
        console.error('[EventsPage] Failed to fetch events', { error });
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

  return (
    <div className="events-page">
      <div className="events-page__container">
        <h1 className="events-page__title">{t('title')}</h1>

        {isLoading ? (
          <div className="events-page__empty">
            <p>Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="events-page__empty">
            <p>{t('noEvents') || 'No events found.'}</p>
          </div>
        ) : (
          <div className="events-page__grid">
            {events.map((event) => {
              const title = getEventTitle(event, locale);
              const description = getEventDescription(event, locale);
              const image = getEventImageUrl(event.featuredImage) || withBasePath('/images/placeholders/event-placeholder.jpg');

              return (
                <Link
                  key={event.id}
                  to={`/${locale}/events/${event.slug}`}
                  className="event-card-link"
                >
                  <Card className="event-card" padding="none">
                    <Card.Image
                      src={image}
                      alt={title}
                      aspectRatio="16/9"
                    />

                    <div className="event-card__content">
                      <h2 className="event-card__title">{title}</h2>
                      <p className="event-card__description">{description}</p>

                      <div className="event-card__footer">
                        <span className="event-card__link-text">
                          DETAIL
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
