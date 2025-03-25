import { supabase } from '@/integrations/supabase/client';
import { ChatState } from '../types/chat-store-types';
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
          
          set({
            availableProviders: data.availableProviders,
            currentProvider: openaiProvider || data.defaultProvider,
            providers: {
              availableProviders: data.availableProviders
            }
          });
          
          logger.info('Set current provider', { 
            provider: openaiProvider ? openaiProvider.name : data.defaultProvider?.name 
          });
        }
      } catch (providerError) {
        logger.error('Failed to load providers from edge function', providerError);
        
        // Fallback to default OpenAI provider if edge function fails
        const fallbackProvider: ChatProvider = {
          id: 'openai-default',
          name: 'OpenAI',
          type: 'openai',
          isDefault: true,
          category: 'chat' // Using a valid category value
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
          
          // Type assertion to handle potential JSON structure issues
          const settingsData = data as unknown as { 
            features?: {
              voice: boolean,
              rag: boolean,
              modeSwitch: boolean,
              notifications: boolean,
              github: boolean,
              codeAssistant: boolean,
              ragSupport: boolean,
              githubSync: boolean,
              tokenEnforcement: boolean
            },
            tokenControl?: {
              balance: number,
              enforcementMode: TokenEnforcementMode,
              lastUpdated: string | null,
              tokensPerQuery: number,
              freeQueryLimit: number,
              queriesUsed: number
            },
            tokenEnforcement?: boolean
          };

          // Apply settings from database with proper type safety
          set({
            features: {
              ...currentState.features,
              ...(typeof uiCustomizations === 'object' && 
                 uiCustomizations.features ? 
                 uiCustomizations.features as Record<string, boolean> : {})
            },
            // Apply token control settings if available with proper type checks
            tokenControl: {
              ...currentState.tokenControl,
              enforcementMode: typeof uiCustomizations === 'object' && 
                uiCustomizations.tokenEnforcement ? 
                uiCustomizations.tokenEnforcement : 'never',
              ...(typeof uiCustomizations === 'object' && 
                 uiCustomizations.tokenControl ? 
                 uiCustomizations.tokenControl as Record<string, any> : {})
            }
          });
        }
      }

      // If no provider is set, use OpenAI as default
      const currentState = get();
      if (!currentState.currentProvider) {
        const defaultProvider: ChatProvider = {
          id: 'openai-default',
          name: 'OpenAI',
          type: 'openai',
          isDefault: true,
          category: 'chat' // Using a valid category value
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
