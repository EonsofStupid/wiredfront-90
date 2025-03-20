import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useChatStore } from '../store';
import { supabaseModeToStoreMode } from '@/utils/modeConversion';
import ChatInputArea from './ChatInputArea';
import { ChatIconStack } from './ChatIconStack';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { ChatHeader } from './ChatHeader';
import { ChatModeDialog } from '../features/ModeSwitch/ChatModeDialog';
import ChatMessage from './ChatMessage';
import '../styles/index.css';
import '../styles/cyber-theme.css';
const DraggableChatContainer = ({ scrollRef, isEditorPage }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable-chat',
    });
    const { isMinimized, docked, scale, messages, addMessage } = useChatStore();
    const [modeDialogOpen, setModeDialogOpen] = useState(false);
    const { sendMessage, isLoading } = useMessageAPI();
    const [typing, setTyping] = useState(false);
    useEffect(() => {
        if (isLoading) {
            setTyping(true);
            const timeout = setTimeout(() => setTyping(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [isLoading]);
    const handleModeSelect = (mode, providerId) => {
        // Convert Supabase mode to store mode
        const storeMode = supabaseModeToStoreMode(mode);
        useChatStore.getState().setCurrentMode(storeMode);
        // Find the provider by ID and set it as current
        const provider = useChatStore.getState().availableProviders.find(p => p.id === providerId);
        if (provider) {
            useChatStore.getState().updateCurrentProvider(provider);
        }
    };
    const handleToggleSidebar = () => {
        useChatStore.getState().toggleSidebar();
    };
    const transformStyle = transform && !docked ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    const handleSendMessage = (message) => {
        sendMessage(message);
    };
    return (_jsxs("div", { ref: setNodeRef, style: transformStyle, ...(docked ? {} : { ...listeners, ...attributes }), className: `chat-container chat-glass-card chat-neon-border overflow-hidden flex flex-col cyber-bg relative ${!docked && 'cursor-grab active:cursor-grabbing'}`, children: [_jsx(ChatHeader, { onToggleSidebar: handleToggleSidebar, onOpenModeSelector: () => setModeDialogOpen(true) }), !isMinimized && (_jsx("div", { className: "flex-1 overflow-y-auto p-4 chat-messages-container cyber-bg", ref: scrollRef, children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-center opacity-60", children: _jsxs("p", { className: "text-xs text-white/60", children: [new Date().toLocaleDateString(), " \u2022 ", isEditorPage ? 'Editor' : 'Dashboard', " Mode"] }) }), messages.length === 0 ? (_jsx("div", { className: "chat-message chat-message-assistant cyber-border cyber-pulse", children: _jsx("span", { className: "cyber-glitch", "data-text": "How can I help you today?", children: "How can I help you today?" }) })) : (messages.map((msg) => (_jsx(ChatMessage, { message: msg }, msg.id)))), typing && (_jsx("div", { className: "chat-message chat-message-assistant cyber-border opacity-70", children: _jsx("div", { className: "typing-dots", children: "Assistant is typing" }) }))] }) })), !isMinimized && (_jsx(ChatInputArea, { onSendMessage: handleSendMessage })), _jsx(ChatModeDialog, { open: modeDialogOpen, onOpenChange: setModeDialogOpen, onModeSelect: handleModeSelect }), _jsx(ChatIconStack, {})] }));
};
export default DraggableChatContainer;
