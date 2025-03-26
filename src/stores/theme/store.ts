
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { ThemeVariables, Theme, ThemeToken } from '@/types/theme';
import { logger } from '@/services/chat/LoggingService';

// Default cyber theme variables
const DEFAULT_THEME_VARIABLES: ThemeVariables = {
  // Colors
  primary: '#8B5CF6', // Purple
  secondary: '#0EA5E9', // Cyan
  background: 'rgba(0, 0, 0, 0.85)',
  foreground: 'white',
  accent: '#F43F5E', // Pink
  
  // Dimensions
  chatWidth: '400px',
  chatHeight: '500px',
  borderRadius: '0.75rem',
  
  // Z-index management
  zLayer: 1000,
  
  // Effects
  glowEffect: '0 0 10px',
  animationSpeed: '0.3s',
  
  // UI features
  glassMorphism: true,
  neonEffects: true,
  animations: true
};

interface ThemeState {
  themes: Theme[];
  currentThemeId: string | null;
  variables: ThemeVariables;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface ThemeActions {
  fetchThemes: () => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  updateVariables: (updates: Partial<ThemeVariables>) => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        themes: [],
        currentThemeId: null,
        variables: DEFAULT_THEME_VARIABLES,
        darkMode: true,
        highContrast: false,
        reducedMotion: false,
        isLoading: false,
        error: null,

        // Actions
        fetchThemes: async () => {
          try {
            set({ isLoading: true, error: null });
            
            // Fetch themes from Supabase
            const { data: themes, error } = await supabase
              .from('themes')
              .select('*, tokens:theme_tokens(*)');

            if (error) throw error;

            // Set default theme if available
            const defaultTheme = themes?.find(theme => theme.is_default);
            
            set({ 
              themes: themes || [],
              currentThemeId: defaultTheme?.id || null,
              isLoading: false
            });
            
            // If we found a default theme, apply it
            if (defaultTheme) {
              await get().setTheme(defaultTheme.id);
            }
            
            logger.info('Themes fetched successfully', { count: themes?.length || 0 });
          } catch (error) {
            logger.error('Failed to fetch themes', { error });
            set({ error: error as Error, isLoading: false });
          }
        },

        setTheme: async (themeId) => {
          try {
            set({ isLoading: true, error: null });
            
            // Find theme in state
            const theme = get().themes.find(t => t.id === themeId);
            
            if (!theme) {
              throw new Error(`Theme with id ${themeId} not found`);
            }
            
            // Extract CSS variables from tokens
            const themeVariables = { ...DEFAULT_THEME_VARIABLES };
            
            // Apply token values to variables
            if (theme.tokens) {
              theme.tokens.forEach((token: ThemeToken) => {
                const key = token.token_name as keyof ThemeVariables;
                if (key in themeVariables) {
                  // Type conversion based on variable type
                  if (typeof themeVariables[key] === 'boolean') {
                    themeVariables[key] = token.token_value === 'true';
                  } else if (typeof themeVariables[key] === 'number') {
                    themeVariables[key] = Number(token.token_value);
                  } else {
                    themeVariables[key] = token.token_value;
                  }
                }
              });
            }
            
            set({ 
              currentThemeId: themeId,
              variables: themeVariables,
              isLoading: false
            });
            
            logger.info('Theme set successfully', { themeId, themeName: theme.name });
          } catch (error) {
            logger.error('Failed to set theme', { error, themeId });
            set({ error: error as Error, isLoading: false });
          }
        },

        updateVariables: (updates) => {
          set({ variables: { ...get().variables, ...updates } });
        },

        toggleDarkMode: () => {
          set({ darkMode: !get().darkMode });
        },

        toggleHighContrast: () => {
          set({ highContrast: !get().highContrast });
        },

        toggleReducedMotion: () => {
          set({ reducedMotion: !get().reducedMotion });
        }
      }),
      {
        name: 'theme-storage',
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          darkMode: state.darkMode,
          highContrast: state.highContrast,
          reducedMotion: state.reducedMotion,
        }),
      }
    ),
    { name: 'ThemeStore' }
  )
);
