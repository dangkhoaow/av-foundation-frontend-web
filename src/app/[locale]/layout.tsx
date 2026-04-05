import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header } from '@/design-system/organisms/Header/Header';
import { Footer } from '@/design-system/organisms/Footer/Footer';
import { Sidebar } from '@/design-system/organisms/Sidebar/Sidebar';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { QueryProvider } from '@/lib/providers';
import { locales } from '@/i18n/config';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Art & Venture Foundation',
    template: '%s | Art & Venture Foundation',
  },
  description: 'Discover art collections, community support programs, partnerships, and cultural events at Art & Venture Foundation',
  keywords: ['art', 'museum', 'gallery', 'contemporary art', 'exhibitions', 'cultural events', 'vietnamese art', 'art foundation', 'AV Foundation'],
  authors: [{ name: 'Art & Venture Foundation' }],
  creator: 'Art & Venture Foundation',
  publisher: 'Art & Venture Foundation',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://avfoundation.vn'),
  
  // Favicon & Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // Manifest for PWA
  manifest: '/site.webmanifest',
  
  // Theme & App
  applicationName: 'Art & Venture Foundation',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AV Foundation',
  },
  formatDetection: {
    telephone: false,
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Art & Venture Foundation',
    description: 'Discover art collections, community support programs, partnerships, and cultural events at Art & Venture Foundation',
    siteName: 'Art & Venture Foundation',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Art & Venture Foundation',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Art & Venture Foundation',
    description: 'Discover art collections, community support programs, partnerships, and cultural events',
    images: ['/og-image.png'],
    creator: '@avfoundation',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Other
  category: 'art',
  other: {
    'msapplication-TileColor': '#1a1a1a',
    'msapplication-config': '/browserconfig.xml',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <div className="app with-header with-footer with-sidebar">
              {/* Left Sidebar with logo, scroll progress, and language toggle */}
              <Sidebar />
              
              {/* Header with navigation */}
              <Header />
              
              {/* Main content area */}
              <main className="main-content">
                {children}
              </main>
              
              {/* Footer - Shared across all pages */}
              <Footer />
              
              {/* Scroll to top button - Client Component */}
              <ScrollToTop />
            </div>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

