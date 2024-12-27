import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

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
    let retryCount = 0;

    const attemptSave = async (): Promise<boolean> => {
      try {
        const { data: allSettings, error: settingsError } = await supabase
          .from('settings')
          .select('id, key');
        
        if (settingsError) throw settingsError;

        const settingKeyToId = allSettings?.reduce((acc: Record<string, string>, setting) => {
          acc[setting.key] = setting.id;
          return acc;
        }, {}) || {};

        const apiKeys = {
          'openai-api-key': settings.openaiKey,
          'huggingface-api-key': settings.huggingfaceKey,
          'gemini-api-key': settings.geminiKey,
          'anthropic-api-key': settings.anthropicKey,
          'perplexity-api-key': settings.perplexityKey,
          'elevenlabs-api-key': settings.elevenLabsKey,
          'elevenlabs-voice': settings.selectedVoice,
          'google-drive-api-key': settings.googleDriveKey,
          'dropbox-api-key': settings.dropboxKey,
          'aws-access-key': settings.awsAccessKey,
          'aws-secret-key': settings.awsSecretKey,
          'github-token': settings.githubToken,
          'docker-token': settings.dockerToken,
        };

        logger.info('Saving API settings:', apiKeys);

        // Save settings with encryption
        for (const [key, value] of Object.entries(apiKeys)) {
          if (value && settingKeyToId[key]) {
            const { error } = await supabase
              .from('user_settings')
              .upsert({
                user_id: user.id,
                setting_id: settingKeyToId[key],
                value: { key: value }
              });

            if (error) throw error;
          }
        }

        // Update local cache
        localStorage.setItem('api_settings', JSON.stringify(settings));
        
        logger.info('API settings saved successfully');
        toast.success("API settings have been saved successfully");
        return true;
      } catch (error) {
        logger.error('Error saving API settings:', error);
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptSave();
        }
        
        toast.error("Failed to save API settings. Changes saved locally.");
        return false;
      }
    };

    try {
      await attemptSave();
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave };
}