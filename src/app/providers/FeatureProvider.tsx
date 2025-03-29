
import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { initializeFeatures } from '@/stores/features';

interface FeatureProviderProps {
  children: React.ReactNode;
}

/**
 * FeatureProvider initializes all feature stores at app startup
 */
export function FeatureProvider({ children }: FeatureProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeFeatures();
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize features:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize features'));
        // Still mark as initialized to not block the app
        setInitialized(true);
      }
    };

    init();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            Initializing features...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Feature initialization error:', error);
    // Still render children but log the error
  }

  return <>{children}</>;
}
