import { AlertTriangle } from "lucide-react";
import React from "react";
import { ErrorBoundary as BaseErrorBoundary } from "../../../components/error/ErrorBoundary";
import { Button } from "../../../components/ui/button";

interface MobileErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const MobileErrorFallback = ({ error, resetErrorBoundary }: MobileErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-dark text-white">
      <div className="w-full max-w-md mobile-glass-card">
        <div className="flex flex-col items-center space-y-4 p-4">
          <AlertTriangle className="h-12 w-12 text-neon-pink" />
          <h2 className="text-xl font-bold text-center">Something went wrong</h2>
          <p className="text-sm text-center opacity-80">
            {error.message || "An unexpected error occurred in the mobile app"}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={resetErrorBoundary}
              className="mobile-button"
            >
              Try again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="mobile-button-outline"
            >
              Reload app
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MobileErrorBoundaryProps {
  children: React.ReactNode;
}

export const MobileErrorBoundary = ({ children }: MobileErrorBoundaryProps) => {
  return (
    <BaseErrorBoundary
      FallbackComponent={MobileErrorFallback}
      onReset={() => {
        // When the error boundary resets, we could perform additional cleanup
        console.log("Mobile error boundary reset");
      }}
    >
      {children}
    </BaseErrorBoundary>
  );
};
