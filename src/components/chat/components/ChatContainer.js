import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChatMode } from '@/hooks/chat/useChatMode';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatLayoutStore } from '@/components/chat/store/chatLayoutStore';
import { cn } from '@/lib/utils';
import { ChatHeader } from './ChatHeader';
import ChatContent from './ChatContent';
import ChatInputArea from './ChatInputArea';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import '../styles/chat-variables.css';
import '../styles/cyber-theme.css';
import { ModeSelectionDialog } from '../SessionManagement/ModeSelectionDialog';
export function ChatContainer({ className, dockPosition = 'bottom-right' }) {
    const { isWaitingForResponse } = useChatStore();
    const { currentMode } = useChatMode();
    const { isMinimized, docked } = useChatLayoutStore();
    const { messages, sendMessage } = useChatMessages();
    const [modeDialogOpen, setModeDialogOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const messagesEndRef = useRef(null);
    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (messagesEndRef.current && !isMinimized) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);
    // Handle sending messages
    const handleSendMessage = async (content) => {
        await sendMessage(content);
    };
    // Handle opening mode selector
    const handleOpenModeSelector = () => {
        setModeDialogOpen(true);
    };
    // Handle toggle sidebar
    const handleToggleSidebar = () => {
        setSidebarVisible(prev => !prev);
    };
    // Determine position class based on dockPosition
    const positionClass = dockPosition === 'bottom-right' ? 'right-4' : 'left-4';
    return (_jsxs("div", { className: cn("chat-container overflow-hidden flex flex-col cyber-bg", !docked && 'cursor-grab active:cursor-grabbing', docked && `fixed bottom-4 ${positionClass}`, className), children: [_jsxs(ErrorBoundary, { children: [_jsx(ChatHeader, { onToggleSidebar: handleToggleSidebar, onOpenModeSelector: handleOpenModeSelector }), !isMinimized && (_jsxs("div", { className: "flex-1 overflow-hidden flex flex-col", children: [_jsx(ChatContent, { className: "flex-1" }), _jsx("div", { ref: messagesEndRef })] })), !isMinimized && (_jsx(ChatInputArea, { onSendMessage: handleSendMessage, disabled: isWaitingForResponse }))] }), _jsx(ModeSelectionDialog, { open: modeDialogOpen, onOpenChange: setModeDialogOpen, onCreateSession: (mode, providerId) => {
                    // Handle mode/session creation
                    setModeDialogOpen(false);
                } })] }));
}
export default ChatContainer;
