import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatGeneralSettings } from "./ChatGeneralSettings";
import { ChatMessageBehavior } from "./ChatMessageBehavior";
import { ChatUICustomization } from "./ChatUICustomization";
import { ChatSettings as ChatSettingsType } from "@/hooks/settings/types";

interface ChatSettingsFormProps {
  settings: ChatSettingsType;
  updateSettings: (updates: Partial<ChatSettingsType>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function ChatSettingsForm({ settings, updateSettings, onSave, isSaving }: ChatSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Chat Settings</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure your chat client behavior and appearance.
        </p>
      </div>

      <ChatGeneralSettings settings={settings} updateSettings={updateSettings} />
      <ChatMessageBehavior settings={settings} updateSettings={updateSettings} />
      <ChatUICustomization settings={settings} updateSettings={updateSettings} />

      <Button
        onClick={onSave}
        disabled={isSaving}
        className="w-full md:w-auto"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}