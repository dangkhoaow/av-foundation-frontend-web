import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import './KnowledgePage.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.knowledge' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

const articles: Article[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Kiến thức nghệ thuật ${i + 1}`,
  excerpt: 'Lorem ipsum dolor sit amet consectetur. Massa auctor justo lorem dictumst.',
  image: `/images/knowledge/article-${(i % 4) + 1}.jpg`,
  date: '15/11/2024',
}));

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'knowledge' });
  
  return (
    <div className="knowledge-page">
      <div className="knowledge-page__container">
        <h1 className="knowledge-page__title">{t('title')}</h1>
        
        <div className="knowledge-page__grid">
          {articles.map((article) => (
            <Link 
              key={article.id}
              href={`/${locale}/knowledge/${article.id}`}
              className="knowledge-card"
            >
              <div className="knowledge-card__image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="knowledge-card__content">
                <h3 className="knowledge-card__title">{article.title}</h3>
                <p className="knowledge-card__excerpt">{article.excerpt}</p>
                <span className="knowledge-card__date">{article.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

