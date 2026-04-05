import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { defaultLocale } from '@/i18n/config';
import { LocaleLayout } from './LocaleLayout';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { WhoWeArePage } from './pages/WhoWeArePage';
import { ArtworkModalRoute } from './modals/ArtworkModalRoute';
import { NotFoundPage } from './pages/NotFoundPage';

export function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Navigate to={`/${defaultLocale}`} replace />} />
        <Route path="/:locale" element={<LocaleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="collection/:artworkKey" element={<CollectionDetailPage />} />
          <Route path="artists" element={<ArtistsPage />} />
          <Route path="artists/:id" element={<ArtistDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsDetailPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="who-we-are" element={<WhoWeArePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/:locale/collection/:artworkKey" element={<ArtworkModalRoute />} />
        </Routes>
      )}
    </>
  );
}
