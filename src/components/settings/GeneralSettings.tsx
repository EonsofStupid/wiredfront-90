import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";
import { GeneralSettingsSection } from "./general/GeneralSettingsSection";

export function GeneralSettings() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  const handleChange = useCallback((key: string, value: string) => {
    updatePreferences({ [key]: value });
  }, [updatePreferences]);

  return (
    <div className="space-y-6">
      <GeneralSettingsSection
        preferences={preferences}
        onPreferenceChange={handleChange}
      />
    </div>
  );
}