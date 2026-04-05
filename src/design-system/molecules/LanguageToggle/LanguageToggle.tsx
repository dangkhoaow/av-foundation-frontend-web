/**
 * Molecule Component - LanguageToggle
 * Language switcher component using design system
 */

import React from 'react';
import './LanguageToggle.css';

export type Language = 'en' | 'vi';

export interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div className={`ds-language-toggle ${className}`}>
      <button
        className={`ds-language-toggle__option ${
          currentLanguage === 'en' ? 'ds-language-toggle__option--active' : ''
        }`}
        onClick={() => onLanguageChange('en')}
        aria-label="Switch to English"
        aria-pressed={currentLanguage === 'en'}
      >
        EN
      </button>
      <span className="ds-language-toggle__divider">/</span>
      <button
        className={`ds-language-toggle__option ${
          currentLanguage === 'vi' ? 'ds-language-toggle__option--active' : ''
        }`}
        onClick={() => onLanguageChange('vi')}
        aria-label="Switch to Vietnamese"
        aria-pressed={currentLanguage === 'vi'}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageToggle;

