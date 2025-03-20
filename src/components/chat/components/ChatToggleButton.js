import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
const ChatToggleButton = ({ onClick }) => {
    const { position } = useChatStore();
    const positionClass = position?.x > window.innerWidth / 2
        ? 'right-4'
        : 'left-4';
    return (_jsx(motion.button, { className: `fixed bottom-4 ${positionClass} bg-gradient-to-r from-neon-blue to-neon-blue/70 text-white p-3 rounded-full shadow-lg z-[var(--z-chat-button)]`, whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, onClick: onClick, "aria-label": "Open chat", initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.3 }, children: _jsx(MessageSquare, { className: "h-6 w-6" }) }));
};
export default ChatToggleButton;
