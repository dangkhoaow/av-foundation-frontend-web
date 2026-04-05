import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CollectionDetailClient } from '@/app/[locale]/collection/[id]/CollectionDetailClient';
import { artworksAPI, type Artwork } from '@/lib/api';

export function CollectionDetailPage() {
  const { artworkKey } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchArtwork = async () => {
      if (!artworkKey) {
        setError('Missing artwork id.');
        setIsLoading(false);
        return;
      }

      try {
        console.info('[CollectionDetail] Fetching artwork', { artworkKey });
        setIsLoading(true);
        setError(undefined);
        const response = await artworksAPI.getById(artworkKey);

        if (!isActive) return;

        if (!response.success || !response.data) {
          setError('Failed to load artwork.');
          setArtwork(null);
          setIsLoading(false);
          return;
        }

        setArtwork(response.data);
        setIsLoading(false);
        console.info('[CollectionDetail] Artwork loaded', { artworkId: response.data.id });
      } catch (fetchError) {
        if (!isActive) return;
        console.error('[CollectionDetail] Failed to load artwork', { error: fetchError });
        setError('Failed to load artwork.');
        setArtwork(null);
        setIsLoading(false);
      }
    };

    fetchArtwork();

    return () => {
      isActive = false;
    };
  }, [artworkKey]);

  if (isLoading) {
    return <div className="collection-detail-page">Loading...</div>;
  }

  return <CollectionDetailClient artwork={artwork} error={error} />;
}
