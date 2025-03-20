import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea } from "@/components/ui/scroll-area";
import SessionItem from "./SessionItem";
import { motion } from "framer-motion";
import { useChatStore } from "../store/chatStore";
export const SessionList = ({ sessions, onSelectSession }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };
    // Get current provider from chat store
    const currentProvider = useChatStore(state => state.currentProvider);
    return (_jsx(ScrollArea, { className: "h-full w-full pr-4 chat-messages-container", children: sessions.length === 0 ? (_jsxs("div", { className: "text-center p-6 text-muted-foreground flex flex-col items-center justify-center h-full", children: [_jsx("div", { className: "opacity-60 mb-2", children: "\uD83D\uDD04" }), _jsx("div", { className: "text-chat-message-system-text", children: "No active sessions" }), _jsx("div", { className: "text-xs mt-2 opacity-60 max-w-[200px]", children: "Create a new session to start chatting" })] })) : (_jsx(motion.div, { className: "space-y-1 p-2", variants: container, initial: "hidden", animate: "show", children: sessions.map((session) => (_jsx(motion.div, { variants: item, children: _jsx(SessionItem, { id: session.id, lastAccessed: session.lastAccessed, isActive: session.isActive, onSelect: onSelectSession, provider: session.provider || currentProvider?.name, messageCount: session.messageCount }) }, session.id))) })) }));
};
