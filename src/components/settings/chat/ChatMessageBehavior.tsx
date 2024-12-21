import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatSettings, MessageBehavior } from "@/hooks/settings/types";

interface ChatMessageBehaviorProps {
  settings: ChatSettings;
  updateSettings: (updates: Partial<ChatSettings>) => void;
}

export function ChatMessageBehavior({ settings, updateSettings }: ChatMessageBehaviorProps) {
  return (
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
  );
}