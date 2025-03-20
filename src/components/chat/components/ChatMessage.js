import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { User, Bot, ArrowRight, Sparkles, Terminal, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { formatMessageTimestamp } from '@/utils/messageConversion';
const ChatMessage = ({ message, isLast, onRetry }) => {
    const [isVisible, setIsVisible] = useState(false);
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    // Get message status, handle both property names for backward compatibility
    const messageStatus = message.message_status || 'sent';
    const isStreaming = messageStatus === 'pending';
    // Get timestamp from any of the possible timestamp fields
    const timestamp = message.timestamp || message.created_at || new Date().toISOString();
    // Determine icon based on role and type
    const getIcon = () => {
        if (isUser)
            return _jsx(User, { className: "h-4 w-4 text-neon-pink" });
        if (isSystem)
            return _jsx(Terminal, { className: "h-4 w-4 text-neon-green" });
        return _jsx(Bot, { className: "h-4 w-4 text-neon-blue" });
    };
    // Add animation when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: cn("chat-message flex items-start gap-2 mb-4", isUser ? "flex-row-reverse" : "flex-row"), children: [_jsx("div", { className: cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", isUser ? "bg-neon-pink/20" : isSystem ? "bg-neon-green/20" : "bg-neon-blue/20", isUser ? "cyber-border-pink" : isSystem ? "cyber-border-green" : "cyber-border"), children: getIcon() }), _jsxs("div", { className: cn("max-w-[80%] px-4 py-2 rounded-lg", isUser ?
                    "chat-message-user cyber-border-pink text-right ml-auto" :
                    isSystem ?
                        "bg-dark-purple/40 cyber-border-green text-left mr-auto" :
                        "chat-message-assistant cyber-border text-left mr-auto", isStreaming && "chat-pulse"), children: [_jsxs("div", { className: "text-sm", children: [message.content, isStreaming && (_jsxs("span", { className: "chat-typing-indicator ml-1", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }))] }), _jsxs("div", { className: "text-xs opacity-50 mt-1 flex items-center justify-end gap-1", children: [isUser && _jsx(ArrowRight, { className: "h-3 w-3" }), messageStatus === 'pending' && _jsx(Clock, { className: "h-3 w-3 animate-spin" }), formatMessageTimestamp(timestamp), !isUser && !isSystem && _jsx(Sparkles, { className: "h-3 w-3 ml-1" })] })] })] }));
};
export default ChatMessage;
