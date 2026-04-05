/**
 * Root Layout
 * This file only exists to satisfy Next.js requirements
 * All actual layout logic is in [locale]/layout.tsx
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
