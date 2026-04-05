import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
// ... imports
import {
  HeroWithContent,
  ArtCollection,
  CommunitySupport,
  NewsEvents,
  AVNews
} from '@/components/sections';

// ... metadata function

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      {/* Hero Section - Overlapping content box between hero and sections */}
      <HeroWithContent />

      {/* Art Collection Section (CMS Driven) */}
      <ArtCollection locale={locale as 'vi' | 'en'} />

      {/* Community Support Timeline */}
      <CommunitySupport />

      {/* A&V Foundation Events Section */}
      <NewsEvents locale={locale as 'vi' | 'en'} />

      {/* A&V News Grid */}
      <AVNews />
    </>
  );
}
