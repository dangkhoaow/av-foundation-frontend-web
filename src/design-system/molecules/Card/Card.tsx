/**
 * Molecule Component - Card
 * Reusable card component for content display
 * Server Component (unless using onClick)
 */

import React from 'react';
import './Card.css';

export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'museum';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

interface CardComposition {
  (props: CardProps): React.ReactElement;
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Image: typeof CardImage;
}

export const Card = ((({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) => {
  const classNames = [
    'ds-card',
    `ds-card--${variant}`,
    `ds-card--padding-${padding}`,
    hoverable && 'ds-card--hoverable',
    onClick && 'ds-card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component className={classNames} onClick={onClick}>
      {children}
    </Component>
  );
}) as unknown) as CardComposition;

// Sub-components for composition
export const CardHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`ds-card__header ${className}`}>{children}</div>;

export const CardBody = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`ds-card__body ${className}`}>{children}</div>;

export const CardFooter = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`ds-card__footer ${className}`}>{children}</div>;

export const CardImage = ({
  src,
  alt,
  aspectRatio = 'auto',
  className = '',
}: {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  className?: string;
}) => (
  <div className={`ds-card__image-container ds-card__image--${aspectRatio} ${className}`}>
    <img src={src} alt={alt} className="ds-card__image" loading="lazy" />
  </div>
);

// Compose Card with sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
