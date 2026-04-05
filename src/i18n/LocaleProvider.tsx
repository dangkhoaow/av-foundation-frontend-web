import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { defaultLocale, type Locale } from './config';
import viMessages from '@/messages/vi.json';
import enMessages from '@/messages/en.json';
import { resolveMessage, type Messages } from './utils';

const messageCatalog: Record<Locale, Messages> = {
  vi: viMessages,
  en: enMessages,
};

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const messages = messageCatalog[locale] || messageCatalog[defaultLocale];

  const value = useMemo<LocaleContextValue>(() => {
    const t = (key: string) => {
      const message = resolveMessage(messages, key);
      if (!message) {
        console.warn('[i18n] Missing translation', { locale, key });
        return key;
      }
      return message;
    };

    return { locale, messages, t };
  }, [locale, messages]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    console.warn('[i18n] LocaleProvider missing, falling back to default locale');
    return defaultLocale;
  }
  return context.locale;
}

export function useTranslations(namespace?: string) {
  const context = useContext(LocaleContext);
  if (!context) {
    return (key: string) => (namespace ? `${namespace}.${key}` : key);
  }

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return context.t(fullKey);
  };
}
