import { useAPISettingsState } from "./api/useAPISettingsState";
import { useAPISettingsLoad } from "./api/useAPISettingsLoad";
import { useAPISettingsSave } from "./api/useAPISettingsSave";
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
