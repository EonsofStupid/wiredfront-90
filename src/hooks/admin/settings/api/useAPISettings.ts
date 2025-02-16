import { useAPISettingsState } from "./useAPISettingsState";
import { useAPISettingsLoad } from "./useAPISettingsLoad";
import { useAPISettingsSave } from "./useAPISettingsSave";

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
      throw new Error("You must be logged in to save settings");
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