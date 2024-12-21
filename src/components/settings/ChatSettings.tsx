import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatSettings } from "@/hooks/settings/useChatSettings";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { MessageBehavior } from "@/hooks/settings/types";

export function ChatSettings() {
  const {
    settings,
    isLoading,
    updateSettings,
    saveSettings
  } = useChatSettings();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      toast.success("Chat settings saved successfully");
    } catch (error) {
      console.error('Failed to save chat settings:', error);
      toast.error("Failed to save chat settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chat Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your chat client behavior and appearance.
        </p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Message Behavior</CardTitle>
          <CardDescription>Configure how messages are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Send Message On</Label>
            <Select
              value={settings.message_behavior}
              onValueChange={(value: MessageBehavior) => updateSettings({ message_behavior: value })}
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
        </CardContent>
      </Card>

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

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full md:w-auto"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}