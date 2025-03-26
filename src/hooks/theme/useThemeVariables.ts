
import { useThemeStore } from '@/stores/theme';
import { useEffect } from 'react';
import { applyThemeToCSS } from '@/services/theme/ThemeController';

/**
 * Hook to apply theme CSS variables to the document
 * and manage theme changes
 */
export function useThemeVariables() {
  const { 
    variables, 
    darkMode, 
    highContrast, 
    reducedMotion,
    fetchThemes,
    currentThemeId
  } = useThemeStore();

  // Apply theme on mount and when variables change
  useEffect(() => {
    applyThemeToCSS();
  }, [variables, darkMode, highContrast, reducedMotion]);

  // Fetch themes on mount if none are loaded
  useEffect(() => {
    if (!currentThemeId) {
      fetchThemes();
    }
  }, [currentThemeId, fetchThemes]);

  return {
    variables,
    darkMode,
    highContrast,
    reducedMotion
  };
}
