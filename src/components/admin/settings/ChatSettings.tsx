
import { useState } from "react";
import { useMessageStore } from "@/components/chat/messaging/MessageManager";
import { useChatSessionManager } from "@/hooks/useChatSessionManager";
import { SettingsContainer } from "./layout/SettingsContainer";
import { toast } from "sonner";
import { ChatSettingsTabs } from "./chat/ChatSettingsTabs";

export function ChatSettings() {
  const { clearMessages } = useMessageStore();
  const { refreshSessions } = useSessionManager();
  const [activeTab, setActiveTab] = useState("general");
  
  const [settings, setSettings] = useState({
    // General settings
    defaultModel: "gpt-4",
    systemPrompt: "You are a helpful AI assistant.",
    temperature: 0.7,
    maxTokens: 2048,
    streamingEnabled: true,
    
    // Privacy settings
    saveHistory: true,
    anonymizeData: false,
    dataRetentionDays: 30,
    allowAnalytics: true,
    
    // UI settings
    darkMode: true,
    fontSize: "medium",
    messageAlignment: "left",
    showTimestamps: true,
    
    // Advanced settings
    debugMode: false,
    experimentalFeatures: false,
    apiTimeout: 60,
    retryAttempts: 3,
    
    // Notification settings
    soundEnabled: true,
    desktopNotifications: false,
    mentionAlerts: true,
    emailDigest: false
  });
  
  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleSave = () => {
    // Save settings logic would go here
    toast.success("Chat settings saved successfully");
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearMessages();
      refreshSessions();
      toast.success("Chat history cleared successfully");
    }
  };

  return (
    <SettingsContainer
      title="Chat System Settings"
      description="Configure the behavior and features of the chat system."
    >
      <ChatSettingsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        handleSettingChange={handleSettingChange}
        handleClearHistory={handleClearHistory}
        handleSave={handleSave}
      />
    </SettingsContainer>
  );
}
