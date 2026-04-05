'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { getNewsImageUrl } from '@/lib/api/news';
import './NewsDetailPage.css';

interface NewsDetailClientProps {
    article: {
        id: string;
        title: string;
        subtitle: string;
        heroImage: string;
        contentImage: string;
        content: string[];
        contentBottom: string[];
    };
}

export default function NewsDetailClient({ article }: NewsDetailClientProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxClosing, setLightboxClosing] = useState(false);

    // Combine hero and content images for the gallery
    const images = [
        { url: article.heroImage, alt: article.title },
        { url: article.contentImage, alt: 'Article content image' }
    ].filter(img => img.url);

    const artworkImageRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        if (artworkImageRef.current?.complete) {
            setImageLoaded(true);
        }
    }, [article]);

    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxOpen, lightboxIndex, images.length]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        setLightboxClosing(false);
    };

    const closeLightbox = () => {
        setLightboxClosing(true);
        setTimeout(() => {
            setLightboxOpen(false);
            setLightboxClosing(false);
        }, 300);
    };

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        } else if (direction === 'next' && lightboxIndex < images.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    return (
        <div className="news-detail-page">
            <div className="news-detail-container">
                {/* Header */}
                <div className="news-detail-header-section">
                    {/* Back Button */}
                    <Link href="/news" className="news-detail-back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <div className="news-detail-header">
                        <h1 className="news-detail-title">{article.title}</h1>
                        <p className="news-detail-subtitle">{article.subtitle}</p>
                    </div>
                </div>

                {/* Hero Image */}
                <div
                    className={`news-detail-hero ${imageLoaded ? 'loaded' : ''}`}
                    onClick={() => openLightbox(0)}
                    title="Click to view fullscreen"
                >
                    <img
                        ref={artworkImageRef}
                        src={article.heroImage}
                        alt={article.title}
                        onLoad={() => setImageLoaded(true)}
                        className={imageLoaded ? 'loaded' : 'loading'}
                    />
                </div>

                {/* Content Section 1 */}
                <div className="news-detail-content">
                    {article.content.map((paragraph, index) => (
                        <p key={index} className="news-detail-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Content Image */}
                {article.contentImage && (
                    <div
                        className="news-detail-image-box"
                        onClick={() => openLightbox(1)}
                        title="Click to view fullscreen"
                    >
                        <img src={article.contentImage} alt="News detail" />
                    </div>
                )}

                {/* Content Section 2 */}
                <div className="news-detail-content">
                    {article.contentBottom.map((paragraph, index) => (
                        <p key={index} className="news-detail-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Lightbox Modal */}
                {lightboxOpen && images.length > 0 && (
                    <div
                        className={`news-detail-lightbox ${lightboxClosing ? 'closing' : ''}`}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                closeLightbox();
                            }
                        }}
                    >
                        <button
                            className="news-detail-lightbox-close"
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <button
                            className="news-detail-lightbox-nav news-detail-lightbox-nav--prev"
                            onClick={() => navigateLightbox('prev')}
                            disabled={lightboxIndex === 0}
                            aria-label="Previous image"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            className="news-detail-lightbox-nav news-detail-lightbox-nav--next"
                            onClick={() => navigateLightbox('next')}
                            disabled={lightboxIndex === images.length - 1}
                            aria-label="Next image"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="news-detail-lightbox-content">
                            <img
                                src={images[lightboxIndex]?.url}
                                alt={images[lightboxIndex]?.alt}
                                className="news-detail-lightbox-image"
                            />
                        </div>

                        <div className="news-detail-lightbox-counter">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
