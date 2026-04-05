import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsAPI, getEventTitle, getEventDescription, getEventExcerpt, getEventImageUrl, type Event } from '@/lib/api/events';
import { useLocale } from '@/i18n/LocaleProvider';
import '@/app/[locale]/events/[id]/EventDetailPage.css';

const splitParagraphs = (text: string): string[] => {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
};

export function EventDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchEvent = async () => {
      if (!slug) {
        setError('Missing event slug.');
        setIsLoading(false);
        return;
      }

      try {
        console.info('[EventDetail] Fetching event', { slug });
        setIsLoading(true);
        setError(undefined);
        const response = await eventsAPI.getById(slug);

        if (!isActive) return;
        setEvent(response);
        setIsLoading(false);
        console.info('[EventDetail] Event loaded', { eventId: response.id });
      } catch (fetchError) {
        if (!isActive) return;
        console.error('[EventDetail] Failed to load event', { error: fetchError });
        setError('Failed to load event.');
        setEvent(null);
        setIsLoading(false);
      }
    };

    fetchEvent();

    return () => {
      isActive = false;
    };
  }, [slug]);

  const viewModel = useMemo(() => {
    if (!event) return null;

    const title = getEventTitle(event, locale);
    const subtitle = getEventExcerpt(event, locale) || getEventDescription(event, locale);
    const description = getEventDescription(event, locale);
    const heroImage = getEventImageUrl(event.featuredImage) || '/images/event-detail/hero-1.jpg';

    return {
      title,
      subtitle,
      heroImage,
      content: splitParagraphs(description),
      contentImage: heroImage,
      contentBottom: splitParagraphs(subtitle),
    };
  }, [event, locale]);

  if (isLoading) {
    return <div className="event-detail-page">Loading...</div>;
  }

  if (!viewModel || error) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-container">
          <div className="event-detail-error">
            <h2>Event Not Found</h2>
            <p>{error || 'The event you are looking for could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        {/* Back Button */}
        <Link to={`/${locale}/events`} className="event-detail-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Header */}
        <div className="event-detail-header">
          <h1 className="event-detail-title">{viewModel.title}</h1>
          {viewModel.subtitle && <p className="event-detail-subtitle">{viewModel.subtitle}</p>}
        </div>

        {/* Hero Image */}
        <div className="event-detail-hero">
          <img src={viewModel.heroImage} alt={viewModel.title} />
        </div>

        {/* Content Section 1 */}
        <div className="event-detail-content">
          {viewModel.content.map((paragraph, index) => (
            <p key={index} className="event-detail-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Content Image */}
        <div className="event-detail-image">
          <img src={viewModel.contentImage} alt="Event detail" />
        </div>

        {/* Content Section 2 */}
        <div className="event-detail-content">
          {viewModel.contentBottom.map((paragraph, index) => (
            <p key={index} className="event-detail-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
