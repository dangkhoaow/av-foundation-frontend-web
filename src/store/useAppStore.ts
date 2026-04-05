/**
 * Global App Store - Zustand Implementation for Next.js
 * Client-side only store (no persist for SSR compatibility)
 */

'use client';

import { create } from 'zustand';

export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark';

interface AppState {
  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  // Language
  language: 'en',
  setLanguage: (language) => set({ language }),

  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // UI State
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Selectors for optimized re-renders
export const useLanguage = () => useAppStore((state) => state.language);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSearchQuery = () => useAppStore((state) => state.searchQuery);
export const useIsLoading = () => useAppStore((state) => state.isLoading);

export default useAppStore;
