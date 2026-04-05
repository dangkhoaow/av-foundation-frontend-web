/**
 * AVNews Component
 * Client Component - Fetches latest news from public API
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography } from '@/design-system/atoms/Typography';
import { newsAPI, getNewsTitle, getNewsExcerpt, type NewsArticle } from '@/lib/api/news';
import { useLocale } from 'next-intl';
import './AVNews.css';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export function AVNews() {
  const locale = useLocale();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchNews = async () => {
      try {
        console.info('[AVNews] Fetching news', { locale });
        setIsLoading(true);
        const response = await newsAPI.getAll(1, 5, 'date', 'desc');
        if (!isActive || !response.success || !response.data) return;

        const items = response.data.data.map((news: NewsArticle) => ({
          id: news.id,
          slug: news.slug,
          title: getNewsTitle(news, locale === 'en' ? 'en' : 'vi'),
          description: getNewsExcerpt(news, locale === 'en' ? 'en' : 'vi'),
        }));

        setNewsItems(items);
        console.info('[AVNews] News loaded', { count: items.length });
      } catch (error) {
        if (!isActive) return;
        console.error('[AVNews] Failed to fetch news', { error });
        setNewsItems([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchNews();

    return () => {
      isActive = false;
    };
  }, [locale]);

  return (
    <section className="av-news section">
      <div className="container">
        <Typography variant="display-lg" as="h2" className="av-news__title">
          A&V News
        </Typography>

        {isLoading ? (
          <div className="av-news__grid">
            <div className="news-item">Loading...</div>
          </div>
        ) : (
          <div className="av-news__grid">
            {newsItems.map((item) => (
              <div key={item.id} className="news-item">
                <div className="news-item__content">
                  <Typography variant="h3" as="h3" className="news-item__title">
                    {item.title}
                  </Typography>
                  <Typography variant="body-md" className="news-item__description">
                    {item.description}
                  </Typography>
                </div>

                <Link href={`/news/${item.slug}`} className="news-item__link">
                  <span>XEM CHI TIẾT</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="av-news__footer">
          <Link href="/news" className="av-news__view-all">
            <span>VIEW ALL</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AVNews;

