/**
 * Design System - Tokens Index
 * Export all design tokens
 */

// Export specific items from each module to avoid naming conflicts
export { colors } from './colors';
export type { ColorToken } from './colors';

export { typography } from './typography';
export type { TypographyToken } from './typography';

export { spacing, semanticSpacing } from './spacing';
export type { SpacingToken, SemanticSpacingToken } from './spacing';

export { breakpoints, mediaQuery } from './breakpoints';
export type { BreakpointToken } from './breakpoints';

// Re-export getCSSVariables with specific names to avoid conflicts
export { getCSSVariables as getColorCSSVariables } from './colors';
export { getCSSVariables as getTypographyCSSVariables } from './typography';
export { getCSSVariables as getSpacingCSSVariables } from './spacing';
export { getCSSVariables as getBreakpointCSSVariables } from './breakpoints';

