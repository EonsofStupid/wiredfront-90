import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChatSettings } from "@/hooks/settings/types";

interface ChatGeneralSettingsProps {
  settings: ChatSettings;
  updateSettings: (updates: Partial<ChatSettings>) => void;
}

export function ChatGeneralSettings({ settings, updateSettings }: ChatGeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Enable or disable the chat client</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="chat-enabled">Enable Chat</Label>
          <Switch
            id="chat-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}