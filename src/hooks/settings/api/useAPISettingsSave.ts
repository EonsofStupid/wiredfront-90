import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";

export function useAPISettingsSave() {
  const handleSave = async (
    user: any,
    settings: APISettingsState,
    setIsSaving: (saving: boolean) => void
  ) => {
    if (!user) {
      toast.error("Please log in to save API settings");
      return;
    }

    setIsSaving(true);
    
    try {
      logger.info('Starting API settings save...');
      
      // Create or update API configurations
      const apiTypes = {
        openai: settings.openaiKey,
        anthropic: settings.anthropicKey,
        gemini: settings.geminiKey,
        huggingface: settings.huggingfaceKey
      };

      for (const [apiType, apiKey] of Object.entries(apiTypes)) {
        if (apiKey) {
          const { error } = await supabase
            .from('api_configurations')
            .upsert({
              user_id: user.id,
              api_type: apiType,
              is_enabled: true,
              is_default: apiType === 'openai' // Set OpenAI as default
            }, {
              onConflict: 'user_id,api_type'
            });

          if (error) {
            logger.error(`Error saving ${apiType} configuration:`, error);
            throw error;
          }
        }
      }

      // Update local cache
      localStorage.setItem('api_settings', JSON.stringify(settings));
      
      logger.info('API settings saved successfully');
      toast.success("API settings have been saved");
      setIsSaving(false);
    } catch (error) {
      logger.error('Error saving API settings:', error);
      setIsSaving(false);
      toast.error("Failed to save API settings");
    }
  };

  return { handleSave };
}