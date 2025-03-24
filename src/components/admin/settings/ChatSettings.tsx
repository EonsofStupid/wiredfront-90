
import { useState, useEffect } from "react";
import { useMessageStore } from "@/components/chat/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SettingsContainer } from "./layout/SettingsContainer";
import { toast } from "sonner";
import { ChatSettingsTabs } from "./chat/ChatSettingsTabs";
import { useChatStore } from "@/components/chat/store/chatStore";
import { saveUserChatPreferences, loadUserChatPreferences } from "@/components/chat/store/actions/feature/toggle/toggle-utils";

export function ChatSettings() {
  const { clearMessages } = useMessageStore();
  const { refreshSessions } = useSessionManager();
  const { position, togglePosition, setIsHidden } = useChatStore(); 
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
    iconStyle: "default",
    
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
  
  // Load user preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await loadUserChatPreferences();
        if (prefs) {
          // Update settings with loaded preferences
          setSettings(prev => ({
            ...prev,
            iconStyle: prefs.icon_style || 'default'
          }));
        }
      } catch (error) {
        console.error("Failed to load user preferences", error);
      }
    };
    
    loadPreferences();
  }, []);
  
  const handleSettingChange = async (section: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Special handling for icon style changes - save immediately to database
    if (setting === 'iconStyle') {
      const success = await saveUserChatPreferences({
        iconStyle: value as 'default' | 'wfpulse' | 'retro'
      });
      
      if (success) {
        toast.success(`Chat icon style updated to ${value}`);
        
        // Update the chat store state
        if (useChatStore.setState) {
          useChatStore.setState({ iconStyle: value });
        }
      } else {
        toast.error("Failed to save icon style preferences");
      }
    }
  };
  
  const handleSave = async () => {
    // Save settings to database
    const success = await saveUserChatPreferences({
      iconStyle: settings.iconStyle as 'default' | 'wfpulse' | 'retro',
      theme: settings.darkMode ? 'dark' : 'light',
      position: position
    });
    
    if (success) {
      toast.success("Chat settings saved successfully");
    } else {
      toast.error("Failed to save settings");
    }
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
