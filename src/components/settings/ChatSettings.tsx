import { useState } from "react";
import { useChatSettings } from "@/hooks/settings/useChatSettings";
import { toast } from "sonner";
import { ChatSettingsForm } from "./chat/ChatSettingsForm";

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
    <ChatSettingsForm
      settings={settings}
      updateSettings={updateSettings}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}