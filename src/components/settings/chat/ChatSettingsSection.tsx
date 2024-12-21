import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SettingsContainer } from "../layout/SettingsContainer";
import { ChatSettings } from "@/hooks/settings/types";

interface ChatSettingsSectionProps {
  settings: ChatSettings;
  updateSettings: (updates: Partial<ChatSettings>) => void;
}

export function ChatSettingsSection({ settings, updateSettings }: ChatSettingsSectionProps) {
  return (
    <SettingsContainer
      title="Chat Settings"
      description="Configure your chat client behavior and appearance."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="chat-enabled">Enable Chat</Label>
          <Switch
            id="chat-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Message Behavior</Label>
          <Select
            value={settings.message_behavior}
            onValueChange={(value: any) => updateSettings({ message_behavior: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select behavior" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enter_send">Enter to Send</SelectItem>
              <SelectItem value="enter_newline">Enter for New Line</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Chatbot Name</Label>
          <Input
            value={settings.ui_customizations.chatbot_name}
            onChange={(e) => updateSettings({
              ui_customizations: {
                ...settings.ui_customizations,
                chatbot_name: e.target.value
              }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={settings.ui_customizations.theme}
            onValueChange={(value) => updateSettings({
              ui_customizations: {
                ...settings.ui_customizations,
                theme: value
              }
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsContainer>
  );
}