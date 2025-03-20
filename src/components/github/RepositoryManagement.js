import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Github, RefreshCw, LinkIcon, Clock, GitBranch, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
export function RepositoryManagement() {
    const [loading, setLoading] = useState(true);
    const [repositories, setRepositories] = useState([]);
    const [syncingRepo, setSyncingRepo] = useState(null);
    const { isConnected, linkedAccounts } = useGitHubConnection();
    useEffect(() => {
        if (isConnected) {
            fetchRepositories();
        }
    }, [isConnected]);
    const fetchRepositories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("github_repositories")
                .select("*")
                .order("created_at", { ascending: false });
            if (error)
                throw error;
            setRepositories(data || []);
        }
        catch (error) {
            console.error("Error fetching repositories:", error);
            toast.error("Failed to load repositories");
        }
        finally {
            setLoading(false);
        }
    };
    const syncRepository = async (repoId) => {
        setSyncingRepo(repoId);
        try {
            const { error } = await supabase.functions.invoke("github-repo-management", {
                body: {
                    action: "sync-repo",
                    repoId
                }
            });
            if (error)
                throw error;
            toast.success("Repository sync initiated");
            // Refresh the repository list after a short delay
            setTimeout(() => {
                fetchRepositories();
            }, 1000);
        }
        catch (error) {
            console.error("Error syncing repository:", error);
            toast.error("Failed to sync repository");
        }
        finally {
            setSyncingRepo(null);
        }
    };
    const toggleAutoSync = async (repoId, currentValue) => {
        try {
            const { error } = await supabase
                .from("github_repositories")
                .update({ auto_sync: !currentValue })
                .eq("id", repoId);
            if (error)
                throw error;
            // Update the local state
            setRepositories(repos => repos.map(repo => repo.id === repoId ? { ...repo, auto_sync: !currentValue } : repo));
            toast.success(`Auto-sync ${!currentValue ? 'enabled' : 'disabled'}`);
        }
        catch (error) {
            console.error("Error toggling auto-sync:", error);
            toast.error("Failed to update auto-sync setting");
        }
    };
    const getSyncStatusBadge = (status) => {
        switch (status) {
            case "success":
                return _jsx(Badge, { className: "bg-green-500", children: "Synced" });
            case "pending":
                return _jsx(Badge, { className: "bg-amber-500", children: "Pending" });
            case "syncing":
                return _jsx(Badge, { className: "bg-blue-500", children: "Syncing" });
            case "failed":
                return _jsx(Badge, { className: "bg-red-500", children: "Failed" });
            default:
                return _jsx(Badge, { className: "bg-slate-500", children: "Unknown" });
        }
    };
    if (!isConnected) {
        return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Repositories" }), _jsx(CardDescription, { children: "Connect to GitHub to manage your repositories" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center", children: [_jsx(Github, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "font-medium mb-2", children: "Not Connected to GitHub" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "You need to connect your GitHub account first to manage repositories." })] }) }) })] }));
    }
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "GitHub Repositories" }), _jsx(CardDescription, { children: "Manage your connected GitHub repositories" })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: fetchRepositories, disabled: loading, children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(RefreshCw, { className: "h-4 w-4" }) })] }), _jsx(CardContent, { children: _jsxs(Tabs, { defaultValue: "all", children: [_jsxs(TabsList, { className: "mb-4", children: [_jsx(TabsTrigger, { value: "all", children: "All Repositories" }), _jsx(TabsTrigger, { value: "autosync", children: "Auto-Sync Enabled" })] }), _jsx(TabsContent, { value: "all", children: loading ? (_jsx("div", { className: "py-8 flex justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) })) : repositories.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(GitBranch, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No Repositories Found" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Import a GitHub repository to get started." })] })) : (_jsx("div", { className: "space-y-4", children: repositories.map((repo) => (_jsx("div", { className: "border rounded-lg p-4 hover:bg-muted/50 transition-colors", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4 text-neon-blue" }), _jsxs("a", { href: repo.repo_url, target: "_blank", rel: "noopener noreferrer", className: "font-medium hover:text-neon-blue transition-colors flex items-center gap-1", children: [repo.repo_owner, "/", repo.repo_name, _jsx(LinkIcon, { className: "h-3 w-3" })] })] }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-xs", children: [getSyncStatusBadge(repo.sync_status), repo.last_synced_at && (_jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), "Last synced ", formatDistanceToNow(new Date(repo.last_synced_at), { addSuffix: true })] })), repo.auto_sync && (_jsx(Badge, { variant: "outline", className: "border-neon-blue text-neon-blue", children: "Auto-sync" }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => toggleAutoSync(repo.id, repo.auto_sync), children: repo.auto_sync ? 'Disable Auto-sync' : 'Enable Auto-sync' }), _jsx(Button, { variant: "default", size: "sm", onClick: () => syncRepository(repo.id), disabled: syncingRepo === repo.id, className: "bg-neon-blue hover:bg-neon-blue/80", children: syncingRepo === repo.id ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-3 w-3 mr-1 animate-spin" }), "Syncing..."] })) : (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-3 w-3 mr-1" }), "Sync Now"] })) })] })] }) }, repo.id))) })) }), _jsx(TabsContent, { value: "autosync", children: loading ? (_jsx("div", { className: "py-8 flex justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) })) : repositories.filter(r => r.auto_sync).length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Shield, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No Auto-Sync Repositories" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Enable auto-sync for your repositories to keep them updated automatically." })] })) : (_jsx("div", { className: "space-y-4", children: repositories.filter(r => r.auto_sync).map((repo) => (_jsx("div", { className: "border rounded-lg p-4 hover:bg-muted/50 transition-colors", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4 text-neon-blue" }), _jsxs("a", { href: repo.repo_url, target: "_blank", rel: "noopener noreferrer", className: "font-medium hover:text-neon-blue transition-colors flex items-center gap-1", children: [repo.repo_owner, "/", repo.repo_name, _jsx(LinkIcon, { className: "h-3 w-3" })] })] }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-xs", children: [getSyncStatusBadge(repo.sync_status), repo.last_synced_at && (_jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), "Last synced ", formatDistanceToNow(new Date(repo.last_synced_at), { addSuffix: true })] }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => toggleAutoSync(repo.id, repo.auto_sync), children: "Disable Auto-sync" }), _jsx(Button, { variant: "default", size: "sm", onClick: () => syncRepository(repo.id), disabled: syncingRepo === repo.id, className: "bg-neon-blue hover:bg-neon-blue/80", children: syncingRepo === repo.id ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-3 w-3 mr-1 animate-spin" }), "Syncing..."] })) : (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-3 w-3 mr-1" }), "Sync Now"] })) })] })] }) }, repo.id))) })) })] }) })] }));
}
