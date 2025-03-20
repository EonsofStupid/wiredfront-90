import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Code, ImageIcon, Zap, MessageSquare } from "lucide-react";
import { useChatModeStore } from "../store/chatModeStore";
const MODE_OPTIONS = [
    {
        id: "chat",
        name: "Standard Chat",
        description: "General purpose chat assistant",
        icon: _jsx(MessageSquare, { className: "h-6 w-6 text-neon-blue" }),
        providerId: "openai"
    },
    {
        id: "dev",
        name: "Developer Mode",
        description: "Specialized for coding assistance",
        icon: _jsx(Code, { className: "h-6 w-6 text-neon-green" }),
        providerId: "openai"
    },
    {
        id: "image",
        name: "Image Generation",
        description: "Create images from text descriptions",
        icon: _jsx(ImageIcon, { className: "h-6 w-6 text-neon-pink" }),
        providerId: "openai"
    },
    {
        id: "training",
        name: "Training Mode",
        description: "Learning and educational assistance",
        icon: _jsx(Brain, { className: "h-6 w-6 text-purple-400" }),
        providerId: "openai"
    },
    {
        id: "planning",
        name: "Planning Mode",
        description: "Project planning and organization",
        icon: _jsx(Zap, { className: "h-6 w-6 text-yellow-400" }),
        providerId: "openai"
    },
];
export function ModeSelectionDialog({ open, onOpenChange, onCreateSession }) {
    const { setCurrentMode } = useChatModeStore();
    const [selectedMode, setSelectedMode] = React.useState(null);
    const handleSelect = (mode) => {
        setSelectedMode(mode);
    };
    const handleCreate = () => {
        if (!selectedMode)
            return;
        // Update the global mode store
        setCurrentMode(selectedMode.id, selectedMode.providerId);
        // Call the onCreateSession callback with the selected mode
        onCreateSession(selectedMode.id, selectedMode.providerId || "openai");
        // Close the dialog
        onOpenChange(false);
        // Reset the selection for next time
        setSelectedMode(null);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "chat-glass-card max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "cyber-text-glow", children: "Select Chat Mode" }), _jsx(DialogDescription, { children: "Choose a specialized mode for your new chat session" })] }), _jsx("div", { className: "grid grid-cols-2 gap-4 py-4", children: MODE_OPTIONS.map(mode => (_jsx("div", { className: `p-4 rounded-lg cursor-pointer transition-all ${selectedMode?.id === mode.id
                            ? "cyber-border-active bg-neon-glow-subtle"
                            : "cyber-border hover:cyber-border-hover"}`, onClick: () => handleSelect(mode), children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded cyber-bg-dark", children: mode.icon }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: mode.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: mode.description })] })] }) }, mode.id))) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreate, disabled: !selectedMode, className: !selectedMode ? "" : "bg-neon-glow", children: "Create Session" })] })] }) }));
}
