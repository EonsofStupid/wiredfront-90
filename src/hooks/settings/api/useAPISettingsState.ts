import { useState } from "react";
import { APISettingsState } from "@/types/store/settings/api";

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

  const updateSetting = (key: keyof APISettingsState, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    setSettings,
    isSaving,
    setIsSaving,
    user,
    setUser,
    updateSetting,
  };
}