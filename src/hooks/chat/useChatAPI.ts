import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useChatAPI = () => {
  const { data: apiSettings } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return null;
        }

        // First check api_configurations table
        const { data: apiConfigs, error: configError } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_enabled', true);

        if (configError) {
          console.error('Error fetching API configurations:', configError);
          throw configError;
        }

        // Then check user_settings table for API keys
        const { data: userSettings, error: userError } = await supabase
          .from('user_settings')
          .select(`
            value,
            encrypted_value,
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
          throw userError;
        }

        const settings: Record<string, string> = {};

        // Add settings from api_configurations
        apiConfigs?.forEach(config => {
          if (config.is_enabled) {
            settings[config.api_type.toLowerCase()] = 'configured';
          }
        });

        // Add settings from user_settings
        for (const setting of userSettings || []) {
          const key = setting.settings.key.replace(/-api-key$/, "");
          
          if (setting.encrypted_value) {
            try {
              const { data: decrypted } = await supabase.rpc('decrypt_setting_value', {
                encrypted_value: setting.encrypted_value
              });
              
              if (decrypted && typeof decrypted === 'object' && 'key' in decrypted) {
                settings[key] = String(decrypted.key);
              }
            } catch (error) {
              console.error('Error decrypting setting value:', error);
            }
          } else if (
            setting.value && 
            typeof setting.value === 'object' && 
            'key' in setting.value && 
            setting.value.key
          ) {
            settings[key] = String(setting.value.key);
          }
        }

        console.log('API settings loaded:', Object.keys(settings));
        return settings;
      } catch (error) {
        console.error('Error in API settings query:', error);
        toast.error('Failed to load API settings');
        throw error;
      }
    },
    gcTime: 5 * 60 * 1000, // Keep in garbage collection for 5 minutes
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });

  const getDefaultProvider = () => {
    if (!apiSettings) return null;
    
    // Check for configured providers in order of preference
    if (apiSettings.openai) return 'openai';
    if (apiSettings.anthropic) return 'anthropic';
    if (apiSettings.gemini) return 'gemini';
    if (apiSettings.perplexity) return 'perplexity';
    return null;
  };

  return {
    apiSettings,
    getDefaultProvider
  };
};