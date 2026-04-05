import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/av-foundation-frontend-web/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'next-intl': path.resolve(__dirname, 'src/i18n/next-intl.ts'),
      'next-intl/server': path.resolve(__dirname, 'src/i18n/next-intl-server.ts'),
      'next/link': path.resolve(__dirname, 'src/routing/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, 'src/routing/next-navigation.ts'),
      'next/image': path.resolve(__dirname, 'src/routing/next-image.tsx'),
      'next/font/google': path.resolve(__dirname, 'src/routing/next-font-google.ts'),
    },
  },
});
