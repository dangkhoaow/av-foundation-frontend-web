import { defaultLocale, type Locale } from './config';
import viMessages from '@/messages/vi.json';
import enMessages from '@/messages/en.json';
import { resolveMessage, type Messages } from './utils';

const messageCatalog: Record<Locale, Messages> = {
  vi: viMessages,
  en: enMessages,
};

export async function getTranslations({
  locale,
  namespace,
}: {
  locale: string;
  namespace?: string;
}) {
  const safeLocale = (locale as Locale) || defaultLocale;
  const messages = messageCatalog[safeLocale] || messageCatalog[defaultLocale];

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = resolveMessage(messages, fullKey);
    if (!message) {
      console.warn('[i18n] Missing translation', { locale: safeLocale, key: fullKey });
      return fullKey;
    }
    return message;
  };
}
