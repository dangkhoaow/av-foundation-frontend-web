import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { Footer } from '@/design-system/organisms/Footer/Footer';
import { Header } from '@/design-system/organisms/Header/Header';
import { Sidebar } from '@/design-system/organisms/Sidebar/Sidebar';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { QueryProvider } from '@/lib/providers';
import { locales, defaultLocale } from '@/i18n/config';
import { LocaleProvider } from '@/i18n/LocaleProvider';

export function LocaleLayout() {
  const { locale: localeParam } = useParams();
  const location = useLocation();
  const isValidLocale = locales.includes(localeParam as any);
  const locale = isValidLocale ? (localeParam as string) : defaultLocale;

  useEffect(() => {
    document.documentElement.lang = locale;
    console.info('[Locale] Updated document language', { locale });
  }, [locale]);

  if (!isValidLocale) {
    return <Navigate to={`/${defaultLocale}`} replace state={{ from: location.pathname }} />;
  }

  return (
    <LocaleProvider locale={locale}>
      <QueryProvider>
        <div className="app with-header with-footer with-sidebar">
          <Sidebar />
          <Header />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </QueryProvider>
    </LocaleProvider>
  );
}
