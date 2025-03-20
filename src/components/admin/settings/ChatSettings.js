import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useMessageStore } from "@/components/chat/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SettingsContainer } from "./layout/SettingsContainer";
import { toast } from "sonner";
import { ChatSettingsTabs } from "./chat/ChatSettingsTabs";
import ChatFeatureSettings from "./ChatFeatureSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
        emailDigest: false,
        // Appearance settings
        chatBackground: "rgba(0, 0, 0, 0.3)",
        userMessageColor: "#8B5CF6",
        assistantMessageColor: "#374151",
        chatWidth: 400,
        chatHeight: 500
    });
    // Initialize settings with CSS variable values
    useEffect(() => {
        // Get computed styles
        const computedStyle = getComputedStyle(document.documentElement);
        // Extract values from CSS variables with fallbacks
        const chatBg = computedStyle.getPropertyValue('--chat-bg').trim() || "rgba(0, 0, 0, 0.3)";
        const userMsgBg = computedStyle.getPropertyValue('--chat-message-user-bg').trim() || "#8B5CF6";
        const assistantMsgBg = computedStyle.getPropertyValue('--chat-message-assistant-bg').trim() || "#374151";
        // Parse width and height values from CSS variables
        const widthValue = computedStyle.getPropertyValue('--chat-width').trim();
        const heightValue = computedStyle.getPropertyValue('--chat-height').trim();
        const chatWidth = parseInt(widthValue) || 400;
        const chatHeight = parseInt(heightValue) || 500;
        // Update settings state
        setSettings(prev => ({
            ...prev,
            chatBackground: chatBg,
            userMessageColor: userMsgBg,
            assistantMessageColor: assistantMsgBg,
            chatWidth,
            chatHeight
        }));
    }, []);
    const handleSettingChange = (section, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };
    const handleSave = () => {
        // Apply chat appearance settings
        document.documentElement.style.setProperty('--chat-bg', settings.chatBackground);
        document.documentElement.style.setProperty('--chat-message-user-bg', settings.userMessageColor);
        document.documentElement.style.setProperty('--chat-message-assistant-bg', settings.assistantMessageColor);
        document.documentElement.style.setProperty('--chat-width', `${settings.chatWidth}px`);
        document.documentElement.style.setProperty('--chat-height', `${settings.chatHeight}px`);
        // Save settings logic would go here for other settings
        toast.success("Chat settings saved successfully");
    };
    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
            clearMessages();
            refreshSessions();
            toast.success("Chat history cleared successfully");
        }
    };
    return (_jsx(SettingsContainer, { title: "Chat System Settings", description: "Configure the behavior and features of the chat system.", children: _jsxs(Tabs, { defaultValue: "settings", children: [_jsxs(TabsList, { className: "mb-6", children: [_jsx(TabsTrigger, { value: "settings", children: "Settings" }), _jsx(TabsTrigger, { value: "features", children: "Features & Appearance" })] }), _jsx(TabsContent, { value: "settings", children: _jsx(ChatSettingsTabs, { activeTab: activeTab, setActiveTab: setActiveTab, settings: settings, handleSettingChange: handleSettingChange, handleClearHistory: handleClearHistory, handleSave: handleSave }) }), _jsx(TabsContent, { value: "features", children: _jsx(ChatFeatureSettings, {}) })] }) }));
}
