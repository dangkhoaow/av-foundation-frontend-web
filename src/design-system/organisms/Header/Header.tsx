/**
 * Organism Component - Header
 * Main navigation header for Next.js App Router
 * Responsive: Mobile (logo + hamburger) | Desktop (full nav)
 * Client Component (needs usePathname, useState for mobile menu)
 */

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Logo } from '../../atoms/Logo';
import { Icon } from '../../atoms/Icon';
import { MobileMenu } from '../MobileMenu';
import './Header.css';

interface NavItem {
  label: string;
  path: string;
  translationKey: string;
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: t('home'), path: `/${locale}`, translationKey: 'home' },
    { label: t('collection'), path: `/${locale}/collection`, translationKey: 'collection' },
    { label: t('artists'), path: `/${locale}/artists`, translationKey: 'artists' },
    { label: t('events'), path: `/${locale}/events`, translationKey: 'events' },
    { label: t('news'), path: `/${locale}/news`, translationKey: 'news' },
    { label: t('knowledge'), path: `/${locale}/knowledge`, translationKey: 'knowledge' },
  ];

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <header className="ds-header">
        <div className="ds-header__container">
          {/* MOBILE: Logo (left) */}
          <Logo 
            className="ds-header__logo" 
            size="sm" 
            linkToHome={true}
            priority={true}
          />

          {/* DESKTOP: Navigation (center-right) */}
          <nav className="ds-header__nav">
            {navItems.map((item) => (
              <Link
                key={item.translationKey}
                href={item.path}
                className={`ds-header__nav-item ${
                  isActiveRoute(item.path) ? 'ds-header__nav-item--active' : ''
                }`}
              >
                <span className="ds-header__nav-text">{item.label}</span>
                <div className="ds-header__nav-underline"></div>
              </Link>
            ))}
          </nav>


          {/* MOBILE: Hamburger (right) */}
          <button 
            className="ds-header__hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name="menu" size="md" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        currentPath={pathname}
      />
    </>
  );
}

export default Header;
