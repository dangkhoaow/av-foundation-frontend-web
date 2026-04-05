import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsDetailClient from '@/app/[locale]/news/[id]/NewsDetailClient';
import { newsAPI, getNewsTitle, getNewsExcerpt, getNewsContent, getNewsImageUrl, type NewsArticle } from '@/lib/api/news';
import { withBasePath } from '@/lib/assets';
import { useLocale } from '@/i18n/LocaleProvider';

const splitParagraphs = (text: string): string[] => {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
};

export function NewsDetailPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchArticle = async () => {
      if (!slug) {
        setError('Missing news slug.');
        setIsLoading(false);
        return;
      }

      try {
        console.info('[NewsDetail] Fetching news', { slug });
        setIsLoading(true);
        setError(undefined);
        const response = await newsAPI.getById(slug);

        if (!isActive) return;
        setArticle(response);
        setIsLoading(false);
        console.info('[NewsDetail] News loaded', { newsId: response.id });
      } catch (fetchError) {
        if (!isActive) return;
        console.error('[NewsDetail] Failed to load news', { error: fetchError });
        setError('Failed to load news.');
        setArticle(null);
        setIsLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isActive = false;
    };
  }, [slug]);

  const viewModel = useMemo(() => {
    if (!article) return null;

    const title = getNewsTitle(article, locale);
    const subtitle = getNewsExcerpt(article, locale) || '';
    const contentText = getNewsContent(article, locale);
    const heroImage = getNewsImageUrl(article.featuredImage) || withBasePath('/images/news-detail/hero-1.jpg');
    const contentImage = heroImage || withBasePath('/images/news-detail/content-1.jpg');
    const paragraphs = splitParagraphs(contentText);
    const midPoint = Math.max(1, Math.ceil(paragraphs.length / 2));

    return {
      id: article.id,
      title,
      subtitle,
      heroImage,
      contentImage,
      content: paragraphs.slice(0, midPoint),
      contentBottom: paragraphs.slice(midPoint),
    };
  }, [article, locale]);

  if (isLoading) {
    return <div className="news-detail-page">Loading...</div>;
  }

  if (!viewModel || error) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-container">
          <div className="news-detail-error">
            <h2>News Not Found</h2>
            <p>{error || 'The news article you are looking for could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return <NewsDetailClient article={viewModel} />;
}
