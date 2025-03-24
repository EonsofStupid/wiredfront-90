
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('UI Error caught by boundary:', { error, errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

// Default fallback component for error boundaries
const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="p-4 border border-destructive/30 rounded-md bg-destructive/10 text-destructive">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <h3 className="font-medium">Something went wrong</h3>
      </div>
      <p className="text-sm mb-3">{error?.message || 'An unexpected error occurred'}</p>
      {resetErrorBoundary && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetErrorBoundary}
          className="mt-2"
        >
          Try again
        </Button>
      )}
    </div>
  );
};

export function useErrorBoundary() {
  return {
    ErrorBoundary: ErrorBoundaryComponent,
    DefaultErrorFallback
  };
}
