/**
 * HeroWithContent Component
 * Combines Hero's responsive background with MuseumCard's content box
 * Next.js optimized - Server Component with next/image
 */

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import './HeroWithContent.css';

interface HeroWithContentProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function HeroWithContent({
  title,
  description,
  buttonText,
  buttonHref,
}: HeroWithContentProps) {
  const t = useTranslations('hero');
  
  return (
    <section className="hero-with-content">
      {/* Part 1: Hero Background with next/image */}
      <div className="hero-with-content__hero-section">
        <div className="hero-with-content__background">
          <Image
            src="/images/hero/1440/hero-1440.jpg"
            alt="Museum gallery interior with classical sculptures and elegant architecture"
            fill
            priority
            sizes="100vw"
            className="hero-with-content__bg-image"
            quality={90}
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-with-content__overlay"></div>
        </div>
      </div>

      {/* Part 2: Content Box - Overlaps between hero and empty space */}
      <div className="hero-with-content__content-box">
        <h2 className="hero-with-content__title">{title || t('title')}</h2>
        <p className="hero-with-content__description">{description || t('description')}</p>
        <Link href={buttonHref || '/about'} className="hero-with-content__explore-button">
          <span>{buttonText || t('buttonText')}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Part 3: Empty space below */}
      <div className="hero-with-content__empty-space"></div>
    </section>
  );
}

export default HeroWithContent;

