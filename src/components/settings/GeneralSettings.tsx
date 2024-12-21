import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";

export function GeneralSettings() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  const handleChange = useCallback((key: keyof typeof preferences, value: string) => {
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={preferences.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={preferences.language}
            onChange={(e) => handleChange('language', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={preferences.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}