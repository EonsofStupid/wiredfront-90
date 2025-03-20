import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon, BellIcon, CheckCircle } from 'lucide-react';
import { GitHubStatusDialog } from './GitHubStatusDialog';
import { NotificationsStatusDialog } from './NotificationsStatusDialog';
import { AIProviderStatusButton } from './AIProviderStatusButton';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useChatStore } from '../../store/chatStore';
import { useErrorBoundary } from '../../hooks/useErrorBoundary';
export function StatusButton() {
    const [activeTab, setActiveTab] = useState('github');
    const { features } = useChatStore();
    const { ErrorBoundary } = useErrorBoundary();
    const getDialogContent = () => {
        if (activeTab === 'github') {
            return _jsx(GitHubStatusDialog, {});
        }
        return _jsx(NotificationsStatusDialog, {});
    };
    const getPreviewContent = (type) => {
        if (type === 'github') {
            return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last commit" }), _jsx("span", { className: "text-xs font-medium", children: "15 minutes ago" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(CheckCircle, { className: "h-3 w-3 text-green-500" }), _jsx("span", { className: "text-xs", children: "Synced" })] })] })] }));
        }
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Unread" }), _jsx("span", { className: "text-xs font-medium", children: "2" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last update" }), _jsx("span", { className: "text-xs", children: "Just now" })] })] }));
    };
    return (_jsx(ErrorBoundary, { fallback: _jsx("div", { className: "text-xs text-destructive", children: "Error loading status" }), children: _jsxs("div", { className: "flex gap-2 justify-end", role: "toolbar", "aria-label": "Status controls", children: [_jsx(AIProviderStatusButton, {}), features.githubSync && (_jsxs(Dialog, { children: [_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "sm", className: "text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-background/10", onClick: () => setActiveTab('github'), "aria-label": "GitHub integration status", children: _jsx(GitBranchIcon, { className: "h-4 w-4" }) }) }) }), _jsx(HoverCardContent, { className: "w-64 p-3 chat-dialog-content", side: "top", align: "end", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(GitBranchIcon, { className: "h-3.5 w-3.5" }), "GitHub Status"] }), getPreviewContent('github')] }) })] }), activeTab === 'github' && getDialogContent()] })), features.notifications && (_jsxs(Dialog, { children: [_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: "text-chat-notification-text border-chat-notification-border hover:bg-chat-notification-background/10 relative", onClick: () => setActiveTab('notifications'), "aria-label": "Notifications", children: [_jsx(BellIcon, { className: "h-4 w-4" }), _jsx("span", { className: "absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" })] }) }) }), _jsx(HoverCardContent, { className: "w-64 p-3 chat-dialog-content", side: "top", align: "end", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(BellIcon, { className: "h-3.5 w-3.5" }), "Notifications"] }), getPreviewContent('notifications')] }) })] }), activeTab === 'notifications' && getDialogContent()] }))] }) }));
}
