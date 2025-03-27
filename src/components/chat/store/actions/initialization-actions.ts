
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { TokenEnforcementMode } from '@/integrations/supabase/types';
import { extractEnforcementMode } from '@/utils/token-utils';

export const createInitializationActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  initializeChat: async () => {
    try {
      logger.info('Initializing chat state...');
      
      // Fetch user token balance
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get token balance
        const { data: tokenData } = await supabase
          .from('user_tokens')
          .select('balance, enforcement_mode, tokens_per_query, free_query_limit, queries_used')
          .eq('user_id', user.id)
          .single();
        
        if (tokenData) {
          // Extract enforcement mode with type safety
          const enforcementMode: TokenEnforcementMode = extractEnforcementMode(tokenData.enforcement_mode);
          
          set({
            tokenControl: {
              ...get().tokenControl,
              balance: tokenData.balance || 0,
              enforcementMode,
              tokensPerQuery: tokenData.tokens_per_query || 1,
              freeQueryLimit: tokenData.free_query_limit || 5,
              queriesUsed: tokenData.queries_used || 0,
              lastUpdated: new Date().toISOString()
            }
          }, false, { type: 'chat/initializeTokens' });
          
          logger.info('Token data initialized', { 
            balance: tokenData.balance,
            enforcementMode,
            tokensPerQuery: tokenData.tokens_per_query,
            freeQueryLimit: tokenData.free_query_limit,
            queriesUsed: tokenData.queries_used
          });
        } else {
          logger.warn('No token data found for user', { userId: user.id });
        }
        
        // Get user chat preferences
        const { data: prefsData } = await supabase
          .from('user_chat_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (prefsData) {
          // Set UI preferences from database
          set({
            position: prefsData.position as any || 'bottom-right',
            docked: prefsData.docked !== undefined ? prefsData.docked : true,
            isMinimized: false, // Always start maximized
            scale: prefsData.scale || 1
          }, false, { type: 'chat/initializePreferences' });
          
          logger.info('Chat preferences initialized', { 
            position: prefsData.position,
            docked: prefsData.docked 
          });
        }
        
        // Fetch available providers
        const { data: providers } = await supabase
          .from('chat_providers')
          .select('*')
          .eq('is_enabled', true);
        
        if (providers && providers.length > 0) {
          // Transform to the Provider type
          const transformedProviders = providers.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            category: p.category || 'chat',
            isEnabled: p.is_enabled,
            maxTokens: p.max_tokens,
            contextSize: p.context_size
          }));
          
          // Update providers in store
          get().updateChatProvider(transformedProviders);
          
          logger.info('Chat providers initialized', { count: transformedProviders.length });
        } else {
          logger.warn('No chat providers found');
        }
        
        // Fetch feature flags
        const { data: featureFlags } = await supabase
          .from('feature_flags')
          .select('key, enabled')
          .in('key', [
            'voice', 'rag', 'modeSwitch', 'notifications', 
            'github', 'codeAssistant', 'ragSupport', 
            'githubSync', 'tokenEnforcement'
          ]);
        
        if (featureFlags && featureFlags.length > 0) {
          const features = { ...get().features };
          
          // Update features based on database flags
          featureFlags.forEach(flag => {
            if (flag.key in features) {
              features[flag.key as keyof typeof features] = flag.enabled;
            }
          });
          
          set({ features }, false, { type: 'chat/initializeFeatures' });
          logger.info('Feature flags initialized', { features });
        }
      }
      
      // Mark as initialized
      set({ initialized: true }, false, { type: 'chat/initialized' });
      logger.info('Chat initialization complete');
      
    } catch (error) {
      logger.error('Error initializing chat', { error });
      set({ 
        error: error instanceof Error ? error : new Error('Failed to initialize chat'),
        initialized: true // Still mark as initialized to prevent infinite retries
      }, false, { type: 'chat/initializationError' });
    }
  }
});
