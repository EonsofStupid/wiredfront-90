import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import React from 'react';
import { toast } from 'sonner';

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ChatErrorBoundary({ children, fallback }: ChatErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log the error with chat-specific context
    console.error('Chat component error:', {
      error,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Show a user-friendly error message
    toast.error('Chat Error', {
      description: 'There was a problem with the chat component. Please try refreshing the page.',
      duration: 5000,
    });
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        fallback || (
          <div className="p-4 bg-destructive/10 rounded-lg">
            <h3 className="text-destructive font-semibold mb-2">
              Chat Component Error
            </h3>
            <p className="text-sm text-muted-foreground">
              Something went wrong with the chat component. Please try refreshing the page.
            </p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
