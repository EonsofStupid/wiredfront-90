import { useAPISettingsState } from "./useAPISettingsState";
import { useAPISettingsLoad } from "./useAPISettingsLoad";
import { useAPISettingsSave } from "./useAPISettingsSave";
import { toast } from "sonner";

export function useAPISettings() {
  const {
    settings,
    setSettings,
    isSaving,
    setIsSaving,
    user,
    setUser,
    updateSetting,
    offlineMode,
    loadOfflineSettings
  } = useAPISettingsState();

  useAPISettingsLoad(setUser, setSettings);
  const { handleSave: saveSettings } = useAPISettingsSave();

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    setIsSaving(true);
    try {
      await saveSettings(user, settings, setIsSaving);
    } catch (error) {
      console.error('Error saving API settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user,
    offlineMode,
    loadOfflineSettings
  };
}