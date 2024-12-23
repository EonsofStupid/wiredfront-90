import { useState } from "react";
import { APISettingsState } from "@/types/store/settings/api";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";

const defaultSettings: APISettingsState = {
  openaiKey: "",
  huggingfaceKey: "",
  geminiKey: "",
  anthropicKey: "",
  perplexityKey: "",
  elevenLabsKey: "",
  selectedVoice: "",
  googleDriveKey: "",
  dropboxKey: "",
  awsAccessKey: "",
  awsSecretKey: "",
  githubToken: "",
  dockerToken: "",
};

export function useAPISettingsState() {
  const [settings, setSettings] = useState<APISettingsState>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const updateSetting = (key: keyof APISettingsState, value: string) => {
    try {
      // Validate key format based on provider
      if (key === 'openaiKey' && !value.startsWith('sk-')) {
        toast.error('Invalid OpenAI API key format');
        return;
      }
      if (key === 'anthropicKey' && !value.startsWith('sk-ant-')) {
        toast.error('Invalid Anthropic API key format');
        return;
      }

      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Cache settings for offline use
      localStorage.setItem('api_settings', JSON.stringify({
        ...settings,
        [key]: value
      }));
      
      logger.info('API setting updated', { key });
    } catch (error) {
      logger.error('Error updating API setting', { error, key });
      toast.error('Failed to update API setting');
    }
  };

  const loadOfflineSettings = () => {
    try {
      const cached = localStorage.getItem('api_settings');
      if (cached) {
        setSettings(JSON.parse(cached));
        setOfflineMode(true);
        toast.info('Loaded settings from offline cache');
      }
    } catch (error) {
      logger.error('Error loading offline settings', { error });
    }
  };

  return {
    settings,
    setSettings,
    isSaving,
    setIsSaving,
    user,
    setUser,
    updateSetting,
    offlineMode,
    loadOfflineSettings
  };
}