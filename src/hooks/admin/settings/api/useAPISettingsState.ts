import { useState } from "react";
import { APISettingsState } from "@/types/admin/settings/api";
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
    setSettings(prev => ({ ...prev, [key]: value }));
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
      logger.error('Error loading offline settings:', error);
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