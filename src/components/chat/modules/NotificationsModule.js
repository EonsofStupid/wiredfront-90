import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckIcon, XIcon } from "lucide-react";
export function NotificationsModule() {
    const [notifications, setNotifications] = React.useState([
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
        }
    ]);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notification => notification.id === id
            ? { ...notification, read: true }
            : notification));
    };
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };
    return (_jsx(Card, { className: "w-full my-2 border-dashed border-primary/40", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-sm font-medium flex items-center", children: [_jsx(BellIcon, { className: "h-4 w-4 mr-2" }), "Notifications"] }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [notifications.filter(n => !n.read).length, " New"] })] }), _jsx("div", { className: "space-y-2 mt-2", children: notifications.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-2", children: "No notifications" })) : (notifications.map(notification => (_jsxs("div", { className: `flex items-start justify-between p-2 rounded-md text-xs ${notification.read ? 'bg-background' : 'bg-primary/5'}`, children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: notification.message }), _jsx("p", { className: "text-muted-foreground mt-1", children: notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }), _jsxs("div", { className: "flex gap-1", children: [!notification.read && (_jsx("button", { onClick: () => markAsRead(notification.id), className: "text-primary hover:text-primary/80", children: _jsx(CheckIcon, { className: "h-3 w-3" }) })), _jsx("button", { onClick: () => dismissNotification(notification.id), className: "text-muted-foreground hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })] }, notification.id)))) })] }) }));
}
