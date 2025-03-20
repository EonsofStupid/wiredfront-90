import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, GitBranch, Check, AlertTriangle, XCircle, Clock, GitMerge, GitPullRequest, Filter, ArrowDownUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
export function SyncStatusDashboard() {
    const [loading, setLoading] = useState(true);
    const [syncLogs, setSyncLogs] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const { isConnected } = useGitHubConnection();
    useEffect(() => {
        if (isConnected) {
            fetchSyncLogs();
        }
    }, [isConnected]);
    const fetchSyncLogs = async () => {
        setLoading(true);
        try {
            // First, get all repositories for easier joining
            const { data: repoData, error: repoError } = await supabase
                .from('github_repositories')
                .select('id, repo_name, repo_owner');
            if (repoError)
                throw repoError;
            const repoMap = new Map();
            if (repoData) {
                repoData.forEach((repo) => {
                    repoMap.set(repo.id, {
                        repo_name: repo.repo_name,
                        repo_owner: repo.repo_owner
                    });
                });
            }
            // Now fetch sync logs
            const { data: logsData, error: logsError } = await supabase
                .from('github_sync_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            if (logsError)
                throw logsError;
            // Transform the data manually to include repo name and owner
            const transformedData = logsData.map((log) => {
                const repo = repoMap.get(log.repo_id);
                return {
                    id: log.id,
                    repo_id: log.repo_id,
                    repo_name: repo?.repo_name || 'Unknown',
                    repo_owner: repo?.repo_owner || 'Unknown',
                    sync_type: log.sync_type,
                    status: log.status,
                    details: log.details,
                    created_at: log.created_at
                };
            });
            setSyncLogs(transformedData);
        }
        catch (error) {
            console.error("Error fetching sync logs:", error);
            toast.error("Failed to load sync history");
        }
        finally {
            setLoading(false);
        }
    };
    const filterSyncLogs = (logs) => {
        if (activeFilter === "all")
            return logs;
        return logs.filter(log => log.status === activeFilter);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "success":
                return _jsx(Check, { className: "h-4 w-4 text-green-500" });
            case "failure":
                return _jsx(XCircle, { className: "h-4 w-4 text-red-500" });
            case "conflict":
                return _jsx(AlertTriangle, { className: "h-4 w-4 text-amber-500" });
            default:
                return _jsx(Clock, { className: "h-4 w-4 text-muted-foreground" });
        }
    };
    const getSyncTypeIcon = (type) => {
        switch (type) {
            case "push":
                return _jsx(GitBranch, { className: "h-4 w-4 text-neon-blue" });
            case "pull":
                return _jsx(GitPullRequest, { className: "h-4 w-4 text-neon-pink" });
            case "webhook":
                return _jsx(GitMerge, { className: "h-4 w-4 text-green-500" });
            default:
                return _jsx(GitBranch, { className: "h-4 w-4 text-muted-foreground" });
        }
    };
    if (!isConnected) {
        return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Sync Status" }), _jsx(CardDescription, { children: "View your GitHub synchronization history" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center", children: [_jsx(GitBranch, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "font-medium mb-2", children: "Not Connected to GitHub" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "You need to connect your GitHub account first to see sync history." })] }) }) })] }));
    }
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Sync Status" }), _jsx(CardDescription, { children: "View your GitHub synchronization history" })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: fetchSyncLogs, disabled: loading, children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(RefreshCw, { className: "h-4 w-4" }) })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Tabs, { defaultValue: "all", onValueChange: setActiveFilter, children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "all", children: "All" }), _jsx(TabsTrigger, { value: "success", children: "Successful" }), _jsx(TabsTrigger, { value: "failure", children: "Failed" }), _jsx(TabsTrigger, { value: "conflict", children: "Conflicts" })] }) }), _jsxs("div", { className: "flex items-center text-xs text-muted-foreground", children: [_jsx(Filter, { className: "h-3 w-3 mr-1" }), _jsxs("span", { children: ["Showing ", filterSyncLogs(syncLogs).length, " of ", syncLogs.length, " records"] })] })] }), loading ? (_jsx("div", { className: "py-8 flex justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) })) : syncLogs.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(GitBranch, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No Sync History" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Start syncing your repositories to see history here." })] })) : (_jsx("div", { className: "space-y-2", children: filterSyncLogs(syncLogs).map((log) => (_jsxs("div", { className: "border rounded-lg p-3 hover:bg-muted/50 transition-colors flex items-center", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getStatusIcon(log.status), _jsxs("span", { className: "font-medium", children: [log.repo_owner, "/", log.repo_name] }), _jsxs("div", { className: "flex items-center gap-1 text-xs", children: [_jsx(ArrowDownUp, { className: "h-3 w-3 text-muted-foreground" }), _jsxs(Badge, { variant: "outline", className: "h-5 px-1 font-normal", children: [getSyncTypeIcon(log.sync_type), _jsx("span", { className: "ml-1 capitalize", children: log.sync_type })] })] })] }), _jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [format(new Date(log.created_at), 'PPp'), " \u2022 ", formatDistanceToNow(new Date(log.created_at), { addSuffix: true })] }), log.details?.message && (_jsx("div", { className: "mt-2 text-xs bg-muted/50 p-2 rounded", children: log.details.message }))] }), _jsxs("div", { children: [log.status === "success" && _jsx(Badge, { className: "bg-green-500", children: "Success" }), log.status === "failure" && _jsx(Badge, { className: "bg-red-500", children: "Failed" }), log.status === "conflict" && _jsx(Badge, { className: "bg-amber-500", children: "Conflict" })] })] }, log.id))) }))] })] }));
}
