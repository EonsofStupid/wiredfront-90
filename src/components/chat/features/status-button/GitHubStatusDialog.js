import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranchIcon, RefreshCwIcon, GitCommitIcon, AlertTriangle, Check, ChevronRight, Clock, GitFork } from "lucide-react";
import { toast } from "sonner";
import { logger } from '@/services/chat/LoggingService';
import { Skeleton } from '@/components/ui/skeleton';
export function GitHubStatusDialog() {
    const [syncStatus, setSyncStatus] = useState('idle');
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [repoInfo, setRepoInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchRepositoryInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            // This would be replaced with actual API call in production
            logger.info('Fetching GitHub repository info');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock data
            setRepoInfo({
                repoName: 'main/wiredFRONT',
                branch: 'feature/chat-improvements',
                lastCommit: {
                    message: 'Optimize chat performance',
                    timestamp: new Date().toISOString(),
                    author: 'dev@example.com',
                    hash: 'a1b2c3d4'
                },
                commitCount: 3
            });
            logger.info('GitHub repository info fetched successfully');
        }
        catch (error) {
            logger.error('Failed to fetch GitHub repository info', { error });
            toast.error('Failed to load repository info');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchRepositoryInfo();
    }, [fetchRepositoryInfo]);
    const handleSync = () => {
        setSyncStatus('syncing');
        logger.info('GitHub sync started');
        // Simulate a sync operation
        setTimeout(() => {
            setSyncStatus('synced');
            setLastSyncTime(new Date());
            logger.info('GitHub sync completed');
            toast.success('Successfully synced with GitHub');
        }, 1500);
    };
    const formatTimeAgo = (date) => {
        if (!date)
            return 'Never';
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 1)
            return 'Just now';
        if (diffInMinutes < 60)
            return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24)
            return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };
    return (_jsxs(DialogContent, { className: "chat-dialog-content sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-chat-knowledge-text", children: [_jsx(GitBranchIcon, { className: "h-5 w-5" }), "GitHub Integration"] }), _jsx(DialogDescription, { className: "text-muted-foreground text-xs", children: "Manage repository synchronization and view recent activity" })] }), _jsxs("div", { className: "space-y-4 my-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium", children: "Sync Status" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: syncStatus === 'synced' ? "success" : syncStatus === 'failed' ? "destructive" : "outline", className: "text-xs", children: syncStatus === 'idle' ? 'Not Synced' :
                                            syncStatus === 'syncing' ? 'Syncing...' :
                                                syncStatus === 'synced' ? 'Synced' : 'Failed' }), lastSyncTime && (_jsx("span", { className: "text-xs text-muted-foreground", children: formatTimeAgo(lastSyncTime) }))] })] }), _jsx("div", { className: "rounded-md border border-chat-knowledge-border/30 p-4 space-y-4", children: isLoading ? (_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-5 w-3/4" }), _jsx(Skeleton, { className: "h-5 w-1/2" }), _jsx(Skeleton, { className: "h-5 w-2/3" }), _jsx(Skeleton, { className: "h-5 w-3/5" })] })) : !repoInfo ? (_jsxs("div", { className: "text-center py-2 flex flex-col items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-8 w-8 text-yellow-500" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Failed to load repository information" }), _jsxs(Button, { variant: "outline", size: "sm", onClick: fetchRepositoryInfo, className: "mt-2", children: [_jsx(RefreshCwIcon, { className: "h-3 w-3 mr-2" }), "Retry"] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-white/80", children: "Last commit" }), _jsx("span", { className: "text-sm font-medium", children: formatTimeAgo(new Date(repoInfo.lastCommit.timestamp)) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-white/80", children: "Repository" }), _jsx("span", { className: "text-sm font-medium", children: repoInfo.repoName })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-white/80", children: "Branch" }), _jsx("span", { className: "text-sm font-medium", children: repoInfo.branch })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-white/80", children: "Author" }), _jsx("span", { className: "text-sm font-medium", children: repoInfo.lastCommit.author })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-white/80", children: "Commit Message" }), _jsx("span", { className: "text-sm font-medium truncate max-w-[200px]", children: repoInfo.lastCommit.message })] })] })) }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-3", children: [_jsx(GitCommitIcon, { className: "h-3 w-3" }), _jsxs("span", { children: ["Recent activity: ", isLoading ? (_jsx(Skeleton, { className: "h-3 w-24 inline-block align-middle" })) : (`${repoInfo?.commitCount || 0} commits in the last hour`)] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 mt-4", children: [_jsxs("div", { className: "flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5", children: [_jsx(GitFork, { className: "h-4 w-4 mb-1 text-chat-knowledge-text" }), _jsx("div", { className: "text-xs font-medium", children: "3 Branches" })] }), _jsxs("div", { className: "flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5", children: [_jsx(GitCommitIcon, { className: "h-4 w-4 mb-1 text-chat-knowledge-text" }), _jsx("div", { className: "text-xs font-medium", children: "24 Commits" })] }), _jsxs("div", { className: "flex flex-col items-center justify-center p-2 border border-chat-knowledge-border/20 rounded-md bg-chat-knowledge-background/5", children: [_jsx(Clock, { className: "h-4 w-4 mb-1 text-chat-knowledge-text" }), _jsx("div", { className: "text-xs font-medium", children: "Updated today" })] })] })] }), _jsxs(DialogFooter, { className: "flex flex-col sm:flex-row gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: fetchRepositoryInfo, disabled: isLoading, className: "text-chat-knowledge-text border-chat-knowledge-border", children: [_jsx(RefreshCwIcon, { className: `h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}` }), "Refresh"] }), _jsx(Button, { variant: "default", className: "w-full text-white bg-gradient-to-r from-[#1EAEDB] to-[#0080B3] border-chat-knowledge-border hover:opacity-90", onClick: handleSync, disabled: syncStatus === 'syncing' || isLoading, children: syncStatus === 'syncing' ? (_jsxs(_Fragment, { children: [_jsx(RefreshCwIcon, { className: "h-4 w-4 mr-2 animate-spin" }), "Syncing..."] })) : (_jsxs(_Fragment, { children: [syncStatus === 'synced' ? (_jsx(Check, { className: "h-4 w-4 mr-2" })) : (_jsx(RefreshCwIcon, { className: "h-4 w-4 mr-2" })), "Sync with GitHub", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] })) })] })] }));
}
