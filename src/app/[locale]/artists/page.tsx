import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArtistsClient } from './ArtistsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.artists' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ArtistsPage() {
  return <ArtistsClient />;
}

