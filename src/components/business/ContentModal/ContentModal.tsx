/**
 * ContentModal Component
 * Modal for displaying detailed content (News, Events, Artwork, etc.)
 * Client Component - Uses state and event handlers
 */

'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/design-system/atoms/Button';
import { Icon } from '@/design-system/atoms/Icon';
import { Typography } from '@/design-system/atoms/Typography';
import './ContentModal.css';

export type ModalSize = 'small' | 'medium' | 'large';
export type ModalType = 'news' | 'event' | 'artwork' | 'artist' | 'knowledge';
export type ModalVariant = 'light' | 'dark';

export interface AuthorCardData {
  avatar: string;
  name: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  type?: ModalType;
  variant?: ModalVariant;
  imageUrl?: string;
  title: string;
  description: string;
  expandedContent?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  showAuthorCard?: boolean;
  authorData?: AuthorCardData;
}

export function ContentModal({
  isOpen,
  onClose,
  size = 'medium',
  type = 'news',
  variant = 'light',
  imageUrl,
  title,
  description,
  expandedContent,
  ctaText = 'DETAIL',
  onCtaClick,
  showAuthorCard = false,
  authorData,
}: ContentModalProps) {
  // State for author card expansion
  const [isAuthorExpanded, setIsAuthorExpanded] = React.useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Also lock html for some browsers
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Reset expansion state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsAuthorExpanded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`content-modal-backdrop content-modal-backdrop--${variant}`}
        onClick={onClose}
      />

      {/* Close Button - Fixed position for dark variant */}
      <button
        className={`content-modal__close content-modal__close--${variant}`}
        onClick={onClose}
        aria-label="Close modal"
      >
        <Icon name="close" size="md" />
      </button>

      {/* Modal */}
      <div className={`content-modal content-modal--${size} content-modal--${variant}`}>
        <div className="content-modal__container">
          {/* Image - only show if imageUrl is provided */}
          {imageUrl && (
            <div className={`content-modal__image ${type === 'artwork' ? 'content-modal__image--artwork' : ''}`}>
              {/* Using standard img tag to bypass Next.js Image Optimization issues with localhost */}
              <img
                src={imageUrl}
                alt={title}
                className="content-modal__image-element"
                style={{
                  objectFit: type === 'artwork' ? 'contain' : 'cover',
                  width: '100%',
                  height: '100%',
                  backgroundColor: type === 'artwork' ? '#000' : 'transparent'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="content-modal__content">
            <div className="content-modal__text-content">
              <Typography variant="h3" as="h2" className="content-modal__title">
                {title}
              </Typography>

              <Typography variant="body-md" className="content-modal__description">
                {description}
              </Typography>

              {/* Expanded Content - for larger modals */}
              {expandedContent && !showAuthorCard && (
                <Typography
                  variant="body-md"
                  className="content-modal__expanded-content"
                >
                  {expandedContent}
                </Typography>
              )}
            </div>

            {/* Author Card - for dark variant */}
            {showAuthorCard && authorData && (
              <div className="content-modal__author-card">
                <div className="content-modal__author-info">
                  <img
                    src={authorData.avatar}
                    alt={authorData.name}
                    className="content-modal__author-avatar"
                  />
                  <div className="content-modal__author-details">
                    <p className="content-modal__author-name">{authorData.name}</p>
                    {(authorData.email || authorData.phone) && (
                      <p className="content-modal__author-contact">
                        {authorData.email}{authorData.email && authorData.phone && ' - '}{authorData.phone}
                      </p>
                    )}
                  </div>
                  {authorData.socialLinks && (
                    <div className="content-modal__author-social">
                      {authorData.socialLinks.facebook && (
                        <a href={authorData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <Icon name="share" size="sm" />
                        </a>
                      )}
                      {authorData.socialLinks.instagram && (
                        <a href={authorData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <Icon name="share" size="sm" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* More/Less Toggle Button */}
                <button
                  className="content-modal__author-more"
                  onClick={() => setIsAuthorExpanded(!isAuthorExpanded)}
                >
                  <span>{isAuthorExpanded ? 'Less' : 'More'}</span>
                  <div className={`content-modal__chevron ${isAuthorExpanded ? 'content-modal__chevron--rotated' : ''}`}>
                    <Icon name="chevron-down" size="sm" />
                  </div>
                </button>

                {/* Expanded Content */}
                {isAuthorExpanded && expandedContent && (
                  <div className="content-modal__author-expanded">
                    <div className="content-modal__author-expanded-content">
                      <Typography variant="body-md" className="content-modal__author-expanded-title">
                        Mauris in convallis interdum facilisis platea sapien.
                      </Typography>
                      <Typography variant="body-sm" className="content-modal__author-expanded-text">
                        {expandedContent}
                      </Typography>
                      <Typography variant="body-sm" className="content-modal__author-expanded-text">
                        Lorem ipsum dolor sit amet consectetur. Vitae sed iaculis urna posuere. Elit aliquam diam nulla id massa volutpat molestie vitae. Ipsum at mauris ornare dui. Tortor tincidunt at amet dictum.
                      </Typography>
                    </div>

                    {/* DETAIL Button */}
                    <button
                      className="content-modal__author-detail-btn"
                      onClick={onCtaClick || onClose}
                    >
                      <span>DETAIL</span>
                      <Icon name="arrow-right" size="md" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CTA Button - for light variant */}
            {!showAuthorCard && ctaText && (
              <div className="content-modal__actions">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onCtaClick || onClose}
                >
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContentModal;
