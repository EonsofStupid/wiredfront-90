import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/services/chat/LoggingService';
import { useSessionStore } from '@/stores/session/store';

export const useChatAPI = () => {
  const user = useSessionStore(state => state.user);

  const { data: apiSettings, error } = useQuery({
    queryKey: ['api-settings', user?.id],
    queryFn: async () => {
      try {
        let query = supabase
          .from('api_configurations')
          .select('*')
          .eq('is_enabled', true);

        // If user is authenticated, get their configurations
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          // For non-authenticated users, get default public configurations
          query = query.eq('is_default', true);
        }

        const { data: apiConfigs, error: configError } = await query;

        if (configError) {
          logger.error('Error fetching API configurations:', configError);
          throw configError;
        }

        if (!apiConfigs || apiConfigs.length === 0) {
          logger.warn('No API configurations found');
          return null;
        }

        const settings: Record<string, string> = {};
        
        apiConfigs.forEach(config => {
          if (config.is_enabled) {
            settings[config.api_type.toLowerCase()] = 'configured';
            logger.info(`Found enabled API configuration for ${config.api_type}`);
          }
        });

        return settings;
      } catch (error) {
        logger.error('Error in API settings query:', error);
        toast.error('Failed to load API settings');
        throw error;
      }
    },
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });

  if (error) {
    logger.error('Error in useChatAPI hook:', error);
  }

  const getDefaultProvider = () => {
    if (!apiSettings || Object.keys(apiSettings).length === 0) {
      logger.warn('No API settings found');
      return null;
    }
    
    // Check for configured providers in order of preference
    if (apiSettings.openai) return 'openai';
    if (apiSettings.anthropic) return 'anthropic';
    if (apiSettings.gemini) return 'gemini';
    if (apiSettings.perplexity) return 'perplexity';
    
    logger.warn('No default provider found in settings');
    return null;
  };

  return {
    apiSettings,
    getDefaultProvider,
    isConfigured: !!apiSettings && Object.keys(apiSettings).length > 0
  };
};