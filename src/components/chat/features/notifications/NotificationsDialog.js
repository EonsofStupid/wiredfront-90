import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BellIcon, Check, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/services/chat/LoggingService';
export function NotificationsDialog() {
    const [notifications, setNotifications] = useState([
        { id: '1', message: 'New commits available', time: '2 minutes ago', read: false, type: 'system' },
        { id: '2', message: 'AI assistant updated', time: '1 hour ago', read: true, type: 'system' },
        { id: '3', message: 'Project build completed', time: '3 hours ago', read: false, type: 'project' }
    ]);
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        logger.info('Marked all notifications as read');
    };
    const clearAllNotifications = () => {
        setNotifications([]);
        logger.info('Cleared all notifications');
    };
    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        logger.info('Marked notification as read', { id });
    };
    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        logger.info('Deleted notification', { id });
    };
    return (_jsxs(DialogContent, { className: "chat-dialog-content sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-chat-notification-text", children: [_jsx(BellIcon, { className: "h-5 w-5" }), "Notifications"] }), _jsx(DialogDescription, { children: "Stay updated with system and project notifications" })] }), _jsxs(Tabs, { defaultValue: "all", className: "mt-4", children: [_jsxs(TabsList, { className: "bg-background/50 border border-chat-knowledge-border", children: [_jsx(TabsTrigger, { value: "all", children: "All" }), _jsx(TabsTrigger, { value: "system", children: "System" }), _jsx(TabsTrigger, { value: "project", children: "Project" })] }), _jsx(TabsContent, { value: "all", className: "mt-2 space-y-2", children: notifications.length === 0 ? (_jsx("div", { className: "text-center p-4 text-muted-foreground", children: "No notifications" })) : (notifications.map(notification => (_jsxs("div", { className: `p-3 border rounded-md flex items-start justify-between ${notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: `text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`, children: notification.message }), _jsx("div", { className: "text-xs text-muted-foreground", children: notification.time })] }), _jsxs("div", { className: "flex gap-1", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => markAsRead(notification.id), children: _jsx(Check, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => deleteNotification(notification.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, notification.id)))) }), _jsx(TabsContent, { value: "system", className: "mt-2 space-y-2", children: notifications.filter(n => n.type === 'system').length === 0 ? (_jsx("div", { className: "text-center p-4 text-muted-foreground", children: "No system notifications" })) : (notifications
                            .filter(n => n.type === 'system')
                            .map(notification => (_jsxs("div", { className: `p-3 border rounded-md flex items-start justify-between ${notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: `text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`, children: notification.message }), _jsx("div", { className: "text-xs text-muted-foreground", children: notification.time })] }), _jsxs("div", { className: "flex gap-1", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => markAsRead(notification.id), children: _jsx(Check, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => deleteNotification(notification.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, notification.id)))) }), _jsx(TabsContent, { value: "project", className: "mt-2 space-y-2", children: notifications.filter(n => n.type === 'project').length === 0 ? (_jsx("div", { className: "text-center p-4 text-muted-foreground", children: "No project notifications" })) : (notifications
                            .filter(n => n.type === 'project')
                            .map(notification => (_jsxs("div", { className: `p-3 border rounded-md flex items-start justify-between ${notification.read ? 'border-chat-knowledge-border/30' : 'border-chat-notification-border'}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: `text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`, children: notification.message }), _jsx("div", { className: "text-xs text-muted-foreground", children: notification.time })] }), _jsxs("div", { className: "flex gap-1", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => markAsRead(notification.id), children: _jsx(Check, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => deleteNotification(notification.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, notification.id)))) })] }), _jsxs(DialogFooter, { className: "mt-4 space-x-2", children: [_jsx(Button, { variant: "outline", onClick: markAllAsRead, children: "Mark All as Read" }), _jsx(Button, { variant: "outline", className: "border-destructive text-destructive", onClick: clearAllNotifications, children: "Clear All" })] })] }));
}
