import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'next/link': path.resolve(__dirname, 'src/routing/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, 'src/routing/next-navigation.ts'),
      'next/image': path.resolve(__dirname, 'src/routing/next-image.tsx'),
      'next/font/google': path.resolve(__dirname, 'src/routing/next-font-google.ts'),
      'next-intl': path.resolve(__dirname, 'src/i18n/next-intl.ts'),
      'next-intl/server': path.resolve(__dirname, 'src/i18n/next-intl-server.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
  },
});
