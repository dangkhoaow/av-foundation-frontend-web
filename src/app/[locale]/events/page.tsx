import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { eventsAPI, getEventTitle, getEventDescription, getEventImageUrl } from '@/lib/api/events';
import { Card } from '@/design-system/molecules/Card';
import './EventsPage.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.events' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });

  // Fetch events from API
  let events: any[] = [];
  try {
    const response = await eventsAPI.getAll(1, 100, 'startDate', 'desc');
    events = response.data.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <div className="events-page">
      <div className="events-page__container">
        <h1 className="events-page__title">{t('title')}</h1>

        {events.length === 0 ? (
          <div className="events-page__empty">
            <p>{t('noEvents') || 'No events found.'}</p>
          </div>
        ) : (
          <div className="events-page__grid">
            {events.map((event) => {
              const title = getEventTitle(event, locale as 'vi' | 'en');
              const description = getEventDescription(event, locale as 'vi' | 'en');
              const image = getEventImageUrl(event.featuredImage) || '/images/placeholders/event-placeholder.jpg';

              return (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.slug}`}
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
