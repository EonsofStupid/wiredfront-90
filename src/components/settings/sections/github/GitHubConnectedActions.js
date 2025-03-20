import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, GitBranch, GitPullRequest, RefreshCw, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
export function GitHubConnectedActions({ isConnected, username, repoCount, isLoading = false }) {
    const [isSyncing, setIsSyncing] = useState(false);
    if (!isConnected)
        return null;
    const syncRepositories = async () => {
        setIsSyncing(true);
        try {
            // In a real implementation, this would call an API to sync repositories
            // For now we'll simulate it with a toast notification
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("GitHub repositories synchronized successfully");
        }
        catch (error) {
            toast.error("Failed to sync repositories");
            console.error("Repository sync error:", error);
        }
        finally {
            setIsSyncing(false);
        }
    };
    return (_jsx("div", { className: "space-y-4", children: _jsxs(Card, { className: "bg-card", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { className: "text-base", children: "GitHub Actions" }), _jsx(CardDescription, { children: "Manage your GitHub integration" })] }), _jsxs(CardContent, { className: "space-y-4", children: [isLoading ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-3/4" })] })) : (_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Connected as", " ", username ? (_jsxs("a", { href: `https://github.com/${username}`, target: "_blank", rel: "noopener noreferrer", className: "font-medium text-[#8B5CF6] hover:text-[#7E69AB] transition-colors inline-flex items-center", children: ["@", username, _jsx(ExternalLink, { className: "h-3 w-3 ml-1" })] })) : (_jsx("span", { className: "font-medium text-primary", children: "Unknown User" }))] }), repoCount !== undefined && (_jsxs("p", { className: "text-sm text-muted-foreground", children: [repoCount, " repositories available"] }))] })), _jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", onClick: syncRepositories, disabled: isSyncing, children: [isSyncing ? (_jsx(RefreshCw, { className: "h-4 w-4 animate-spin" })) : (_jsx(RefreshCw, { className: "h-4 w-4" })), isSyncing ? "Syncing..." : "Sync Repositories"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(GitBranch, { className: "h-4 w-4" }), "Manage Branches"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(GitPullRequest, { className: "h-4 w-4" }), "View Pull Requests"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(Share2, { className: "h-4 w-4" }), "Share Access"] })] })] })] }) }));
}
