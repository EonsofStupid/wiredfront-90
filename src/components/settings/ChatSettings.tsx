import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChatSettings } from "@/hooks/settings/useChatSettings";
import { toast } from "sonner";
import { ChatGeneralSettings } from "./chat/ChatGeneralSettings";
import { ChatMessageBehavior } from "./chat/ChatMessageBehavior";
import { ChatUICustomization } from "./chat/ChatUICustomization";

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
        onClick={handleSave}
        disabled={isSaving}
        className="w-full md:w-auto"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}