import { describe, it, expect } from 'vitest';
import { withLocale, stripLocale, isExternalLink } from './locale';

describe('locale routing helpers', () => {
  it('prefixes locale for internal paths', () => {
    expect(withLocale('/news', 'vi')).toBe('/vi/news');
  });

  it('keeps locale if already present', () => {
    expect(withLocale('/en/news', 'en')).toBe('/en/news');
  });

  it('ignores external links', () => {
    expect(isExternalLink('https://example.com')).toBe(true);
    expect(withLocale('https://example.com', 'vi')).toBe('https://example.com');
  });

  it('strips locale from path', () => {
    expect(stripLocale('/vi/news')).toBe('/news');
    expect(stripLocale('/en')).toBe('/');
  });
});
