import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GitBranchIcon, BellIcon, CheckCircle } from 'lucide-react';
export const GitHubPreview = ({ lastCommitTime, isSynced }) => {
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last commit" }), _jsx("span", { className: "text-xs font-medium", children: lastCommitTime })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(CheckCircle, { className: `h-3 w-3 ${isSynced ? 'text-green-500' : 'text-yellow-500'}` }), _jsx("span", { className: "text-xs", children: isSynced ? 'Synced' : 'Out of sync' })] })] })] }));
};
export const NotificationsPreview = ({ unreadCount, lastUpdated }) => {
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Unread" }), _jsx("span", { className: "text-xs font-medium", children: unreadCount })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last update" }), _jsx("span", { className: "text-xs", children: lastUpdated })] })] }));
};
export const StatusButtonPreview = ({ type }) => {
    const Icon = type === 'github' ? GitBranchIcon : BellIcon;
    const title = type === 'github' ? 'GitHub Status' : 'Notifications';
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), title] }), type === 'github' ? (_jsx(GitHubPreview, { lastCommitTime: "15 minutes ago", isSynced: true })) : (_jsx(NotificationsPreview, { unreadCount: 2, lastUpdated: "Just now" }))] }));
};
