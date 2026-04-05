/**
 * Organism Component - Mobile Menu
 * Full-screen overlay menu for mobile navigation
 * Client Component (needs state, animations, event handlers)
 * Design: Burgundy overlay with centered nav items
 */

'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '../../atoms/Icon';
import { useAppStore } from '@/store/useAppStore';
import './MobileMenu.css';

export interface NavItem {
  label: string;
  path: string;
}

export interface MobileMenuProps {
  /**
   * Whether the menu is open
   */
  isOpen: boolean;
  
  /**
   * Callback when menu should close
   */
  onClose: () => void;
  
  /**
   * Navigation items to display
   */
  navItems: NavItem[];
  
  /**
   * Current active path
   */
  currentPath: string;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems,
  currentPath,
}: MobileMenuProps) {
  const { language, setLanguage } = useAppStore();
  
  // Close on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const isActiveRoute = (path: string) => {
    return currentPath === path;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  if (!isOpen) return null;

  return (
    <div className="ds-mobile-menu">
      {/* Full screen overlay */}
      <div className="ds-mobile-menu__overlay">
        {/* Close button - top right */}
        <button
          className="ds-mobile-menu__close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <Icon name="close" size="md" />
        </button>

        {/* Content - centered */}
        <div className="ds-mobile-menu__content">
          {/* Navigation items */}
          <nav className="ds-mobile-menu__nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className={`ds-mobile-menu__nav-item ${
                  isActiveRoute(item.path) ? 'ds-mobile-menu__nav-item--active' : ''
                }`}
                onClick={onClose}
              >
                <span className="ds-mobile-menu__nav-text">{item.label}</span>
                <div className="ds-mobile-menu__nav-underline"></div>
              </Link>
            ))}
          </nav>

          {/* Language toggle */}
          <button 
            className="ds-mobile-menu__language"
            onClick={toggleLanguage}
          >
            <span className="ds-mobile-menu__language-text">
              {language === 'vi' ? 'Vietnamese' : 'English'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
