import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/services/chat/LoggingService';

export const useChatAPI = () => {
  const { data: apiSettings, error } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          logger.warn('No authenticated user found');
          return null;
        }

        // Get enabled API configurations
        const { data: apiConfigs, error: configError } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_enabled', true);

        if (configError) {
          logger.error('Error fetching API configurations:', configError);
          throw configError;
        }

        // Get chat settings to verify API key
        const { data: chatSettings, error: settingsError } = await supabase
          .from('chat_settings')
          .select('api_key, api_provider')
          .eq('user_id', user.id)
          .single();

        if (settingsError) {
          logger.error('Error fetching chat settings:', settingsError);
          throw settingsError;
        }

        if (!chatSettings?.api_key) {
          logger.warn('No API key configured');
          return null;
        }

        const settings: Record<string, string> = {};
        
        apiConfigs?.forEach(config => {
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