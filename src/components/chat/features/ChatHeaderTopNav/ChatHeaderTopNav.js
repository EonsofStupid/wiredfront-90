import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu, Search, GitBranch, Bell, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/services/chat/LoggingService';
import './styles.css';
export function ChatHeaderTopNav() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
        logger.info('Top nav menu toggled', { isVisible: !isMenuVisible });
    };
    return (_jsxs("div", { className: "relative chat-header-top-nav", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: toggleMenu, className: "hover:bg-white/10 chat-header-top-nav-button", "aria-label": "Toggle navigation menu", children: _jsx(Menu, { className: "h-4 w-4" }) }) }), _jsx(AnimatePresence, { children: isMenuVisible && (_jsx(motion.nav, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, className: cn("absolute top-full left-0 w-48 mt-2 py-2", "bg-chat-knowledge-bg border border-chat-knowledge-border rounded-md shadow-lg", "backdrop-blur-md z-50"), children: _jsxs("ul", { className: "space-y-1", children: [_jsx(NavItem, { icon: _jsx(Search, { className: "h-4 w-4" }), label: "RAG Search", onClick: () => logger.info('RAG Search clicked') }), _jsx(NavItem, { icon: _jsx(FileSearch, { className: "h-4 w-4" }), label: "Vector Database", onClick: () => logger.info('Vector Database clicked') }), _jsx(NavItem, { icon: _jsx(Bell, { className: "h-4 w-4" }), label: "Notifications", onClick: () => logger.info('Notifications clicked') }), _jsx(NavItem, { icon: _jsx(GitBranch, { className: "h-4 w-4" }), label: "GitHub Status", onClick: () => logger.info('GitHub Status clicked') })] }) })) })] }));
}
function NavItem({ icon, label, onClick }) {
    return (_jsx("li", { children: _jsxs("button", { onClick: onClick, className: cn("w-full px-4 py-2 text-sm flex items-center gap-2", "text-white/80 hover:text-white hover:bg-white/10", "transition-colors duration-200"), children: [icon, _jsx("span", { children: label })] }) }));
}
export default ChatHeaderTopNav;
