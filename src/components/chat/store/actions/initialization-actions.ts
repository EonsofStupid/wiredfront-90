
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { FeatureKey } from './feature/types';
import { TokenEnforcementMode } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

// Default initialization state for chat features and settings
const DEFAULT_FEATURES = {
  [FeatureKey.DEV_MODE]: false,
  [FeatureKey.CHAT_GPT4]: false,
  [FeatureKey.ADVANCED_RAG]: false,
  [FeatureKey.VOICE_COMMANDS]: false,
  [FeatureKey.GITHUB_SYNC]: true,
  [FeatureKey.IMAGE_GENERATION]: false,
  [FeatureKey.TOKEN_CONTROL]: false
};

// Default token control settings
const DEFAULT_TOKEN_CONTROL = {
  enforcementMode: 'never' as TokenEnforcementMode,
  balance: 1000,
  usageHistory: [],
  tierLimits: {
    free: 1000,
    basic: 5000,
    premium: 20000,
    enterprise: -1 // unlimited
  }
};

export function createInitializationActions(set: any, get: any) {
  return {
    // Initialize the store with user settings
    initializeStore: async () => {
      try {
        // Log initialization start
        logger.info('Initializing chat store');
        
        // First, set default values
        set(
          (state: any) => ({
            isInitialized: false,
            isLoading: true,
            error: null,
            features: DEFAULT_FEATURES,
            tokenControl: DEFAULT_TOKEN_CONTROL,
            providers: [],
            currentProvider: null,
            availableProviders: [],
          }),
          false,
          { type: 'initializeStoreDefaults' }
        );

        // Get the current user
        const { data: authData } = await supabase.auth.getSession();
        if (!authData?.session?.user) {
          // No authenticated user
          logger.warn('No authenticated user during store initialization');
          set(
            (state: any) => ({
              isInitialized: true,
              isLoading: false,
              userLoggedIn: false,
            }),
            false,
            { type: 'initializeStoreComplete' }
          );
          return;
        }

        // User is authenticated
        const userId = authData.session.user.id;

        // Load user settings from the database
        const { data: settings, error: settingsError } = await supabase
          .from('chat_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          // Log error but continue with defaults
          logger.error('Failed to load chat settings', { error: settingsError });
        }

        // Extract feature flags from settings
        let features = { ...DEFAULT_FEATURES };
        if (settings?.ui_customizations && typeof settings.ui_customizations === 'object') {
          // Check for features property
          const customizations = settings.ui_customizations as Record<string, any>;
          if (customizations.features) {
            features = {
              ...features,
              ...customizations.features
            };
          }
        }

        // Extract token control settings
        let tokenControl = { ...DEFAULT_TOKEN_CONTROL };
        if (settings?.ui_customizations && typeof settings.ui_customizations === 'object') {
          const customizations = settings.ui_customizations as Record<string, any>; 
          if (customizations.tokenControl) {
            tokenControl = {
              ...tokenControl,
              ...customizations.tokenControl,
              // Ensure the enforcement mode is valid
              enforcementMode: isValidEnforcementMode(customizations.tokenControl?.enforcementMode) 
                ? customizations.tokenControl.enforcementMode 
                : DEFAULT_TOKEN_CONTROL.enforcementMode
            };
          }
        }

        // Get data about available providers
        const { data: availableProviders, error: providersError } = await supabase
          .from('available_providers')
          .select('*')
          .eq('is_enabled', true);

        if (providersError) {
          logger.error('Failed to load available providers', { error: providersError });
        }

        // Finally set the fully loaded state
        set(
          (state: any) => ({
            isInitialized: true,
            isLoading: false,
            error: null,
            userLoggedIn: true,
            features,
            tokenControl,
            availableProviders: availableProviders || [],
            currentProvider: settings?.api_provider || 'openai',
          }),
          false,
          { type: 'initializeStoreComplete' }
        );

        logger.info('Chat store initialization completed successfully');
      } catch (error) {
        // Log the error and set error state
        logger.error('Error initializing chat store', { error });
        set(
          (state: any) => ({
            isInitialized: true,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown initialization error',
          }),
          false,
          { type: 'initializeStoreError', error }
        );
      }
    },
  };
}

// Helper to validate the enforcement mode
function isValidEnforcementMode(mode: any): mode is TokenEnforcementMode {
  const validModes: TokenEnforcementMode[] = ['always', 'never', 'role_based', 'mode_based'];
  return typeof mode === 'string' && validModes.includes(mode as TokenEnforcementMode);
}
