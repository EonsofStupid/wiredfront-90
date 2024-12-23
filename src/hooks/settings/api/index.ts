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
  } = useAPISettingsState();

  useAPISettingsLoad(setUser, setSettings);
  const { handleSave } = useAPISettingsSave();

  return {
    settings,
    updateSetting,
    isSaving,
    handleSave: () => handleSave(user, settings, setIsSaving),
    user
  };
}