/**
 * Grid Calculations Utility
 * Utilities for calculating CSS Grid masonry layout with row spans
 */

// Grid configuration constants
export const GRID_CONFIG = {
  ROW_HEIGHT: 10,           // Base row unit (px)
  COLUMN_GAP: 24,           // Gap between columns (px)
  VERTICAL_SPACING: 24,     // Desired space between cards (px)
  COLUMNS_MOBILE: 1,        // 1 column on mobile
  COLUMNS_DESKTOP: 2,       // 2 columns on desktop+
  MIN_ROWS: 1,              // Minimum rows - very small to avoid forcing extra space
  MAX_ROWS: 200,            // Maximum rows (2000px)
  DEFAULT_ROWS: 40,         // Default when no dimensions (400px)
} as const;

/**
 * Calculate row span for an item based on image dimensions
 */
export function calculateRowSpan(
  imageWidth?: number | null,
  imageHeight?: number | null,
  columnWidth: number = 500
): number {
  if (!imageWidth || !imageHeight) {
    return GRID_CONFIG.DEFAULT_ROWS;
  }

  const aspectRatio = imageHeight / imageWidth;
  const displayHeight = columnWidth * aspectRatio;
  const totalHeight = displayHeight + GRID_CONFIG.VERTICAL_SPACING;
  
  let rowSpan = Math.ceil(totalHeight / GRID_CONFIG.ROW_HEIGHT);
  rowSpan = Math.max(GRID_CONFIG.MIN_ROWS, Math.min(GRID_CONFIG.MAX_ROWS, rowSpan));
  
  return rowSpan;
}

/**
 * Get column width based on viewport width and breakpoints
 * NOTE: This function expects FULL VIEWPORT WIDTH (not content area)
 * to match CSS media query breakpoints exactly.
 * Padding values MUST match breakpoints.css exactly!
 * 
 * @param viewportWidth - Full viewport width (or content area width if no sidebar)
 * @param sidebarWidth - Width of sidebar (default 0). Will be subtracted from result.
 */
export function getColumnWidth(viewportWidth: number, sidebarWidth: number = 0): number {
  // Adjust viewport for sidebar AFTER determining breakpoint
  const contentWidth = viewportWidth - sidebarWidth;
  // Mobile: < 768px (16px each side = 32px total)
  if (viewportWidth < 768) {
    const MOBILE_PADDING = 32;
    return contentWidth - MOBILE_PADDING;
  }
  
  // Tablet: 768px - 1023px (20px each side = 40px total)
  if (viewportWidth < 1024) {
    const TABLET_PADDING = 40;
    const availableWidth = contentWidth - TABLET_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Desktop: 1024px - 1439px (80px each side = 160px total)
  if (viewportWidth < 1440) {
    const DESKTOP_PADDING = 160;
    const availableWidth = contentWidth - DESKTOP_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Wide: 1440px - 1679px (188px each side = 376px total)
  if (viewportWidth < 1680) {
    const WIDE_PADDING = 376;
    const availableWidth = contentWidth - WIDE_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Large: 1680px - 1919px (80px each side = 160px total)
  if (viewportWidth < 1920) {
    const LARGE_PADDING = 160;
    const availableWidth = contentWidth - LARGE_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Ultra: 1920px - 2199px (131px each side = 262px total)
  if (viewportWidth < 2200) {
    const ULTRA_PADDING = 262;
    const availableWidth = contentWidth - ULTRA_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Extra Large: 2200px - 2559px (171px each side = 342px total)
  if (viewportWidth < 2560) {
    const XL_PADDING = 342;
    const availableWidth = contentWidth - XL_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Super Large: 2560px - 3439px (220px each side = 440px total)
  if (viewportWidth < 3440) {
    const XXL_PADDING = 440;
    const availableWidth = contentWidth - XXL_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // Ultra Wide: 3440px - 3839px (300px each side = 600px total)
  if (viewportWidth < 3840) {
    const ULTRA_WIDE_PADDING = 600;
    const availableWidth = contentWidth - ULTRA_WIDE_PADDING;
    return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
  }
  
  // 4K: >= 3840px (350px each side = 700px total)
  const FOUR_K_PADDING = 700;
  const availableWidth = contentWidth - FOUR_K_PADDING;
  return (availableWidth - GRID_CONFIG.COLUMN_GAP) / GRID_CONFIG.COLUMNS_DESKTOP;
}

/**
 * Debounce helper for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}


