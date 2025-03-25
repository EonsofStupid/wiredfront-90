
import { useEffect, useState } from 'react';
import { initializeTheme } from '@/services/theme/ThemeController';

/**
 * Hook to initialize the theme system
 */
export function useThemeInit() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeTheme();
        setInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    init();
  }, []);

  return { initialized, error };
}
