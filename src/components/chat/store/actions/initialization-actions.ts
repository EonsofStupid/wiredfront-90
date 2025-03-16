
import { supabase } from '@/integrations/supabase/client';
import { ChatState, ProviderCategory } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import type { StateCreator } from 'zustand';

type SetState = (state: Partial<ChatState>, replace?: boolean, action?: any) => void;
type GetState = () => ChatState;

export const createInitializationActions = (
  set: SetState,
  get: GetState,
) => ({
  /**
   * Initialize chat settings from the database or local storage
   */
  initializeChatSettings: async () => {
    try {
      logger.info('Initializing chat settings');
      set({ initialized: false }, false, { type: 'initialization/start' });

      // First, try to load providers from Supabase edge function
      try {
        const { data, error } = await supabase.functions.invoke('initialize-providers');
        
        if (error) {
          logger.error('Error initializing providers', error);
        } else if (data && data.availableProviders) {
          logger.info('Loaded available providers', { count: data.availableProviders.length });
          
          // Always set OpenAI as the default provider if available
          const openaiProvider = data.availableProviders.find((p: any) => p.type === 'openai');
          
          // Transform the category to ensure it matches our type expectations
          const typedProviders = data.availableProviders.map((p: any) => ({
            ...p,
            category: ensureValidCategory(p.category)
          }));
          
          const typedDefaultProvider = openaiProvider 
            ? { ...openaiProvider, category: ensureValidCategory(openaiProvider.category) }
            : data.defaultProvider 
              ? { ...data.defaultProvider, category: ensureValidCategory(data.defaultProvider.category) }
              : null;
          
          set({
            availableProviders: typedProviders,
            currentProvider: typedDefaultProvider,
            providers: {
              availableProviders: typedProviders
            }
          });
          
          logger.info('Set current provider', { 
            provider: typedDefaultProvider?.name || 'None' 
          });
        }
      } catch (providerError) {
        logger.error('Failed to load providers from edge function', providerError);
        
        // Fallback to default OpenAI provider if edge function fails
        const fallbackProvider = {
          id: 'openai-default',
          name: 'OpenAI',
          type: 'openai',
          isDefault: true,
          category: 'chat' as ProviderCategory
        };
        
        set({
          availableProviders: [fallbackProvider],
          currentProvider: fallbackProvider
        });
        
        logger.info('Set fallback OpenAI provider');
      }

      // Then, try to load user chat settings from the database
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        logger.info('User authenticated, loading settings from database');
        
        const { data: chatSettings, error: settingsError } = await supabase
          .from('chat_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          logger.error('Error loading chat settings', settingsError);
        }

        if (chatSettings) {
          logger.info('Chat settings loaded from database');
          
          // Safely handle nested properties with proper type checking
          const uiCustomizations = chatSettings.ui_customizations || {};
          const currentState = get();
          
          // Apply settings from database with proper type safety
          if (typeof uiCustomizations === 'object') {
            const updatedState: Partial<ChatState> = { ...currentState };
            
            // Handle features if they exist
            if (uiCustomizations.features && typeof uiCustomizations.features === 'object') {
              updatedState.features = {
                ...currentState.features,
                ...uiCustomizations.features
              };
            }
            
            // Handle token enforcement if it exists
            if ('tokenEnforcement' in uiCustomizations) {
              updatedState.tokenControl = {
                ...currentState.tokenControl,
                enforcementMode: uiCustomizations.tokenEnforcement as TokenEnforcementMode
              };
            }
            
            // Handle token control if it exists
            if (uiCustomizations.tokenControl && typeof uiCustomizations.tokenControl === 'object') {
              updatedState.tokenControl = {
                ...updatedState.tokenControl,
                ...uiCustomizations.tokenControl
              };
            }
            
            set(updatedState);
          }
        }
      }

      // If no provider is set, use OpenAI as default
      const currentState = get();
      if (!currentState.currentProvider) {
        const defaultProvider = {
          id: 'openai-default',
          name: 'OpenAI',
          type: 'openai',
          isDefault: true,
          category: 'chat' as ProviderCategory
        };
        
        set({
          currentProvider: defaultProvider,
          availableProviders: [...(currentState.availableProviders || []), defaultProvider]
        });
        
        logger.info('Set default OpenAI provider as fallback');
      }

      // Finally, mark initialization as complete
      set({ initialized: true }, false, { type: 'initialization/complete' });
      logger.info('Chat settings initialization complete');
    } catch (error) {
      logger.error('Failed to initialize chat settings', error);
      set({ initialized: true, error: 'Failed to initialize chat settings' }, false, {
        type: 'initialization/error',
        error,
      });
    }
  },
});

/**
 * Helper function to ensure category is one of the valid ProviderCategory values
 */
function ensureValidCategory(category: any): ProviderCategory {
  const validCategories: ProviderCategory[] = ['chat', 'image', 'mixed', 'integration'];
  return validCategories.includes(category) ? category : 'chat';
}
