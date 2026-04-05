import { useParams } from 'react-router-dom';
import { ArtworkModal } from '@/app/[locale]/collection/@modal/(.)[id]/ArtworkModal';

export function ArtworkModalRoute() {
  const { artworkKey } = useParams();

  if (!artworkKey) {
    return null;
  }

  return <ArtworkModal artworkId={artworkKey} />;
}
