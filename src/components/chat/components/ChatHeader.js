import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '@/hooks/chat/useChatMode';
import { useChatLayoutStore } from '@/components/chat/store/chatLayoutStore';
import { Button } from '@/components/ui/button';
import { Minimize2, Maximize2, X, Menu, Database, Zap, Code, Image, BookOpen, Pin, PinOff } from 'lucide-react';
import '../styles/cyber-theme.css';
export function ChatHeader({ onToggleSidebar, onOpenModeSelector }) {
    const { isWaitingForResponse, currentProvider } = useChatStore();
    const { currentMode } = useChatMode();
    const { isMinimized, toggleMinimized, docked, toggleDocked } = useChatLayoutStore();
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const getModeIcon = () => {
        switch (currentMode) {
            case 'dev': return _jsx(Code, { className: "h-4 w-4 text-cyan-400" });
            case 'image': return _jsx(Image, { className: "h-4 w-4 text-pink-400" });
            case 'training': return _jsx(BookOpen, { className: "h-4 w-4 text-purple-400" });
            default: return _jsx(Zap, { className: "h-4 w-4 text-cyan-400" });
        }
    };
    const handleCloseChat = () => {
        // Close chat functionality
    };
    return (_jsxs("div", { className: "chat-header h-12 px-3 flex items-center justify-between cyber-bg cyber-border", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "chat-control-button h-8 w-8 hover:text-cyan-400 hover:bg-cyan-400/10", onClick: onToggleSidebar, "aria-label": "Toggle sidebar", "data-testid": "sidebar-toggle", children: _jsx(Menu, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-2 h-8 text-xs chat-control-button cyber-pulse", onClick: onOpenModeSelector, "aria-label": "Select AI mode", children: _jsxs("span", { className: "flex items-center gap-1", children: [getModeIcon(), _jsx("span", { className: "capitalize", children: currentMode })] }) }), _jsx("span", { className: "ml-2 text-xs text-white/40", children: "|" }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-2 h-8 text-xs chat-control-button", onClick: () => setStatusDialogOpen(true), "aria-label": "AI Provider Status", children: _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Database, { className: "h-3 w-3 text-green-400" }), _jsx("span", { children: currentProvider?.name || 'Default' })] }) })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "chat-control-button h-8 w-8", onClick: toggleDocked, "aria-label": docked ? "Undock chat" : "Dock chat", children: docked ? _jsx(PinOff, { className: "h-4 w-4" }) : _jsx(Pin, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "chat-control-button h-8 w-8", onClick: toggleMinimized, "aria-label": isMinimized ? "Maximize chat" : "Minimize chat", children: isMinimized ? _jsx(Maximize2, { className: "h-4 w-4" }) : _jsx(Minimize2, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "chat-control-button h-8 w-8 text-red-400 hover:bg-red-400/10", onClick: handleCloseChat, "aria-label": "Close chat", children: _jsx(X, { className: "h-4 w-4" }) })] })] }));
}
