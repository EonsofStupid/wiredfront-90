
/**
 * Service to handle theme CSS variable application
 */
import { useThemeStore } from '@/stores/theme';

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeToCSS() {
  const { variables, darkMode, highContrast, reducedMotion } = useThemeStore.getState();
  
  // Set theme class on HTML element
  document.documentElement.className = [
    darkMode ? 'dark' : '',
    highContrast ? 'high-contrast' : '',
    reducedMotion ? 'reduced-motion' : ''
  ].filter(Boolean).join(' ');
  
  // Apply CSS variables
  Object.entries(variables).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${category}-${key}`,
        value
      );
    });
  });
  
  // Set UI mode data attributes
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  
  if (highContrast) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  } else {
    document.documentElement.removeAttribute('data-high-contrast');
  }
  
  if (reducedMotion) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  } else {
    document.documentElement.removeAttribute('data-reduced-motion');
  }
}

/**
 * Reset all theme CSS variables to default
 */
export function resetThemeCSS() {
  const { variables } = useThemeStore.getState();
  
  // Remove all CSS variables
  Object.entries(variables).forEach(([category, values]) => {
    Object.keys(values).forEach((key) => {
      document.documentElement.style.removeProperty(`--${category}-${key}`);
    });
  });
  
  // Reset classes and attributes
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-high-contrast');
  document.documentElement.removeAttribute('data-reduced-motion');
}
