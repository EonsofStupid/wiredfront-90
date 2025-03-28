
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

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
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const useErrorBoundary = () => {
  const DefaultErrorFallback = () => (
    <div className="flex flex-col items-center justify-center p-4 text-destructive">
      <AlertCircle className="h-8 w-8 mb-2" />
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="text-center text-sm text-muted-foreground mt-1">
        Please try again or refresh the page
      </p>
    </div>
  );

  return {
    ErrorBoundary: ErrorBoundaryComponent,
    DefaultErrorFallback
  };
};
