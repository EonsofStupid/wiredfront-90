import { supabase } from '@/integrations/supabase/client';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import { StateCreator } from 'zustand';

export const createInitializationActions = (
  set: (state: Partial<ChatState>, replace?: boolean, action?: any) => void,
  get: () => ChatState,
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
          
          set({
            availableProviders: data.availableProviders,
            currentProvider: data.defaultProvider,
            providers: {
              availableProviders: data.availableProviders
            }
          });
        }
      } catch (providerError) {
        logger.error('Failed to load providers from edge function', providerError);
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
          
          // Safely access nested properties with proper type checking
          const uiCustomizations = chatSettings.ui_customizations || {};
          
          // Apply settings from database with proper type safety
          set({
            // Apply database settings while preserving defaults for missing fields
            ...get(),
            features: {
              ...get().features,
              ...(typeof uiCustomizations === 'object' && 
                 'features' in uiCustomizations ? 
                 uiCustomizations.features as Record<string, unknown> : {})
            },
            // Apply token control settings if available with proper type checks
            tokenControl: {
              ...get().tokenControl,
              enforcementMode: typeof uiCustomizations === 'object' && 
                'tokenEnforcement' in uiCustomizations ? 
                uiCustomizations.tokenEnforcement : 'never',
              ...(typeof uiCustomizations === 'object' && 
                 'tokenControl' in uiCustomizations ? 
                 uiCustomizations.tokenControl as Record<string, unknown> : {})
            }
          });
        }
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
