import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BellIcon, CheckIcon, XIcon, CheckCircleIcon, AlertTriangle, Clock, Info } from "lucide-react";
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const notificationIcons = {
    info: Info,
    success: CheckCircleIcon,
    warning: AlertTriangle,
    error: AlertTriangle
};
const notificationColors = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400'
};
export function NotificationsStatusDialog() {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            logger.info('Fetching notifications');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));
            // Mock data
            setNotifications([
                {
                    id: '1',
                    message: 'New commit pushed to repository',
                    timestamp: new Date(),
                    read: false,
                    type: 'info'
                },
                {
                    id: '2',
                    message: 'Code generation completed successfully',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                    read: false,
                    type: 'success'
                },
                {
                    id: '3',
                    message: 'API rate limit approaching threshold',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                    read: true,
                    type: 'warning'
                },
                {
                    id: '4',
                    message: 'Failed to validate GitHub token',
                    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
                    read: true,
                    type: 'error'
                }
            ]);
            logger.info('Notifications fetched successfully');
        }
        catch (error) {
            logger.error('Failed to fetch notifications', { error });
            toast.error('Failed to load notifications');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notification => notification.id === id
            ? { ...notification, read: true }
            : notification));
        logger.info('Notification marked as read', { id });
    };
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        logger.info('Notification dismissed', { id });
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        toast.success('All notifications marked as read');
        logger.info('All notifications marked as read');
    };
    const dismissAll = () => {
        setNotifications([]);
        toast.success('All notifications cleared');
        logger.info('All notifications cleared');
    };
    const unreadCount = notifications.filter(n => !n.read).length;
    const displayedNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => !n.read);
    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 60)
            return `${minutes === 0 ? 'Just now' : `${minutes}m ago`}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours}h ago`;
        return date.toLocaleDateString();
    };
    return (_jsxs(DialogContent, { className: "chat-dialog-content sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-chat-knowledge-text", children: [_jsx(BellIcon, { className: "h-5 w-5" }), "Notifications"] }), _jsxs(Badge, { variant: "outline", className: `text-xs ${unreadCount > 0 ? 'bg-red-500/10 text-red-400' : ''}`, children: [unreadCount, " Unread"] })] }), _jsx(DialogDescription, { className: "text-muted-foreground text-xs", children: "Stay updated on system events and important alerts" })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "mt-2", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 h-9", children: [_jsx(TabsTrigger, { value: "all", className: "text-xs", children: "All Notifications" }), _jsxs(TabsTrigger, { value: "unread", className: "text-xs", children: ["Unread", unreadCount > 0 && (_jsx(Badge, { variant: "outline", className: "ml-2 bg-red-500/10 text-red-400 h-5 w-5 p-0 flex items-center justify-center", children: unreadCount }))] })] }), _jsx(TabsContent, { value: "all", className: "mt-2", children: renderNotificationList(displayedNotifications, isLoading) }), _jsx(TabsContent, { value: "unread", className: "mt-2", children: renderNotificationList(displayedNotifications, isLoading) })] }), _jsxs(DialogFooter, { className: "flex flex-col sm:flex-row gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: markAllAsRead, disabled: unreadCount === 0 || isLoading, className: "text-chat-knowledge-text border-chat-knowledge-border", children: [_jsx(CheckCircleIcon, { className: "h-4 w-4 mr-2" }), "Mark All as Read"] }), _jsxs(Button, { variant: "default", size: "sm", onClick: dismissAll, disabled: notifications.length === 0 || isLoading, className: "text-white bg-gradient-to-r from-[#1EAEDB] to-[#0080B3] border-none hover:opacity-90", children: [_jsx(XIcon, { className: "h-4 w-4 mr-2" }), "Clear All", notifications.length > 0 && (_jsx(Badge, { variant: "outline", className: "ml-2 bg-white/10 text-white h-5 w-5 p-0 flex items-center justify-center", children: notifications.length }))] })] })] }));
    function renderNotificationList(notifications, isLoading) {
        if (isLoading) {
            return (_jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-2", children: Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: "flex items-start justify-between p-3 rounded-md bg-chat-message-system-bg/30", children: _jsxs("div", { className: "space-y-1 w-full", children: [_jsx(Skeleton, { className: "h-4 w-3/4" }), _jsx(Skeleton, { className: "h-3 w-1/3" })] }) }, i))) }));
        }
        if (notifications.length === 0) {
            return (_jsxs("div", { className: "text-center py-8 text-white/60", children: [_jsx(BellIcon, { className: "h-8 w-8 mx-auto mb-2 opacity-40" }), _jsx("p", { className: "mb-1", children: "No notifications" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "You're all caught up!" })] }));
        }
        return (_jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto chat-messages-container pr-2", children: notifications.map((notification) => {
                const NotificationIcon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];
                return (_jsxs("div", { className: `flex items-start justify-between p-3 rounded-md ${notification.read ? 'bg-chat-message-system-bg/30' : 'bg-chat-message-assistant-bg/30'} hover:bg-chat-message-assistant-bg/40 transition-colors duration-200`, role: "listitem", "aria-label": notification.read ? 'Read notification' : 'Unread notification', children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: `mt-0.5 ${colorClass}`, children: _jsx(NotificationIcon, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsx("p", { className: `${notification.read ? 'font-normal' : 'font-medium'} text-sm`, children: notification.message }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("span", { className: "flex items-center text-xs text-muted-foreground", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), formatTime(notification.timestamp)] }), !notification.read && (_jsx(Badge, { variant: "outline", className: "text-[10px] h-4 bg-red-500/10 text-red-400", children: "New" }))] })] })] }), _jsxs("div", { className: "flex gap-1", children: [!notification.read && (_jsx("button", { onClick: () => markAsRead(notification.id), className: "text-primary hover:text-primary/80 p-1 rounded-sm hover:bg-white/5 transition-colors", "aria-label": "Mark as read", children: _jsx(CheckIcon, { className: "h-3.5 w-3.5" }) })), _jsx("button", { onClick: () => dismissNotification(notification.id), className: "text-muted-foreground hover:text-destructive p-1 rounded-sm hover:bg-white/5 transition-colors", "aria-label": "Dismiss notification", children: _jsx(XIcon, { className: "h-3.5 w-3.5" }) })] })] }, notification.id));
            }) }));
    }
}
