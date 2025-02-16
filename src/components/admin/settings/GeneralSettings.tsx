import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsContainer } from "./layout/SettingsContainer";
import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";

export function GeneralSettings() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  const handlePreferenceChange = useCallback((key: string, value: string) => {
    updatePreferences({ [key]: value });
  }, [updatePreferences]);

  return (
    <SettingsContainer
      title="General Settings"
      description="Configure your general application preferences."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={preferences.username}
            onChange={(e) => handlePreferenceChange('username', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={preferences.timezone}
            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
          />
        </div>
      </div>
    </SettingsContainer>
  );
}