import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobileChat } from "../../hooks/useMobileChat";
import { MobileChatInput } from "./MobileChatInput";
import { MobileChatMessages } from "./MobileChatMessages";
/**
 * Mobile-optimized chat interface with sliding drawer functionality
 */
export const MobileChat = () => {
    const { isOpen, isMinimized, closeChat, toggleMinimize } = useMobileChat();
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: cn("fixed inset-x-0 z-[100] bg-dark-lighter/95 backdrop-blur-lg border-t border-neon-blue/30", "transition-all duration-300 ease-out", isMinimized
            ? "h-12 bottom-16"
            : "bottom-16 h-[60vh]"), children: [_jsxs("div", { className: "flex items-center justify-between h-12 px-4 border-b border-neon-blue/20", children: [_jsx("h2", { className: "text-sm font-medium text-neon-blue", children: "AI Assistant" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-neon-pink hover:text-neon-blue", onClick: toggleMinimize, "aria-label": isMinimized ? "Maximize chat" : "Minimize chat", children: isMinimized ? _jsx(Maximize2, { className: "h-4 w-4" }) : _jsx(Minimize2, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-neon-pink hover:text-neon-blue", onClick: closeChat, "aria-label": "Close chat", children: _jsx(X, { className: "h-4 w-4" }) })] })] }), !isMinimized && (_jsxs("div", { className: "flex flex-col h-[calc(60vh-3rem)]", children: [_jsx(MobileChatMessages, {}), _jsx(MobileChatInput, {})] }))] }));
};
