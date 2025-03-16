
import React, { ErrorInfo, Component, PropsWithChildren } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class TokenErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("Token component error:", error, errorInfo);
  }
  
  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }
      
      return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <h3 className="font-medium mb-2">Token System Error</h3>
          <p className="text-sm mb-4">{this.state.error.message}</p>
          <button 
            onClick={this.resetError}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a component wrapper with error boundary for token-related components
export function withTokenErrorBoundary<P extends object>(Component: React.ComponentType<P>) {
  return function TokenErrorBoundaryWrapper(props: P) {
    return (
      <TokenErrorBoundary>
        <Component {...props} />
      </TokenErrorBoundary>
    );
  };
}
