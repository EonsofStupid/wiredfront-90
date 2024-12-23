import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatAPI = () => {
  const { data: apiSettings } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: settings, error } = await supabase
        .from('user_settings')
        .select(`
          value,
          settings!inner(key)
        `)
        .eq('user_id', user.id)
        .in('settings.key', [
          'openai-api-key',
          'gemini-api-key',
          'anthropic-api-key'
        ]);

      if (error) {
        console.error('Error fetching API settings:', error);
        return null;
      }

      // Transform settings into a more usable format
      return settings?.reduce((acc, setting) => {
        const key = setting.settings.key.replace(/-api-key$/, "");
        // Safely access the value assuming it's a JSON object with a key field
        const apiKey = typeof setting.value === 'object' && setting.value && 'key' in setting.value 
          ? (setting.value as { key: string }).key 
          : null;
        if (apiKey) {
          acc[key] = apiKey;
        }
        return acc;
      }, {} as Record<string, string>) || null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  return {
    apiSettings,
    getDefaultProvider: () => {
      if (!apiSettings) return null;
      if (apiSettings.openai) return 'openai';
      if (apiSettings.gemini) return 'gemini';
      if (apiSettings.anthropic) return 'anthropic';
      return null;
    }
  };
};