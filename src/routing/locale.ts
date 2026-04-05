import { defaultLocale, locales } from '@/i18n/config';

export const isExternalLink = (href: string) => {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:');
};

export const withLocale = (href: string, locale: string = defaultLocale) => {
  if (isExternalLink(href) || href.startsWith('#')) {
    return href;
  }

  if (href.startsWith(`/${locale}`)) {
    return href;
  }

  if (href.startsWith('/')) {
    return `/${locale}${href}`;
  }

  return href;
};

export const stripLocale = (path: string) => {
  const localeMatch = locales.find((locale) => path === `/${locale}` || path.startsWith(`/${locale}/`));
  if (!localeMatch) return path;
  return path.replace(`/${localeMatch}`, '') || '/';
};
