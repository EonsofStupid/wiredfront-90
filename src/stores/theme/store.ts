
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
  zLayer: 10000,
  
  // Effects
  glowEffect: '0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(255, 0, 127, 0.3)',
  animationSpeed: '0.3s',
  
  // UI features
  glassMorphism: true,
  neonEffects: true,
  animations: true
};

export interface ThemeState {
  variables: ThemeVariables;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  availableThemes: Theme[];
  currentThemeId: string | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ThemeActions {
  // UI preferences
  setDarkMode: (isDark: boolean) => void;
  setHighContrast: (isHighContrast: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  
  // Theme variables
  updateVariables: (updates: Partial<ThemeVariables>) => void;
  resetToDefaults: () => void;
  
  // Theme management
  fetchThemes: () => Promise<void>;
  setTheme: (themeId: string) => Promise<void>;
  applyTheme: (theme: Theme) => void;
  loadThemeTokens: (themeId: string) => Promise<ThemeToken[]>;
}

export type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        variables: DEFAULT_THEME_VARIABLES,
        darkMode: true,
        highContrast: false,
        reducedMotion: false,
        availableThemes: [],
        currentThemeId: null,
        isLoading: false,
        error: null,
        
        // UI preferences
        setDarkMode: (isDark) => set({ darkMode: isDark }),
        
        setHighContrast: (isHighContrast) => set({ 
          highContrast: isHighContrast,
          variables: isHighContrast ? 
            {
              ...DEFAULT_THEME_VARIABLES,
              glowEffect: 'none',
              glassMorphism: false,
              neonEffects: false,
              background: 'black',
              foreground: 'white',
              primary: '#ffffff',
              secondary: '#cccccc'
            } : 
            get().variables
        }),
        
        setReducedMotion: (reducedMotion) => set({ 
          reducedMotion,
          variables: {
            ...get().variables,
            animations: !reducedMotion,
            glowEffect: reducedMotion ? 'none' : get().variables.glowEffect
          }
        }),
        
        // Theme variables
        updateVariables: (updates) => set((state) => ({
          variables: { ...state.variables, ...updates }
        })),
        
        resetToDefaults: () => set({ variables: DEFAULT_THEME_VARIABLES }),
        
        // Theme management
        fetchThemes: async () => {
          try {
            set({ isLoading: true, error: null });
            
            // Fetch themes from Supabase
            const { data, error } = await supabase
              .from('themes')
              .select('*')
              .order('is_default', { ascending: false })
              .order('name', { ascending: true });

            if (error) throw error;

            if (!data) {
              set({ availableThemes: [], isLoading: false });
              return;
            }
            
            const themes = data as Theme[];
            set({ availableThemes: themes, isLoading: false });
            
            // If we have a default theme and no current theme is set, use the default
            const defaultTheme = themes.find(theme => theme.is_default);
            if (defaultTheme && !get().currentThemeId) {
              await get().setTheme(defaultTheme.id);
            }
            
            logger.info(`Fetched ${themes.length} themes`);
          } catch (error) {
            logger.error('Failed to fetch themes', { error });
            set({ error: error as Error, isLoading: false });
          }
        },
        
        setTheme: async (themeId) => {
          try {
            set({ isLoading: true, error: null });
            
            // Find theme in available themes
            const theme = get().availableThemes.find(theme => theme.id === themeId);
            if (!theme) {
              throw new Error(`Theme with ID ${themeId} not found`);
            }
            
            // Load theme tokens
            const tokens = await get().loadThemeTokens(themeId);
            theme.tokens = tokens;
            
            // Apply theme
            get().applyTheme(theme);
            
            set({ currentThemeId: themeId, isLoading: false });
          } catch (error) {
            logger.error('Failed to set theme', { error });
            set({ error: error as Error, isLoading: false });
          }
        },
        
        applyTheme: (theme) => {
          // Map tokens to variables
          const variables: Partial<ThemeVariables> = {};
          
          // Only process if tokens exist
          if (theme.tokens && theme.tokens.length > 0) {
            theme.tokens.forEach(token => {
              // Map token_name to variable name, converting from CSS custom property format
              // Example: --chat-primary -> primary
              const tokenName = token.token_name.replace('--chat-', '');
              
              // Only set if it's a key in ThemeVariables
              if (tokenName in DEFAULT_THEME_VARIABLES) {
                (variables as any)[tokenName] = token.token_value;
              }
            });
            
            // Apply variables
            set({ variables: { ...DEFAULT_THEME_VARIABLES, ...variables } });
          }
          
          logger.info(`Applied theme: ${theme.name}`);
        },
        
        loadThemeTokens: async (themeId) => {
          try {
            // Fetch theme tokens from Supabase
            const { data, error } = await supabase
              .from('theme_tokens')
              .select('*')
              .eq('theme_id', themeId);

            if (error) throw error;

            if (!data) {
              return [];
            }
            
            return data as ThemeToken[];
          } catch (error) {
            logger.error('Failed to load theme tokens', { error });
            throw error;
          }
        }
      }),
      {
        name: 'chat-theme',
        partialize: (state) => ({
          darkMode: state.darkMode,
          highContrast: state.highContrast,
          reducedMotion: state.reducedMotion,
          currentThemeId: state.currentThemeId,
        }),
      }
    ),
    { name: 'ThemeStore' }
  )
);
