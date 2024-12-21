import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatSettings } from "@/hooks/settings/types";

interface ChatUICustomizationProps {
  settings: ChatSettings;
  updateSettings: (updates: Partial<ChatSettings>) => void;
}

export function ChatUICustomization({ settings, updateSettings }: ChatUICustomizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UI Customization</CardTitle>
        <CardDescription>Customize the chat appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chatbot-name">Chatbot Name</Label>
          <Input
            id="chatbot-name"
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
          <Label htmlFor="avatar-url">Avatar URL</Label>
          <Input
            id="avatar-url"
            value={settings.ui_customizations.avatar_url || ''}
            onChange={(e) => updateSettings({
              ui_customizations: {
                ...settings.ui_customizations,
                avatar_url: e.target.value
              }
            })}
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeholder-text">Message Placeholder</Label>
          <Input
            id="placeholder-text"
            value={settings.ui_customizations.placeholder_text}
            onChange={(e) => updateSettings({
              ui_customizations: {
                ...settings.ui_customizations,
                placeholder_text: e.target.value
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
      </CardContent>
    </Card>
  );
}