
import React, { useState, useCallback, ReactNode } from 'react';
import { logger } from '@/services/chat/LoggingService';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('Component error caught by boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const DefaultErrorFallback = useCallback(() => (
    <div className="p-3 text-center">
      <div className="text-destructive mb-1">⚠️</div>
      <div className="text-sm font-medium text-destructive">Something went wrong</div>
      <div className="text-xs text-muted-foreground mt-1">
        Please try again or refresh the page
      </div>
    </div>
  ), []);

  const ErrorBoundary = useCallback(({ children, fallback }: ErrorBoundaryProps) => {
    return (
      <ErrorBoundaryComponent fallback={fallback}>
        {children}
      </ErrorBoundaryComponent>
    );
  }, []);

  return {
    error,
    setError,
    ErrorBoundary,
    DefaultErrorFallback
  };
}
