/**
 * News Page - Client Component
 * List all news articles with search and load more
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newsAPI, getNewsImageUrl, formatNewsDate, getNewsTitle, getNewsExcerpt, type NewsArticle as APINewsArticle } from '@/lib/api';
import { useLocale } from 'next-intl';
import './NewsPage.css';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string;
}

export function NewsClient() {
  const locale = useLocale();
  const language = locale === 'en' ? 'en' : 'vi';
  const [searchTerm, setSearchTerm] = useState('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 12;

  // Fetch initial news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setInitialLoading(true);
        const response = await newsAPI.getAll(1, limit);
        
        if (response.success && response.data) {
          const mappedNews: NewsArticle[] = response.data.data.map((news: APINewsArticle) => ({
            id: news.id,
            title: getNewsTitle(news, language),
            excerpt: getNewsExcerpt(news, language) || news.content?.substring(0, 150) + '...' || '',
            featuredImage: getNewsImageUrl(news.featuredImage),
            publishedAt: news.publishedAt || news.createdAt,
          }));
          
          setNewsArticles(mappedNews);
          setTotalItems(response.data.meta.total);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchNews();
  }, [language]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Reset to initial data
      try {
        const response = await newsAPI.getAll(1, limit);
        if (response.success && response.data) {
          const mappedNews: NewsArticle[] = response.data.data.map((news: APINewsArticle) => ({
            id: news.id,
            title: getNewsTitle(news, language),
            excerpt: getNewsExcerpt(news, language) || news.content?.substring(0, 150) + '...' || '',
            featuredImage: getNewsImageUrl(news.featuredImage),
            publishedAt: news.publishedAt || news.createdAt,
          }));
          setNewsArticles(mappedNews);
          setTotalItems(response.data.meta.total);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error resetting news:', error);
      }
      return;
    }

    try {
      const response = await newsAPI.search(searchTerm, 1, limit);
      if (response.success && response.data) {
        const mappedNews: NewsArticle[] = response.data.data.map((news: APINewsArticle) => ({
          id: news.id,
          title: getNewsTitle(news, language),
          excerpt: getNewsExcerpt(news, language) || news.content?.substring(0, 150) + '...' || '',
          featuredImage: getNewsImageUrl(news.featuredImage),
          publishedAt: news.publishedAt || news.createdAt,
        }));
        setNewsArticles(mappedNews);
        setTotalItems(response.data.meta.total);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching news:', error);
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = searchTerm.trim()
        ? await newsAPI.search(searchTerm, nextPage, limit)
        : await newsAPI.getAll(nextPage, limit);
      
      if (response.success && response.data) {
        const mappedNews: NewsArticle[] = response.data.data.map((news: APINewsArticle) => ({
          id: news.id,
          title: getNewsTitle(news, language),
          excerpt: getNewsExcerpt(news, language) || news.content?.substring(0, 150) + '...' || '',
          featuredImage: getNewsImageUrl(news.featuredImage),
          publishedAt: news.publishedAt || news.createdAt,
        }));
        
        setNewsArticles(prev => [...prev, ...mappedNews]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = currentPage * limit < totalItems;

  // Show loading skeleton
  if (initialLoading) {
    return (
      <div className="news-page">
        <div className="news-page__container">
          <div className="news-page__header">
            <h1 className="news-page__title">A&V News</h1>
            <div className="news-page__search">
              <input type="text" placeholder="Tìm kiếm" disabled />
              <button disabled>TÌM KIẾM</button>
            </div>
          </div>
          <div className="news-page__list">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={`skeleton-${index}`} className="news-item skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-text-line"></div>
                <div className="skeleton-text-line short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-page__container">
        <div className="news-page__header">
          <h1 className="news-page__title">A&V News</h1>
          
          <div className="news-page__actions">
            <div className="news-page__search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button 
                className="news-page__search-button"
                onClick={handleSearch}
                aria-label="Search"
              >
                Search
              </button>
            </div>
            
            <button className="news-page__filter" aria-label="Filter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 7H21M6 12H18M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {newsArticles.length === 0 && (
          <div className="news-page__empty">
            <p>No news articles found.</p>
          </div>
        )}
        
        {newsArticles.length > 0 && (
          <>
            <div className="news-page__list">
              {newsArticles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="news-item-row"
                >
                  <div className="news-item-row__image">
                    {article.featuredImage ? (
                      <img src={article.featuredImage} alt={article.title} />
                    ) : (
                      <div className="news-item-row__image-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="news-item-row__content">
                    <div className="news-item-row__text">
                      <h3 className="news-item-row__title">{article.title}</h3>
                      <p className="news-item-row__description">
                        {article.excerpt}
                      </p>
                      
                      <button className="news-item-row__link">
                        VIEW DETAIL
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    <span className="news-item-row__date">{formatNewsDate(article.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="news-page__load-more">
                <button 
                  className="news-page__load-more-button"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'LOAD MORE'}
                </button>
              </div>
            )}

            {!hasMore && totalItems > 0 && (
              <div className="news-page__total">
                Showing all {totalItems} news article{totalItems !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

