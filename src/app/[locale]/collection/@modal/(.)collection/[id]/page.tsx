/**
 * Intercepting Route for Artwork Detail Modal
 * Shows artwork detail as modal overlay when navigating from collection page
 * Collection page stays mounted in the background
 */

import { ArtworkModal } from './ArtworkModal';
import { artworksAPI } from '@/lib/api';

interface ModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArtworkModalPage({ params }: ModalPageProps) {
  const { id } = await params;
  
  try {
    const artwork = await artworksAPI.getById(id);
    return <ArtworkModal artwork={artwork} />;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return <ArtworkModal artwork={null} error="Failed to load artwork" />;
  }
}



