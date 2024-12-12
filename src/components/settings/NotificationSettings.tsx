import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const { preferences, updatePreferences } = useSettings();

  const handleNotificationChange = (enabled: boolean) => {
    updatePreferences({ notifications: enabled });
  };

  return (
    <div className="settings-notifications">
      <h2 className="settings-notifications__title text-lg font-semibold mb-4">Notification Settings</h2>
      <div className="settings-notifications__form grid gap-4">
        <div className="settings-notifications__form-group flex items-center justify-between">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch
            id="notifications"
            checked={preferences.notifications}
            onCheckedChange={handleNotificationChange}
          />
        </div>
      </div>
    </div>
  );
}