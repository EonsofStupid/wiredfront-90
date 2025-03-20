import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/components/chat/store/chatStore";
import { ArrowLeftRight, Pin, PinOff, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { KnownFeatureFlag } from "@/types/admin/settings/feature-flags";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { convertFeatureKeyToChatFeature } from "@/components/chat/store/actions/feature/types";
export const ChatFeatureSettings = () => {
    const { position, togglePosition, docked, toggleDocked, scale, setScale } = useChatStore();
    const { features, toggleFeature, isUpdating } = useFeatureFlags();
    const [activeTab, setActiveTab] = useState("features");
    // State for chat styling
    const [chatBg, setChatBg] = useState("rgba(0, 0, 0, 0.3)");
    const [userMessageColor, setUserMessageColor] = useState("#8B5CF6");
    const [assistantMessageColor, setAssistantMessageColor] = useState("#374151");
    const [chatWidth, setChatWidth] = useState("400");
    const [chatHeight, setChatHeight] = useState("500");
    const handleReset = () => {
        // Reset all features to default using proper feature key mapping
        const codeAssistantKey = convertFeatureKeyToChatFeature('code_assistant');
        const ragSupportKey = convertFeatureKeyToChatFeature('rag_support');
        const githubSyncKey = convertFeatureKeyToChatFeature('github_sync');
        const notificationsKey = convertFeatureKeyToChatFeature('notifications');
        if (codeAssistantKey && !features.codeAssistant)
            toggleFeature(codeAssistantKey);
        if (ragSupportKey && !features.ragSupport)
            toggleFeature(ragSupportKey);
        if (githubSyncKey && !features.githubSync)
            toggleFeature(githubSyncKey);
        if (notificationsKey && !features.notifications)
            toggleFeature(notificationsKey);
        // Reset styling to defaults
        setChatBg("rgba(0, 0, 0, 0.3)");
        setUserMessageColor("#8B5CF6");
        setAssistantMessageColor("#374151");
        setChatWidth("400");
        setChatHeight("500");
        setScale(1);
        // Apply default styles
        applyChatStyles();
        toast.success("Chat features and styling reset to defaults");
    };
    const applyChatStyles = () => {
        document.documentElement.style.setProperty('--chat-bg', chatBg);
        document.documentElement.style.setProperty('--chat-message-user-bg', userMessageColor);
        document.documentElement.style.setProperty('--chat-message-assistant-bg', assistantMessageColor);
        document.documentElement.style.setProperty('--chat-width', `${chatWidth}px`);
        document.documentElement.style.setProperty('--chat-height', `${chatHeight}px`);
        toast.success("Chat styling updated successfully");
    };
    // Helper to toggle feature with proper type mapping
    const handleToggleFeature = (flag) => {
        const chatFeatureKey = convertFeatureKeyToChatFeature(flag);
        if (chatFeatureKey) {
            toggleFeature(chatFeatureKey);
        }
    };
    return (_jsx(TooltipProvider, { children: _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Chat Feature Settings" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Configure which features are available in the chat interface." })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid grid-cols-2 mb-4", children: [_jsx(TabsTrigger, { value: "features", children: "Features" }), _jsx(TabsTrigger, { value: "appearance", children: "Appearance" })] }), _jsxs(TabsContent, { value: "features", className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-medium", children: "Position & Behavior" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "position", children: "Position" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Current position: ", typeof position === 'string'
                                                                ? (position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left')
                                                                : `Custom (${position.x}, ${position.y})`] })] }), _jsxs(Button, { variant: "outline", onClick: togglePosition, className: "flex items-center gap-2", children: [_jsx(ArrowLeftRight, { className: "h-4 w-4" }), "Toggle Position"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "docked", children: "Docked Mode" }), _jsx("p", { className: "text-sm text-muted-foreground", children: docked ? 'Chat is fixed in position' : 'Chat is freely draggable' })] }), _jsxs(Button, { variant: "outline", onClick: toggleDocked, className: "flex items-center gap-2", children: [docked ? _jsx(PinOff, { className: "h-4 w-4" }) : _jsx(Pin, { className: "h-4 w-4" }), docked ? 'Undock' : 'Dock'] })] }), _jsx("h3", { className: "text-sm font-medium mt-6", children: "Features" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "codeAssistant", children: "Code Assistant" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable code assistance features" })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Switch, { id: "codeAssistant", checked: features.codeAssistant, onCheckedChange: () => handleToggleFeature(KnownFeatureFlag.CODE_ASSISTANT), disabled: isUpdating }) }), _jsxs(TooltipContent, { children: [features.codeAssistant ? 'Disable' : 'Enable', " code assistance"] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "ragSupport", children: "RAG Support" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable retrieval augmented generation" })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Switch, { id: "ragSupport", checked: features.ragSupport, onCheckedChange: () => handleToggleFeature(KnownFeatureFlag.RAG_SUPPORT), disabled: isUpdating }) }), _jsxs(TooltipContent, { children: [features.ragSupport ? 'Disable' : 'Enable', " RAG support"] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "githubSync", children: "GitHub Sync" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable GitHub integration in editor mode" })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Switch, { id: "githubSync", checked: features.githubSync, onCheckedChange: () => handleToggleFeature(KnownFeatureFlag.GITHUB_SYNC), disabled: isUpdating }) }), _jsxs(TooltipContent, { children: [features.githubSync ? 'Disable' : 'Enable', " GitHub sync"] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "notifications", children: "Notifications" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable notification features" })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Switch, { id: "notifications", checked: features.notifications, onCheckedChange: () => handleToggleFeature(KnownFeatureFlag.NOTIFICATIONS), disabled: isUpdating }) }), _jsxs(TooltipContent, { children: [features.notifications ? 'Disable' : 'Enable', " notifications"] })] })] })] }), _jsxs(TabsContent, { value: "appearance", className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-medium", children: "Styling & Colors" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "chatBg", children: "Chat Background" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded border", style: { backgroundColor: chatBg } }), _jsx(Input, { id: "chatBg", value: chatBg, onChange: (e) => setChatBg(e.target.value), className: "flex-1" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "userMessageColor", children: "User Message Color" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded border", style: { backgroundColor: userMessageColor } }), _jsx(Input, { id: "userMessageColor", value: userMessageColor, onChange: (e) => setUserMessageColor(e.target.value), className: "flex-1" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "assistantMessageColor", children: "Assistant Message Color" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded border", style: { backgroundColor: assistantMessageColor } }), _jsx(Input, { id: "assistantMessageColor", value: assistantMessageColor, onChange: (e) => setAssistantMessageColor(e.target.value), className: "flex-1" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { htmlFor: "scale", children: ["Chat Scale (", scale.toFixed(1), "x)"] }), _jsx("input", { id: "scale", type: "range", min: "0.5", max: "1.5", step: "0.1", value: scale, onChange: (e) => setScale(parseFloat(e.target.value)), className: "w-full" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "chatWidth", children: "Chat Width (px)" }), _jsx(Input, { id: "chatWidth", type: "number", value: chatWidth, onChange: (e) => setChatWidth(e.target.value), min: "320", max: "800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "chatHeight", children: "Chat Height (px)" }), _jsx(Input, { id: "chatHeight", type: "number", value: chatHeight, onChange: (e) => setChatHeight(e.target.value), min: "300", max: "800" })] })] }), _jsxs(Button, { onClick: applyChatStyles, className: "w-full mt-4", variant: "default", children: [_jsx(Palette, { className: "h-4 w-4 mr-2" }), "Apply Styling"] })] })] }), _jsxs(Button, { onClick: handleReset, variant: "outline", className: "w-full", disabled: isUpdating, children: [_jsx(RotateCcw, { className: "h-4 w-4 mr-2" }), "Reset to Defaults"] })] }) }) }));
};
export default ChatFeatureSettings;
