import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SettingsContainer } from "./layout/SettingsContainer";
import { ChatSettingsTabs } from "./chat/ChatSettingsTabs";
import { useChatBridge } from "@chat/ChatBridge";
import { ChatSettingsSchema, ChatSettingsType } from "@chat/shared/schemas/chatSettingsSchema";


// ✅ Define your settings schema
const ChatSettingsSchema = z.object({
  defaultModel: z.string(),
  systemPrompt: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  streamingEnabled: z.boolean(),

  saveHistory: z.boolean(),
  anonymizeData: z.boolean(),
  dataRetentionDays: z.number().min(0),
  allowAnalytics: z.boolean(),

  darkMode: z.boolean(),
  fontSize: z.enum(["small", "medium", "large"]),
  messageAlignment: z.enum(["left", "center", "right"]),
  showTimestamps: z.boolean(),

  debugMode: z.boolean(),
  experimentalFeatures: z.boolean(),
  apiTimeout: z.number().min(1),
  retryAttempts: z.number().min(0),

  soundEnabled: z.boolean(),
  desktopNotifications: z.boolean(),
  mentionAlerts: z.boolean(),
  emailDigest: z.boolean()
});

type ChatSettingsType = z.infer<typeof ChatSettingsSchema>;

export function ChatSettings() {
  const {
    clearMessages,
    updateChatSettings,
    updateTokens,
  } = useChatBridge();

  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState<ChatSettingsType>({
    defaultModel: "gpt-4",
    systemPrompt: "You are a helpful AI assistant.",
    temperature: 0.7,
    maxTokens: 2048,
    streamingEnabled: true,

    saveHistory: true,
    anonymizeData: false,
    dataRetentionDays: 30,
    allowAnalytics: true,

    darkMode: true,
    fontSize: "medium",
    messageAlignment: "left",
    showTimestamps: true,

    debugMode: false,
    experimentalFeatures: false,
    apiTimeout: 60,
    retryAttempts: 3,

    soundEnabled: true,
    desktopNotifications: false,
    mentionAlerts: true,
    emailDigest: false
  });

  const handleSettingChange = (section: string, setting: keyof ChatSettingsType, value: any) => {
    setSettings(prev => {
      const updated = { ...prev, [setting]: value };
      return updated;
    });
  };

  const handleSave = () => {
    const result = ChatSettingsSchema.safeParse(settings);
    if (!result.success) {
      toast.error("Invalid chat settings. Please check your input.");
      console.error(result.error.format());
      return;
    }

    updateChatSettings(settings);
    toast.success("Chat settings saved successfully");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearMessages();
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
