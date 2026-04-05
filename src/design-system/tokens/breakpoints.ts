/**
 * Design System - Breakpoint Tokens
 * Responsive design breakpoints
 */

export const breakpoints = {
  // Pixel values
  values: {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1440,
    xxl: 1920,
  },

  // Media query strings
  media: {
    xs: '(min-width: 320px)',
    sm: '(min-width: 480px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1440px)',
    xxl: '(min-width: 1920px)',
  },

  // Max-width media queries (for mobile-first)
  maxMedia: {
    xs: '(max-width: 479px)',
    sm: '(max-width: 767px)',
    md: '(max-width: 1023px)',
    lg: '(max-width: 1439px)',
    xl: '(max-width: 1919px)',
    xxl: '(max-width: 2559px)',
  },

  // Semantic breakpoints
  semantic: {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    widescreen: '(min-width: 1440px)',
  },
} as const;

// Helper function to generate media queries
export const mediaQuery = {
  up: (breakpoint: keyof typeof breakpoints.values) => {
    return `@media ${breakpoints.media[breakpoint]}`;
  },
  down: (breakpoint: keyof typeof breakpoints.values) => {
    return `@media ${breakpoints.maxMedia[breakpoint]}`;
  },
  between: (
    min: keyof typeof breakpoints.values,
    max: keyof typeof breakpoints.values
  ) => {
    return `@media (min-width: ${breakpoints.values[min]}px) and (max-width: ${breakpoints.values[max] - 1}px)`;
  },
  only: (breakpoint: 'mobile' | 'tablet' | 'desktop' | 'widescreen') => {
    return `@media ${breakpoints.semantic[breakpoint]}`;
  },
};

// CSS Variable generator helper
export const getCSSVariables = () => {
  return {
    '--breakpoint-xs': `${breakpoints.values.xs}px`,
    '--breakpoint-sm': `${breakpoints.values.sm}px`,
    '--breakpoint-md': `${breakpoints.values.md}px`,
    '--breakpoint-lg': `${breakpoints.values.lg}px`,
    '--breakpoint-xl': `${breakpoints.values.xl}px`,
    '--breakpoint-xxl': `${breakpoints.values.xxl}px`,
  };
};

export type BreakpointToken = typeof breakpoints;

