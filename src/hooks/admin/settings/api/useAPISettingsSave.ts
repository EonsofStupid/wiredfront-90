
import { supabase } from "@/integrations/supabase/client";
import { APISettingsState } from "@/types/admin/settings/types";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { APIType } from "@/types/admin/settings/api-configuration";

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
      
      const apiConfigs = [
        { key: 'openaiKey', type: 'openai' as APIType, name: 'OpenAI Configuration' },
        { key: 'anthropicKey', type: 'anthropic' as APIType, name: 'Anthropic Configuration' },
        { key: 'geminiKey', type: 'gemini' as APIType, name: 'Gemini Configuration' },
        { key: 'huggingfaceKey', type: 'huggingface' as APIType, name: 'HuggingFace Configuration' }
      ];

      for (const config of apiConfigs) {
        const apiKey = settings[config.key as keyof APISettingsState];
        if (apiKey) {
          const { data: existingConfig, error: queryError } = await supabase
            .from('api_configurations')
            .select('id')
            .eq('user_id', user.id)
            .eq('api_type', config.type)
            .maybeSingle();

          if (queryError) throw queryError;

          const configData = {
            api_type: config.type,
            is_enabled: true,
            is_default: config.type === 'openai',
            memorable_name: config.name,
            validation_status: 'pending' as const
          };

          if (existingConfig) {
            const { error: updateError } = await supabase
              .from('api_configurations')
              .update(configData)
              .eq('id', existingConfig.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from('api_configurations')
              .insert([configData]);

            if (insertError) throw insertError;
          }
        }
      }

      logger.info('API settings saved successfully');
      toast.success("API settings have been saved");
    } catch (error) {
      logger.error('Error saving API settings:', error);
      toast.error("Failed to save API settings");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave };
}
