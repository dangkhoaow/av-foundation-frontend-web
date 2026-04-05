import { useEffect } from 'react';
import { HeroWithContent, ArtCollection, CommunitySupport, NewsEvents, AVNews } from '@/components/sections';
import { useLocale } from '@/i18n/LocaleProvider';

export function HomePage() {
  const locale = useLocale();

  useEffect(() => {
    console.info('[HomePage] Rendering with locale', { locale });
  }, [locale]);

  return (
    <>
      <HeroWithContent />
      <ArtCollection locale={locale} />
      <CommunitySupport />
      <NewsEvents locale={locale} />
      <AVNews />
    </>
  );
}
