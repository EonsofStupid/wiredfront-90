
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class GitHubErrorBoundary extends React.Component<GitHubErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GitHub component error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Default fallback UI if no custom fallback is provided
      const defaultFallback = (
        <div className="p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-medium mb-1">GitHub Tab Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            There was an error loading GitHub information.
          </p>
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={this.resetErrorBoundary}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-xs"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );

      return this.props.fallback || defaultFallback;
    }

    return this.props.children;
  }
}
