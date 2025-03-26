import React, { Component, ErrorInfo, ReactNode, useState, useCallback } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Error caught by boundary', { 
      error: error.message, 
      stack: error.stack,
      component: errorInfo.componentStack 
    });
    
    this.setState({
      errorInfo
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (React.isValidElement(this.props.fallback)) {
        return React.cloneElement(this.props.fallback as React.ReactElement<any>, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetErrorBoundary?: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10">
      <h3 className="text-sm font-medium mb-2">Something went wrong</h3>
      {error && (
        <p className="text-xs text-muted-foreground mb-3">{error.message}</p>
      )}
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="text-xs px-2 py-1 bg-primary/80 text-primary-foreground rounded hover:bg-primary transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export function useErrorBoundary() {
  const [key, setKey] = useState(0);
  
  const resetBoundary = useCallback(() => {
    setKey(prev => prev + 1);
    toast.success('Component recovered successfully');
    logger.info('Error boundary reset', { timestamp: new Date().toISOString() });
  }, []);
  
  return {
    ErrorBoundary: ErrorBoundaryComponent,
    DefaultErrorFallback,
    resetBoundary,
    boundaryKey: key
  };
}
