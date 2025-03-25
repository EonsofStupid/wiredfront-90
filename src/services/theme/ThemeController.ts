
import { useThemeStore } from '@/stores/theme/store';
import { logger } from '@/services/chat/LoggingService';

/**
 * Applies theme variables to CSS custom properties
 */
export function applyThemeToCSS() {
  const theme = useThemeStore.getState();
  const { variables } = theme;
  
  try {
    // Apply to root element
    document.documentElement.style.setProperty('--chat-bg', variables.background);
    document.documentElement.style.setProperty('--chat-fg', variables.foreground);
    document.documentElement.style.setProperty('--chat-primary', variables.primary);
    document.documentElement.style.setProperty('--chat-secondary', variables.secondary);
    document.documentElement.style.setProperty('--chat-accent', variables.accent);
    
    // Dimensions
    document.documentElement.style.setProperty('--chat-width', variables.chatWidth);
    document.documentElement.style.setProperty('--chat-height', variables.chatHeight);
    document.documentElement.style.setProperty('--chat-border-radius', variables.borderRadius);
    
    // Z-index
    document.documentElement.style.setProperty('--chat-z-layer', variables.zLayer.toString());
    
    // Effects
    document.documentElement.style.setProperty('--chat-glow', variables.glowEffect);
    document.documentElement.style.setProperty('--chat-transition', variables.animationSpeed);
    
    // Message colors
    document.documentElement.style.setProperty('--chat-message-user-bg', variables.primary);
    document.documentElement.style.setProperty('--chat-message-assistant-bg', variables.secondary);
    
    // Apply classes based on feature flags
    if (variables.glassMorphism) {
      document.documentElement.classList.add('chat-glass');
    } else {
      document.documentElement.classList.remove('chat-glass');
    }
    
    if (variables.neonEffects) {
      document.documentElement.classList.add('chat-neon');
    } else {
      document.documentElement.classList.remove('chat-neon');
    }
    
    if (!variables.animations || theme.reducedMotion) {
      document.documentElement.classList.add('chat-reduced-motion');
    } else {
      document.documentElement.classList.remove('chat-reduced-motion');
    }
    
    // Adjust for dark/light mode
    if (theme.darkMode) {
      document.documentElement.classList.add('chat-dark-theme');
      document.documentElement.classList.remove('chat-light-theme');
    } else {
      document.documentElement.classList.add('chat-light-theme');
      document.documentElement.classList.remove('chat-dark-theme');
    }
    
    // High contrast overrides
    if (theme.highContrast) {
      document.documentElement.classList.add('chat-high-contrast');
    } else {
      document.documentElement.classList.remove('chat-high-contrast');
    }
    
    logger.info('Applied theme to CSS');
  } catch (error) {
    logger.error('Failed to apply theme to CSS', { error });
  }
}

// React hook for controlling theme
export function useThemeController() {
  const themeStore = useThemeStore();
  
  const updateAndApply = (updates: Partial<typeof themeStore.variables>) => {
    themeStore.updateVariables(updates);
    applyThemeToCSS();
  };
  
  return {
    ...themeStore,
    applyTheme: applyThemeToCSS,
    updateAndApply
  };
}

// Function to initialize theme from database
export async function initializeTheme() {
  try {
    const themeStore = useThemeStore.getState();
    
    // Fetch themes
    await themeStore.fetchThemes();
    
    // Apply current theme
    if (themeStore.currentThemeId) {
      await themeStore.setTheme(themeStore.currentThemeId);
    }
    
    // Apply theme to CSS
    applyThemeToCSS();
    
    logger.info('Theme initialized');
  } catch (error) {
    logger.error('Failed to initialize theme', { error });
  }
}
