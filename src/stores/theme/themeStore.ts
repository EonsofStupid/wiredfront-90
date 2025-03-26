
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { logger } from '@/services/chat/LoggingService';

export interface ThemeVariables {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  fonts: Record<string, string>;
  [key: string]: Record<string, string>;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  variables: ThemeVariables;
  darkVariables?: ThemeVariables;
  highContrastVariables?: ThemeVariables;
  isDefault?: boolean;
}

interface ThemeState {
  themes: Theme[];
  currentThemeId: string | null;
  variables: ThemeVariables;
  darkMode: boolean;
  prefersColorScheme: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface ThemeActions {
  fetchThemes: () => Promise<void>;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setPrefersColorScheme: (prefers: boolean) => void;
  applyTheme: (themeId: string, darkMode?: boolean, highContrast?: boolean) => void;
}

export type ThemeStore = ThemeState & ThemeActions;

const DEFAULT_VARIABLES: ThemeVariables = {
  colors: {
    primary: '#7c3aed',
    secondary: '#0ea5e9',
    accent: '#f472b6',
    background: '#1a1a1a',
    foreground: '#ffffff',
    border: '#333333',
    muted: '#666666',
    success: '#10b981',
    warning: '#fbbf24',
    error: '#ef4444',
  },
  spacing: {
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
    '12': '3rem',
    '16': '4rem',
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    heading: 'Inter, sans-serif',
  },
};

export const useThemeStore = create<ThemeStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      themes: [],
      currentThemeId: null,
      variables: DEFAULT_VARIABLES,
      darkMode: true,
      prefersColorScheme: true,
      highContrast: false,
      reducedMotion: false,
      isLoading: false,
      error: null,
      
      // Actions
      fetchThemes: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Fetch from API when available
          // For now, just use default theme
          const defaultTheme: Theme = {
            id: 'wfpulse',
            name: 'WFPULSE',
            description: 'Default cyberpunk-inspired theme',
            variables: DEFAULT_VARIABLES,
            isDefault: true
          };
          
          set({ 
            themes: [defaultTheme],
            currentThemeId: defaultTheme.id,
            variables: defaultTheme.variables,
            isLoading: false
          });
          
          logger.info('Themes loaded');
        } catch (error) {
          logger.error('Failed to fetch themes', { error });
          set({ 
            error: error instanceof Error ? error : new Error('Failed to load themes'),
            isLoading: false
          });
        }
      },
      
      setTheme: (themeId) => {
        const { themes, darkMode, highContrast } = get();
        const theme = themes.find(t => t.id === themeId);
        
        if (theme) {
          set({ currentThemeId: themeId });
          get().applyTheme(themeId, darkMode, highContrast);
        } else {
          logger.error('Theme not found', { themeId });
        }
      },
      
      toggleDarkMode: () => {
        const { darkMode, currentThemeId } = get();
        set({ darkMode: !darkMode });
        
        if (currentThemeId) {
          get().applyTheme(currentThemeId, !darkMode, get().highContrast);
        }
      },
      
      toggleHighContrast: () => {
        const { highContrast, currentThemeId } = get();
        set({ highContrast: !highContrast });
        
        if (currentThemeId) {
          get().applyTheme(currentThemeId, get().darkMode, !highContrast);
        }
      },
      
      toggleReducedMotion: () => {
        set(state => ({ reducedMotion: !state.reducedMotion }));
      },
      
      setPrefersColorScheme: (prefers) => {
        set({ prefersColorScheme: prefers });
        
        // If user hasn't manually set dark mode, follow system preference
        // (This triggers a re-apply of the theme via the theme controller)
        const { darkMode, currentThemeId } = get();
        if (darkMode !== prefers) {
          set({ darkMode: prefers });
          
          if (currentThemeId) {
            get().applyTheme(currentThemeId, prefers, get().highContrast);
          }
        }
      },
      
      applyTheme: (themeId, darkMode, highContrast) => {
        const { themes } = get();
        const theme = themes.find(t => t.id === themeId);
        
        if (!theme) {
          logger.error('Theme not found during application', { themeId });
          return;
        }
        
        // Determine which variables to use based on mode
        let variables = theme.variables;
        
        if (darkMode && theme.darkVariables) {
          variables = theme.darkVariables;
        }
        
        if (highContrast && theme.highContrastVariables) {
          variables = theme.highContrastVariables;
        }
        
        set({ variables });
        logger.info('Theme applied', { themeId, darkMode, highContrast });
      }
    }),
    { name: 'ThemeStore' }
  )
);
