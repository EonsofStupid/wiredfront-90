import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatAPI = () => {
  const { data: apiSettings } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // First check user_settings table for API keys
      const { data: userSettings, error: userError } = await supabase
        .from('user_settings')
        .select(`
          value,
          settings!inner(key)
        `)
        .eq('user_id', user.id)
        .in('settings.key', [
          'openai-api-key',
          'gemini-api-key',
          'anthropic-api-key',
          'perplexity-api-key'
        ]);

      if (userError) {
        console.error('Error fetching user settings:', userError);
        return null;
      }

      // Then check api_configurations table
      const { data: apiConfigs, error: configError } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      if (configError) {
        console.error('Error fetching API configurations:', configError);
        return null;
      }

      // Combine both sources of API settings
      const settings: Record<string, string> = {};
      
      // Add settings from user_settings
      userSettings?.forEach(setting => {
        const key = setting.settings.key.replace(/-api-key$/, "");
        if (setting.value && 
            typeof setting.value === 'object' && 
            'key' in setting.value && 
            typeof setting.value.key === 'string') {
          settings[key] = setting.value.key;
        }
      });

      // Add settings from api_configurations
      apiConfigs?.forEach(config => {
        const key = config.api_type.toLowerCase();
        if (config.is_enabled) {
          settings[key] = 'configured';
        }
      });

      return Object.keys(settings).length > 0 ? settings : null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  return {
    apiSettings,
    getDefaultProvider: () => {
      if (!apiSettings) return null;
      // Check for configured providers in order of preference
      if (apiSettings.openai) return 'openai';
      if (apiSettings.anthropic) return 'anthropic';
      if (apiSettings.gemini) return 'gemini';
      if (apiSettings.perplexity) return 'perplexity';
      return null;
    }
  };
};