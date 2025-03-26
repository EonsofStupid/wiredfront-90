
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme';
import { applyThemeToCSS } from '@/services/theme/ThemeController';

/**
 * Hook to initialize theme on application startup
 */
export function useThemeInit() {
  const { fetchThemes, setPrefersColorScheme } = useThemeStore();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize theme system
  useEffect(() => {
    if (initialized) return;
    
    const initTheme = async () => {
      try {
        // Set up system preference listener
        const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
        setPrefersColorScheme(darkModePreference.matches);
        
        // Listen for changes
        const handleChange = (e: MediaQueryListEvent) => {
          setPrefersColorScheme(e.matches);
        };
        
        darkModePreference.addEventListener('change', handleChange);
        
        // Fetch available themes
        await fetchThemes();
        
        // Apply theme to CSS variables
        applyThemeToCSS();
        
        setInitialized(true);
        
        return () => {
          darkModePreference.removeEventListener('change', handleChange);
        };
      } catch (err) {
        console.error('Error initializing theme:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize theme'));
      }
    };
    
    initTheme();
  }, [initialized, fetchThemes, setPrefersColorScheme]);
  
  return { initialized, error };
}
