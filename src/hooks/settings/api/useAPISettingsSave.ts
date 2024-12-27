import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";
import { APIType } from "@/types/store/settings/api-config";

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
        { key: 'openaiKey', type: 'openai' as APIType },
        { key: 'anthropicKey', type: 'anthropic' as APIType },
        { key: 'geminiKey', type: 'gemini' as APIType },
        { key: 'huggingfaceKey', type: 'huggingface' as APIType }
      ];

      for (const config of apiConfigs) {
        const apiKey = settings[config.key as keyof APISettingsState];
        if (apiKey) {
          // First, check if configuration exists
          const { data: existingConfig, error: queryError } = await supabase
            .from('api_configurations')
            .select('id')
            .eq('user_id', user.id)
            .eq('api_type', config.type)
            .maybeSingle();

          if (queryError) {
            logger.error('Error querying API configuration:', queryError);
            throw queryError;
          }

          if (existingConfig) {
            // Update existing configuration
            const { error: updateError } = await supabase
              .from('api_configurations')
              .update({
                is_enabled: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingConfig.id);

            if (updateError) {
              throw updateError;
            }
          } else {
            // Create new configuration
            const { error: insertError } = await supabase
              .from('api_configurations')
              .insert({
                user_id: user.id,
                api_type: config.type,
                is_enabled: true,
                is_default: config.type === 'openai'
              });

            if (insertError) {
              throw insertError;
            }
          }
        }
      }

      // Update chat settings
      const { error: chatSettingsError } = await supabase
        .from('chat_settings')
        .upsert({
          user_id: user.id,
          api_provider: settings.openaiKey ? 'openai' : 
                       settings.geminiKey ? 'gemini' : 
                       settings.anthropicKey ? 'anthropic' : 
                       settings.huggingfaceKey ? 'huggingface' : 'openai',
          enabled: true,
          ui_customizations: {
            theme: 'default',
            chatbot_name: 'AI Assistant',
            placeholder_text: 'Type a message...'
          }
        });

      if (chatSettingsError) {
        throw chatSettingsError;
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