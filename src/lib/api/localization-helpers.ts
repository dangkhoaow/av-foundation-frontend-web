/**
 * Localization Helpers for API
 * Helper functions to get localized fields from API responses
 */

import { Locale } from '@/i18n/config';

/**
 * Get localized field value from an object
 * Priority: 1. i18n.[locale].[field]  2. [field]En  3. [field] (default)
 */
export function getLocalizedField<T = string>(
  obj: Record<string, any>,
  fieldName: string,
  locale: Locale
): T {
  if (locale === 'en') {
    // First try i18n structure (new consolidated approach)
    if (obj.i18n?.en?.[fieldName] !== null && obj.i18n?.en?.[fieldName] !== undefined) {
      return obj.i18n.en[fieldName] as T;
    }
    // Fallback to legacy *En fields (for backward compatibility)
    const enField = `${fieldName}En`;
    if (obj[enField] !== null && obj[enField] !== undefined) {
      return obj[enField] as T;
    }
  }
  return obj[fieldName] as T;
}

/**
 * Get localized title from API object
 */
export function getLocalizedTitle(obj: Record<string, any>, locale: Locale): string {
  return getLocalizedField(obj, 'title', locale);
}

/**
 * Get localized content from API object
 */
export function getLocalizedContent(obj: Record<string, any>, locale: Locale): string {
  return getLocalizedField(obj, 'content', locale);
}

/**
 * Get localized excerpt from API object
 */
export function getLocalizedExcerpt(obj: Record<string, any>, locale: Locale): string | null {
  return getLocalizedField(obj, 'excerpt', locale);
}

/**
 * Get localized author from API object
 */
export function getLocalizedAuthor(obj: Record<string, any>, locale: Locale): string | null {
  return getLocalizedField(obj, 'author', locale);
}

/**
 * Get localized category from API object
 */
export function getLocalizedCategory(obj: Record<string, any>, locale: Locale): string | null {
  return getLocalizedField(obj, 'category', locale);
}

/**
 * Get localized description from API object
 */
export function getLocalizedDescription(obj: Record<string, any>, locale: Locale): string | null {
  return getLocalizedField(obj, 'description', locale);
}

/**
 * Get localized name from API object
 */
export function getLocalizedName(obj: Record<string, any>, locale: Locale): string {
  return getLocalizedField(obj, 'name', locale);
}

/**
 * Get localized bio from API object
 */
export function getLocalizedBio(obj: Record<string, any>, locale: Locale): string | null {
  return getLocalizedField(obj, 'bio', locale);
}

// ═══════════════════════════════════════════════════════════════════
// SEO HELPERS - For generating multilingual metadata
// ═══════════════════════════════════════════════════════════════════

/**
 * Get localized SEO title with fallback to regular title
 */
export function getLocalizedSeoTitle(obj: Record<string, any>, locale: Locale): string {
  // Try SEO title first
  const seoTitle = getLocalizedField<string | null>(obj, 'seoTitle', locale);
  if (seoTitle) return seoTitle;

  // Fallback to regular title
  return getLocalizedField(obj, 'title', locale) || '';
}

/**
 * Get localized SEO description with fallback to description/excerpt
 */
export function getLocalizedSeoDescription(obj: Record<string, any>, locale: Locale): string | null {
  // Try SEO description first
  const seoDesc = getLocalizedField<string | null>(obj, 'seoDescription', locale);
  if (seoDesc) return seoDesc;

  // Fallback to regular description
  const desc = getLocalizedField<string | null>(obj, 'description', locale);
  if (desc) return desc;

  // Fallback to excerpt
  return getLocalizedField<string | null>(obj, 'excerpt', locale);
}

/**
 * Get localized SEO keywords
 */
export function getLocalizedSeoKeywords(obj: Record<string, any>, locale: Locale): string[] {
  if (locale === 'en') {
    const enKeywords = obj['seoKeywordsEn'];
    if (enKeywords && Array.isArray(enKeywords) && enKeywords.length > 0) {
      return enKeywords;
    }
  }
  return obj['seoKeywords'] || [];
}

/**
 * Get OpenGraph image URL with fallback to primary image
 */
export function getOgImage(obj: Record<string, any>): string | null {
  return obj['ogImage'] || obj['image'] || null;
}

/**
 * Get localized slug for URL generation
 * Priority: 1. slugEn (if locale is en) 2. slug (if locale is vi) 3. fallback to id
 */
export function getLocalizedSlug(obj: { id: string, slug?: string | null, slugEn?: string | null }, locale: Locale): string {
  if (locale === 'en' && obj.slugEn) {
    return obj.slugEn;
  }
  if (locale === 'vi' && obj.slug) {
    return obj.slug;
  }
  // Fallback: try the other slug if current locale slug is missing
  const fallbackSlug = obj.slug || obj.slugEn;
  if (fallbackSlug) return fallbackSlug;

  return obj.id;
}


