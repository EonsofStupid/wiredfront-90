import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useChatMode } from '../providers/ChatModeProvider';
import { useChatStore } from '../store/chatStore';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
const ChatContent = ({ className }) => {
    const { currentMode, isEditorPage } = useChatMode();
    const { messages, isWaitingForResponse } = useChatStore();
    // Render welcome message based on current mode
    const getWelcomeMessage = () => {
        switch (currentMode) {
            case 'dev':
                return 'I can help you with your code. Ask me anything about development!';
            case 'image':
                return 'Describe the image you want to generate, and I\'ll create it for you.';
            case 'training':
                return 'I\'m here to help you learn. What would you like to practice today?';
            case 'planning':
                return 'Let\'s plan your project together. What are you working on?';
            case 'code':
                return 'I can help you write, review, or debug code. What are you working on?';
            default:
                return 'How can I help you today?';
        }
    };
    return (_jsxs("div", { className: cn("chat-content overflow-y-auto p-4 space-y-4", className), children: [_jsx("div", { className: "text-center opacity-60", children: _jsxs("p", { className: "text-xs text-white/60", children: [new Date().toLocaleDateString(), " \u2022 ", currentMode.charAt(0).toUpperCase() + currentMode.slice(1), " Mode"] }) }), _jsxs(AnimatePresence, { children: [messages.length === 0 ? (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "chat-message chat-message-assistant cyber-border cyber-pulse", children: _jsx("span", { className: "cyber-glitch", "data-text": getWelcomeMessage(), children: getWelcomeMessage() }) })) : (_jsx("div", { className: "space-y-4", children: messages.map((msg, index) => (_jsx(ChatMessage, { message: msg, isLast: index === messages.length - 1 }, msg.id))) })), isWaitingForResponse && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "chat-message chat-message-assistant cyber-border opacity-70 flex items-center space-x-2", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), _jsx("span", { children: "Thinking..." })] }))] })] }));
};
export default ChatContent;
