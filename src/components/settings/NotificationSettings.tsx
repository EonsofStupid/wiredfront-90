import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";

export function NotificationSettings() {
  const { notifications, updateNotifications } = useSettingsStore((state) => ({
    notifications: state.notifications,
    updateNotifications: state.updateNotifications,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you want to receive notifications.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) =>
              updateNotifications({ email: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={notifications.push}
            onCheckedChange={(checked) =>
              updateNotifications({ push: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-notifications">Marketing Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features and promotions
            </p>
          </div>
          <Switch
            id="marketing-notifications"
            checked={notifications.marketing}
            onCheckedChange={(checked) =>
              updateNotifications({ marketing: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}