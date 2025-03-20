import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon, RefreshCw } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';
export function GitHubInfoDialog() {
    // This would be connected to real GitHub data in a production app
    const repoStatus = {
        connected: true,
        lastSync: new Date().toISOString(),
        branch: 'main',
        commits: [
            { id: 'abc123', message: 'Update styling', author: 'User', time: '15 minutes ago' },
            { id: 'def456', message: 'Fix bugs', author: 'User', time: '2 hours ago' }
        ]
    };
    const handleRefresh = () => {
        logger.info('GitHub info refreshed');
    };
    return (_jsxs(DialogContent, { className: "chat-dialog-content sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-chat-knowledge-text", children: [_jsx(GitBranchIcon, { className: "h-5 w-5" }), "GitHub Integration"] }), _jsx(DialogDescription, { children: "View and manage your connected GitHub repository" })] }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Status" }), _jsxs("span", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-green-500" }), "Connected"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Repository" }), _jsx("span", { className: "text-sm font-medium", children: "user/repo" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Branch" }), _jsx("span", { className: "text-sm font-medium", children: repoStatus.branch })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Last synced" }), _jsx("span", { className: "text-sm font-medium", children: new Date(repoStatus.lastSync).toLocaleTimeString() })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Recent commits" }), _jsx("div", { className: "space-y-2", children: repoStatus.commits.map(commit => (_jsxs("div", { className: "text-xs p-2 border border-chat-knowledge-border rounded", children: [_jsx("div", { className: "font-mono text-chat-knowledge-text", children: commit.id.substring(0, 7) }), _jsx("div", { className: "mt-1", children: commit.message }), _jsxs("div", { className: "mt-1 text-muted-foreground flex justify-between", children: [_jsx("span", { children: commit.author }), _jsx("span", { children: commit.time })] })] }, commit.id))) })] })] }), _jsx(DialogFooter, { className: "mt-4", children: _jsxs(Button, { variant: "outline", onClick: handleRefresh, children: [_jsx(RefreshCw, { className: "mr-2 h-4 w-4" }), "Refresh"] }) })] }));
}
