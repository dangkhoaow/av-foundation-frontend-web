'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data sẽ được coi là "fresh" trong 5 phút
            staleTime: 5 * 60 * 1000,
            // Cache sẽ được giữ trong 30 phút
            gcTime: 30 * 60 * 1000,
            // Không refetch khi window focus lại
            refetchOnWindowFocus: false,
            // ApiClient already retries retryable requests with backoff.
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}



