/**
 * Intercepting Route for Artwork Detail Modal
 * Shows artwork detail as modal overlay when navigating from collection page
 * Collection page stays mounted in the background
 * 
 * Uses client-side fetch for instant modal display
 */

import { ArtworkModal } from './ArtworkModal';

interface ModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtworkModalPage({ params }: ModalPageProps) {
  const { id } = await params;
  
  // Pass only the ID, let modal fetch data client-side for instant display
  return <ArtworkModal artworkId={id} />;
}
