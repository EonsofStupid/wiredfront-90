import { AlertTriangle } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent
          error={this.state.error || new Error('Unknown error')}
          resetErrorBoundary={this.resetErrorBoundary}
        />;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={this.resetErrorBoundary}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
