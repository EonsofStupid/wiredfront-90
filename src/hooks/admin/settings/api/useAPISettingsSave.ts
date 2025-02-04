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
        { key: 'openaiKey', type: 'openai' as APIType },
        { key: 'anthropicKey', type: 'anthropic' as APIType },
        { key: 'geminiKey', type: 'gemini' as APIType },
        { key: 'huggingfaceKey', type: 'huggingface' as APIType }
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

          if (existingConfig) {
            const { error: updateError } = await supabase
              .from('api_configurations')
              .update({
                is_enabled: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingConfig.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from('api_configurations')
              .insert({
                user_id: user.id,
                api_type: config.type,
                is_enabled: true,
                is_default: config.type === 'openai'
              });

            if (insertError) throw insertError;
          }
        }
      }

      const activeProvider = settings.openaiKey ? 'openai' : 
                           settings.geminiKey ? 'gemini' : 
                           settings.anthropicKey ? 'anthropic' : 
                           settings.huggingfaceKey ? 'huggingface' : 'openai';

      const { error: chatSettingsError } = await supabase
        .from('chat_settings')
        .upsert({
          user_id: user.id,
          api_provider: activeProvider,
          enabled: true,
          message_behavior: 'enter_send',
          ui_customizations: {
            theme: 'default',
            chatbot_name: 'AI Assistant',
            placeholder_text: 'Type a message...'
          },
          max_tokens: 1000,
          temperature: 0.7,
          offline_mode_enabled: true,
          max_offline_messages: 100,
          rate_limit_per_minute: 60
        });

      if (chatSettingsError) throw chatSettingsError;

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