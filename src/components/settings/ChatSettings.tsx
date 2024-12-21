import { useState } from "react";
import { useChatSettings } from "@/hooks/settings/useChatSettings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChatSettingsSection } from "./chat/ChatSettingsSection";

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
      <ChatSettingsSection settings={settings} updateSettings={updateSettings} />
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