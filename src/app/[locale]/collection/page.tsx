import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CollectionClient } from './CollectionClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.collection' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CollectionPage() {
  return <CollectionClient />;
}

