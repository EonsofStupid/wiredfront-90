
import React, { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/auth/AuthProvider';
import { ChatBridgeProvider } from '@/modules/ChatBridge';
import { ModeProvider } from '@/modules/ModeManager';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders centralizes all application-level providers
 * This makes it easier to manage which providers wrap the application
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ChatBridgeProvider>
            <ModeProvider>
              {children}
              <Toaster />
              <Sonner />
            </ModeProvider>
          </ChatBridgeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
