import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { artistsAPI, type ArtistDetail } from '@/lib/api';
import { ArtistDetailClient } from './ArtistDetailClient';

// Generate dynamic metadata based on artist data
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const artist = await artistsAPI.getById(id);
    return {
      title: `${artist.fullName} | Art & Venture Foundation`,
      description: artist.bioSummary || `Tìm hiểu về nghệ sĩ ${artist.fullName} và các tác phẩm của họ`,
      openGraph: {
        title: `${artist.fullName} | Art & Venture Foundation`,
        description: artist.bioSummary || `Tìm hiểu về nghệ sĩ ${artist.fullName}`,
        type: 'profile',
      },
    };
  } catch {
    return {
      title: 'Nghệ sĩ | Art & Venture Foundation',
      description: 'Tìm hiểu về nghệ sĩ và các tác phẩm của họ',
    };
  }
}

interface ArtistDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Artist Detail Page - Server Component
 * Fetches artist data on the server for better SEO and faster initial load
 */
export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { id } = await params;
  
  let artist: ArtistDetail;
  
  try {
    // Fetch artist data on the server
    artist = await artistsAPI.getById(id);
  } catch (error) {
    console.error('Error fetching artist:', error);
    // Show 404 page if artist not found
    notFound();
  }
  
  // Pass pre-fetched data to client component for interactivity
  return <ArtistDetailClient artist={artist} />;
}
