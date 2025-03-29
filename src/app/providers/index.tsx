
import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ChatBridgeProvider } from '@/modules/ChatBridge/ChatBridgeProvider';
import { FeatureProvider } from './FeatureProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders wraps the application with all necessary providers
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FeatureProvider>
          <ChatBridgeProvider>
            {children}
            <Toaster position="top-right" />
            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
          </ChatBridgeProvider>
        </FeatureProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
