import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { APISettingsState } from "@/types/store/settings";
import { useSettingsCache } from "./useSettingsCache";
import { fetchUserSettings, saveUserSetting } from "./useSettingsQueries";
import { isSettingValue, UseAPISettingsReturn } from "./types";
import { supabase } from "@/integrations/supabase/client";

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

export function useAPISettings(): UseAPISettingsReturn {
  const [settings, setSettings] = useState<APISettingsState>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { getCachedValue, setCachedValue, invalidateCache } = useSettingsCache();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to manage API settings");
        navigate("/login");
        return;
      }
      setUser(session.user);

      if (session.user) {
        try {
          const { settingKeyToId, userSettings } = await fetchUserSettings(session.user.id);
          
          if (userSettings) {
            const newSettings = { ...settings };
            userSettings.forEach(setting => {
              if (!isSettingValue(setting.value)) return;
              
              const settingKey = Object.entries(settingKeyToId).find(
                ([_, id]) => id === setting.setting_id
              )?.[0];

              if (!settingKey) return;

              const key = settingKey.replace(/-api-key$/, "Key")
                .replace(/-token$/, "Token")
                .replace(/^aws-/, "aws")
                .replace(/^google-drive/, "googleDrive")
                .replace(/^elevenlabs-voice/, "selectedVoice");

              const cachedValue = getCachedValue(setting.setting_id);
              if (cachedValue) {
                (newSettings as any)[key] = cachedValue;
              } else {
                (newSettings as any)[key] = setting.value.key;
                setCachedValue(setting.setting_id, setting.value.key);
              }
            });
            setSettings(newSettings);
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          toast.error("Failed to load API settings");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please log in to save API settings");
      navigate("/login");
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
          await saveUserSetting(user.id, settingKeyToId[key], value);
          setCachedValue(settingKeyToId[key], value);
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

  const updateSetting = (key: keyof APISettingsState, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user
  };
}