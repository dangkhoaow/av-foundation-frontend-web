/**
 * Design System - Spacing Tokens
 * Consistent spacing scale for margins, padding, and gaps
 */

export const spacing = {
  // Spacing scale (8px base unit)
  0: '0',
  1: '4px',     // 0.25rem
  2: '8px',     // 0.5rem
  3: '12px',    // 0.75rem
  4: '16px',    // 1rem
  5: '20px',    // 1.25rem
  6: '24px',    // 1.5rem
  7: '28px',    // 1.75rem
  8: '32px',    // 2rem
  10: '40px',   // 2.5rem
  12: '48px',   // 3rem
  14: '56px',   // 3.5rem
  16: '64px',   // 4rem
  20: '80px',   // 5rem
  24: '96px',   // 6rem
  28: '112px',  // 7rem
  30: '120px',  // 7.5rem
  32: '128px',  // 8rem
  40: '160px',  // 10rem
  48: '192px',  // 12rem
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Component spacing
  component: {
    xs: spacing[2],
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
    xl: spacing[12],
  },

  // Section spacing
  section: {
    sm: spacing[16],
    md: spacing[20],
    lg: spacing[24],
    xl: spacing[32],
  },

  // Layout spacing
  layout: {
    sidebar: '80px',       // Standard sidebar width
    header: '80px',        // Standard header height
    container: spacing[6], // Container padding
  },

  // Card spacing
  card: {
    padding: {
      sm: spacing[4],
      md: spacing[6],
      lg: spacing[8],
    },
    gap: {
      sm: spacing[3],
      md: spacing[4],
      lg: spacing[6],
    },
  },
} as const;

// CSS Variable generator helper
export const getCSSVariables = () => {
  const vars: Record<string, string> = {};
  
  // Base spacing scale
  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });
  
  // Semantic spacing
  vars['--spacing-component-xs'] = semanticSpacing.component.xs;
  vars['--spacing-component-sm'] = semanticSpacing.component.sm;
  vars['--spacing-component-md'] = semanticSpacing.component.md;
  vars['--spacing-component-lg'] = semanticSpacing.component.lg;
  vars['--spacing-component-xl'] = semanticSpacing.component.xl;
  
  vars['--spacing-section-sm'] = semanticSpacing.section.sm;
  vars['--spacing-section-md'] = semanticSpacing.section.md;
  vars['--spacing-section-lg'] = semanticSpacing.section.lg;
  vars['--spacing-section-xl'] = semanticSpacing.section.xl;
  
  vars['--layout-sidebar-width'] = semanticSpacing.layout.sidebar;
  vars['--layout-header-height'] = semanticSpacing.layout.header;
  vars['--layout-container-padding'] = semanticSpacing.layout.container;
  
  return vars;
};

export type SpacingToken = typeof spacing;
export type SemanticSpacingToken = typeof semanticSpacing;

