import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NewsClient } from './NewsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.news' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function NewsPage() {
  return <NewsClient />;
}

