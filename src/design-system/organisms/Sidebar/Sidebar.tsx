/**
 * Organism Component - Sidebar
 * Left sidebar with logo, scroll progress indicator, and language toggle
 * Client Component (needs scroll tracking and locale navigation)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import './Sidebar.css';

export function Sidebar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      // Cancel previous animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const scrolled = window.scrollY;
        
        // Calculate progress (0 to 100)
        const progress = scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Calculate initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        <div className="sidebar__top">
          <Link href={`/${locale}`} className="sidebar__logo" aria-label="Home">
            <Image 
              src="/images/logo/av-logo.svg" 
              alt="AV Foundation" 
              className="sidebar__logo-img"
              width={60}
              height={60}
              priority
            />
          </Link>
        </div>
        
        <div className="sidebar__progress">
          <div 
            className="sidebar__progress-track"
            style={{ 
              // Pass scroll progress as CSS variable for GPU-accelerated transform
              '--scroll-progress': scrollProgress 
            } as React.CSSProperties}
          >
            <div className="sidebar__progress-indicator" />
          </div>
        </div>
        
        <div className="sidebar__bottom">
          <button 
            className="sidebar__language" 
            aria-label="Change language"
            onClick={toggleLanguage}
          >
            <span className="sidebar__language-text">
              {locale === 'vi' ? 'VIE' : 'ENG'}
            </span>
            <div className="sidebar__language-indicator" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

