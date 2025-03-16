
import React from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Create a component wrapper with error boundary for token-related components
export function withTokenErrorBoundary<P extends object>(Component: React.ComponentType<P>) {
  return function TokenErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
            <h3 className="font-medium mb-2">Token System Error</h3>
            <p className="text-sm mb-4">{error.message}</p>
            <button 
              onClick={resetErrorBoundary}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
