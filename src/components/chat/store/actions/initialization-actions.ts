
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { ChatState } from '../types/chat-store-types';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { KnownFeatureFlag } from '@/types/admin/settings/feature-flags';

const FEATURE_MAP = {
  [KnownFeatureFlag.CODE_ASSISTANT]: 'codeAssistant',
  [KnownFeatureFlag.RAG_SUPPORT]: 'ragSupport',
  [KnownFeatureFlag.GITHUB_SYNC]: 'githubSync',
  [KnownFeatureFlag.NOTIFICATIONS]: 'notifications',
  [KnownFeatureFlag.TOKEN_CONTROL]: 'tokenEnforcement',
  [KnownFeatureFlag.VOICE_COMMANDS]: 'voice',
  [KnownFeatureFlag.ADVANCED_RAG]: 'rag',
};

export const createInitializationActions = (set: any, get: any) => {
  return {
    // Initialize chat settings and feature flags
    initializeChatSettings: async () => {
      try {
        logger.info('Initializing chat settings');
        
        // Check for user session first
        const { data: sessionData } = await supabase.auth.getSession();
        const isAuthenticated = !!sessionData?.session;
        
        if (!isAuthenticated) {
          logger.info('No authenticated user, using default settings');
          return;
        }
        
        // Fetch feature flags from database if authenticated
        const { data: featureFlags, error: flagError } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('enabled', true);
        
        if (flagError) {
          logger.error('Error fetching feature flags:', flagError);
        } else if (featureFlags) {
          logger.info(`Loaded ${featureFlags.length} feature flags`);
          
          // Apply feature flags to local state
          const featureUpdates: Record<string, boolean> = {};
          
          featureFlags.forEach((flag) => {
            const mappedFeature = FEATURE_MAP[flag.key as KnownFeatureFlag];
            if (mappedFeature) {
              featureUpdates[mappedFeature] = true;
            }
          });
          
          if (Object.keys(featureUpdates).length > 0) {
            set(
              (state: ChatState) => ({
                features: {
                  ...state.features,
                  ...featureUpdates
                }
              }),
              false,
              { type: 'initializeChatSettings/features', features: featureUpdates }
            );
          }
        }
        
        // Fetch token settings if authenticated
        const { data: tokenData, error: tokenError } = await supabase
          .from('user_tokens')
          .select('*')
          .eq('user_id', sessionData.session?.user.id)
          .single();
        
        if (tokenError && tokenError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" which is fine for new users
          logger.error('Error fetching token settings:', tokenError);
        } else if (tokenData) {
          logger.info('Loaded token settings:', tokenData);
          
          set(
            (state: ChatState) => ({
              tokenControl: {
                ...state.tokenControl,
                balance: tokenData.balance || 0,
                enforcementMode: tokenData.enforcement_mode || 'never',
                lastUpdated: tokenData.last_updated || null,
                queriesUsed: tokenData.queries_used || 0,
                freeQueryLimit: tokenData.free_query_limit || 5,
                tokensPerQuery: tokenData.tokens_per_query || 1
              }
            }),
            false,
            { type: 'initializeChatSettings/tokenControl', tokenData }
          );
        }
        
        // Fetch available chat providers
        const { data: providerData, error: providerError } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('is_enabled', true);
        
        if (providerError) {
          logger.error('Error fetching providers:', providerError);
        } else if (providerData) {
          logger.info(`Loaded ${providerData.length} providers`);
          
          const chatProviders = providerData.map((provider) => {
            const providerSettings = provider.provider_settings || {};
            return {
              id: provider.id,
              name: provider.api_type,
              type: provider.api_type,
              isDefault: provider.is_default || false,
              isEnabled: provider.is_enabled,
              category: (providerSettings.category || 'chat') as 'chat' | 'image' | 'mixed' | 'integration',
              models: providerSettings.models || []
            };
          });
          
          set(
            (state: ChatState) => ({
              availableProviders: chatProviders,
              currentProvider: chatProviders.find((p) => p.isDefault) || chatProviders[0] || state.currentProvider
            }),
            false,
            { type: 'initializeChatSettings/providers', providers: chatProviders }
          );
        }
        
        set({ initialized: true }, false, { type: 'initializeChatSettings/complete' });
        
      } catch (error) {
        logger.error('Failed to initialize chat settings:', error);
        toast.error('Failed to initialize chat. Some features may be unavailable.');
      }
    }
  };
};
