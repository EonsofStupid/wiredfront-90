import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";

export function GeneralSettings() {
  const { preferences, updatePreferences } = useSettingsStore((state) => ({
    preferences: state.preferences,
    updatePreferences: state.updatePreferences,
  }));

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
            onChange={(e) => updatePreferences({ username: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={preferences.language}
            onChange={(e) => updatePreferences({ language: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={preferences.timezone}
            onChange={(e) => updatePreferences({ timezone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}