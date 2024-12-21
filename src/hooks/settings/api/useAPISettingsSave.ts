import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APISettingsState } from "@/types/store/settings/api";

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

      toast.success("API settings have been saved successfully");
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast.error("Failed to save API settings. Please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave };
}