import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArtistDetailClient } from '@/app/[locale]/artists/[id]/ArtistDetailClient';
import { artistsAPI, type ArtistDetail } from '@/lib/api';

export function ArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchArtist = async () => {
      if (!id) {
        setError('Missing artist id.');
        setIsLoading(false);
        console.warn('[ArtistDetail] Missing artist id', { id });
        return;
      }

      try {
        console.info('[ArtistDetail] Fetching artist', { id });
        setIsLoading(true);
        setError(undefined);
        const response = await artistsAPI.getById(id);

        if (!isActive) return;

        if (!response || !response.id) {
          setError('Failed to load artist.');
          setArtist(null);
          setIsLoading(false);
          console.error('[ArtistDetail] Invalid artist response', { id, response });
          return;
        }

        setArtist(response);
        setIsLoading(false);
        console.info('[ArtistDetail] Artist loaded', { artistId: response.id });
      } catch (fetchError) {
        if (!isActive) return;
        console.error('[ArtistDetail] Failed to load artist', { error: fetchError });
        setError('Failed to load artist.');
        setArtist(null);
        setIsLoading(false);
      }
    };

    fetchArtist();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (isLoading) {
    return <div className="artist-detail-page">Loading...</div>;
  }

  if (!artist || error) {
    return (
      <div className="artist-detail-page">
        <div className="artist-detail-error">
          <h2>Artist Not Found</h2>
          <p>{error || 'The artist you are looking for could not be found.'}</p>
        </div>
      </div>
    );
  }

  return <ArtistDetailClient artist={artist} />;
}
