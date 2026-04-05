/**
 * Design System - Color Tokens
 * Single source of truth for all colors in the application
 */

export const colors = {
  // Brand Colors
  brand: {
    burgundy: {
      DEFAULT: '#6B2128',
      light: '#8B3138',
      dark: '#4B1118',
      hover: '#5A1B21',
    },
    beige: {
      DEFAULT: '#F2EFE7',
      light: '#F8F6F3',
      dark: '#E8E5DC',
    },
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      100: '#F4F3F1', // Community Support background
      200: '#E5E4E2',
      300: '#D1D0CE',
      400: '#A8A7A5',
      500: '#7E7D7B',
      600: '#5A5958',
      700: '#3A3938',
      800: '#2E2E2E', // Primary text color
      900: '#1A1A1A',
    },
  },

  // Text Colors
  text: {
    primary: '#2E2E2E',
    secondary: '#5A5958',
    tertiary: '#7E7D7B',
    inverse: '#FFFFFF',
    burgundy: '#6B2128',
  },

  // Background Colors
  background: {
    main: '#F2EFE7',
    card: '#F4F3F1',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    header: 'rgba(242, 239, 231, 0.95)',
  },

  // Border Colors
  border: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    burgundy: '#6B2128',
  },

  // Status Colors (for future use)
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

// CSS Variable generator helper
export const getCSSVariables = () => {
  return {
    '--color-burgundy': colors.brand.burgundy.DEFAULT,
    '--color-burgundy-light': colors.brand.burgundy.light,
    '--color-burgundy-dark': colors.brand.burgundy.dark,
    '--color-burgundy-hover': colors.brand.burgundy.hover,
    '--color-beige': colors.brand.beige.DEFAULT,
    '--color-beige-light': colors.brand.beige.light,
    '--color-beige-dark': colors.brand.beige.dark,
    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--color-text-tertiary': colors.text.tertiary,
    '--color-text-inverse': colors.text.inverse,
    '--color-text-burgundy': colors.text.burgundy,
    '--color-bg-main': colors.background.main,
    '--color-bg-card': colors.background.card,
    '--color-bg-white': colors.background.white,
    '--color-bg-overlay': colors.background.overlay,
    '--color-bg-header': colors.background.header,
    '--color-border-light': colors.border.light,
    '--color-border-medium': colors.border.medium,
    '--color-border-dark': colors.border.dark,
    '--color-border-burgundy': colors.border.burgundy,
  };
};

export type ColorToken = typeof colors;

