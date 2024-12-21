import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";
import { GeneralSettingsForm } from "./general/GeneralSettingsForm";

export function GeneralSettings() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  const handleChange = useCallback((key: string, value: string) => {
    updatePreferences({ [key]: value });
  }, [updatePreferences]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your general application preferences.
        </p>
      </div>

      <GeneralSettingsForm
        preferences={preferences}
        onPreferenceChange={handleChange}
      />
    </div>
  );
}