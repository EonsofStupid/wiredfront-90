
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";
import { useChatBridgeSync } from "../chat/useChatBridgeSync";

export function NotificationSettings() {
  const { notifications, updateNotifications } = useSettingsStore((state) => ({
    notifications: state.notifications,
    updateNotifications: state.updateNotifications,
  }));
  
  const { syncBridgeToStore } = useChatBridgeSync();
  
  const handleNotificationChange = (key: string, value: boolean) => {
    updateNotifications({ [key]: value });
    // Sync to chat bridge
    syncBridgeToStore();
  };

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
              handleNotificationChange('email', checked)
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
              handleNotificationChange('push', checked)
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
              handleNotificationChange('marketing', checked)
            }
          />
        </div>
      </div>
    </div>
  );
}
