/**
 * Design System - Typography Tokens
 * Font families, sizes, weights, and line heights
 */

export const typography = {
  // Font Families
  fontFamily: {
    heading: "'Big Caslon', serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Monaco', 'Courier New', monospace",
  },

  // Font Sizes
  fontSize: {
    // Display sizes
    display: {
      xl: '80px',   // Hero titles
      lg: '60px',   // Section headers
      md: '48px',
      sm: '36px',
    },
    
    // Heading sizes
    heading: {
      h1: '48px',
      h2: '36px',
      h3: '30px',
      h4: '24px',
      h5: '20px',
      h6: '18px',
    },
    
    // Body text
    body: {
      xl: '20px',
      lg: '18px',
      md: '16px',   // Base size
      sm: '14px',
      xs: '12px',
    },
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// CSS Variable generator helper
export const getCSSVariables = () => {
  return {
    '--font-heading': typography.fontFamily.heading,
    '--font-body': typography.fontFamily.body,
    '--font-mono': typography.fontFamily.mono,
    
    '--text-display-xl': typography.fontSize.display.xl,
    '--text-display-lg': typography.fontSize.display.lg,
    '--text-display-md': typography.fontSize.display.md,
    '--text-display-sm': typography.fontSize.display.sm,
    
    '--text-h1': typography.fontSize.heading.h1,
    '--text-h2': typography.fontSize.heading.h2,
    '--text-h3': typography.fontSize.heading.h3,
    '--text-h4': typography.fontSize.heading.h4,
    '--text-h5': typography.fontSize.heading.h5,
    '--text-h6': typography.fontSize.heading.h6,
    
    '--text-body-xl': typography.fontSize.body.xl,
    '--text-body-lg': typography.fontSize.body.lg,
    '--text-body-md': typography.fontSize.body.md,
    '--text-body-sm': typography.fontSize.body.sm,
    '--text-body-xs': typography.fontSize.body.xs,
    
    '--font-weight-light': typography.fontWeight.light.toString(),
    '--font-weight-regular': typography.fontWeight.regular.toString(),
    '--font-weight-medium': typography.fontWeight.medium.toString(),
    '--font-weight-semibold': typography.fontWeight.semibold.toString(),
    '--font-weight-bold': typography.fontWeight.bold.toString(),
    
    '--line-height-none': typography.lineHeight.none.toString(),
    '--line-height-tight': typography.lineHeight.tight.toString(),
    '--line-height-normal': typography.lineHeight.normal.toString(),
    '--line-height-relaxed': typography.lineHeight.relaxed.toString(),
    '--line-height-loose': typography.lineHeight.loose.toString(),
  };
};

export type TypographyToken = typeof typography;

