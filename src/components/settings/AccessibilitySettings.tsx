import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AccessibilitySettings() {
  const { preferences, updatePreferences } = useSettings();

  const handleTimezoneChange = (timezone: string) => {
    updatePreferences({ timezone });
  };

  const handleRefreshIntervalChange = (interval: string) => {
    updatePreferences({ refreshInterval: parseInt(interval, 10) });
  };

  return (
    <div className="settings-accessibility">
      <h2 className="settings-accessibility__title text-lg font-semibold mb-4">Accessibility Settings</h2>
      <div className="settings-accessibility__form grid gap-4">
        <div className="settings-accessibility__form-group grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={preferences.timezone}
            onValueChange={handleTimezoneChange}
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="settings-accessibility__form-group grid gap-2">
          <Label htmlFor="refreshInterval">Refresh Interval</Label>
          <Select
            value={preferences.refreshInterval.toString()}
            onValueChange={handleRefreshIntervalChange}
          >
            <SelectTrigger id="refreshInterval">
              <SelectValue placeholder="Select refresh interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15000">15 seconds</SelectItem>
              <SelectItem value="30000">30 seconds</SelectItem>
              <SelectItem value="60000">1 minute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}