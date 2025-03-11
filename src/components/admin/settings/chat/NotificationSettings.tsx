
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettingsProps {
  settings: {
    soundEnabled: boolean;
    desktopNotifications: boolean;
    mentionAlerts: boolean;
    emailDigest: boolean;
  };
  handleSettingChange: (section: string, setting: string, value: any) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  handleSettingChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how you receive alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="soundEnabled">Sound Effects</Label>
            <p className="text-xs text-muted-foreground">
              Play sounds for new messages and events
            </p>
          </div>
          <Switch
            id="soundEnabled"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'soundEnabled', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Show browser notifications when you receive messages
            </p>
          </div>
          <Switch
            id="desktopNotifications"
            checked={settings.desktopNotifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'desktopNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="mentionAlerts">Mention Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Get notified when you are mentioned in a message
            </p>
          </div>
          <Switch
            id="mentionAlerts"
            checked={settings.mentionAlerts}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'mentionAlerts', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailDigest">Email Digest</Label>
            <p className="text-xs text-muted-foreground">
              Receive a summary of activity by email
            </p>
          </div>
          <Switch
            id="emailDigest"
            checked={settings.emailDigest}
            onCheckedChange={(checked) => handleSettingChange('notifications', 'emailDigest', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
