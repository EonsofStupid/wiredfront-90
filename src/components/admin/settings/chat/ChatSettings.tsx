
import { useSettingsStore } from "@/stores/settings";
import { useState } from "react";
import { SettingsContainer } from "../layout/SettingsContainer";
import { ChatSettingsTabs } from "./ChatSettingsTabs";
import { useChatBridgeSync } from "./useChatBridgeSync";

export function ChatSettings() {
  const { preferences, updatePreferences } = useSettingsStore();
  const [activeTab, setActiveTab] = useState("general");
  const { syncBridgeToStore } = useChatBridgeSync();

  const handleSettingChange = (
    section: string,
    setting: string,
    value: any
  ) => {
    updatePreferences({
      [section]: {
        ...preferences[section],
        [setting]: value,
      },
    });
    
    // Sync changes to ChatBridge
    syncBridgeToStore();
  };

  const handleClearHistory = () => {
    // Implement clear history logic
    console.log("Clearing chat history...");
  };

  const handleSave = () => {
    // Sync settings to ChatBridge
    syncBridgeToStore();
    console.log("Saving chat settings...");
  };

  return (
    <SettingsContainer
      title="Chat Settings"
      description="Configure your chat experience and preferences"
    >
      <ChatSettingsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={preferences}
        handleSettingChange={handleSettingChange}
        handleClearHistory={handleClearHistory}
        handleSave={handleSave}
      />
    </SettingsContainer>
  );
}
