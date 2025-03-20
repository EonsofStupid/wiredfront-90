import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BellIcon } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { NotificationsDialog } from './NotificationsDialog';
import { logger } from '@/services/chat/LoggingService';
export function NotificationsButton() {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = 2; // This would be fetched from a notification service in a real app
    const handleOpenChange = (open) => {
        setIsOpen(open);
        logger.info('Notifications dialog state changed', { open });
    };
    const getPreviewContent = () => {
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(BellIcon, { className: "h-3.5 w-3.5" }), "Notifications"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Unread" }), _jsx("span", { className: "text-xs font-medium", children: unreadCount })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last update" }), _jsx("span", { className: "text-xs", children: "Just now" })] })] })] }));
    };
    return (_jsxs(Dialog, { onOpenChange: handleOpenChange, open: isOpen, children: [_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: "text-chat-notification-text border-chat-notification-border hover:bg-chat-notification-background/10 relative", "aria-label": "Notifications", children: [_jsx(BellIcon, { className: "h-4 w-4" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" }))] }) }) }), _jsx(HoverCardContent, { className: "w-64 p-3 chat-dialog-content", side: "top", align: "end", children: getPreviewContent() })] }), isOpen && _jsx(NotificationsDialog, {})] }));
}
export default NotificationsButton;
