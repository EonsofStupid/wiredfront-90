import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, RefreshCw, GitPullRequest, Settings, Code, AlertCircle } from "lucide-react";
import { NavigationService } from "@/services/navigation/NavigationService";
export function GitHubQuickActions({ username, onRefreshConnection, onOpenRepositories, isRefreshing = false }) {
    const navigate = useNavigate();
    const handleOpenSettings = (section) => {
        NavigationService.navigateToSettings(navigate, section);
    };
    if (!username) {
        return (_jsxs(Card, { className: "bg-background/30 border border-neon-blue/20 p-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 text-sm font-medium", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-amber-500" }), _jsx("span", { children: "GitHub Not Connected" })] }), _jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Connect your GitHub account to access quick actions." })] }));
    }
    return (_jsxs(Card, { className: "bg-background/30 border border-neon-blue/20 p-3", children: [_jsxs("h3", { className: "text-sm font-medium mb-2 flex items-center gap-1.5", children: [_jsx(Settings, { className: "h-4 w-4 text-neon-blue" }), "Quick Actions"] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10", onClick: onOpenRepositories, children: [_jsx(Code, { className: "h-3.5 w-3.5 mr-2 text-neon-blue" }), "Repositories"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10", onClick: onRefreshConnection, disabled: isRefreshing, children: [_jsx(RefreshCw, { className: `h-3.5 w-3.5 mr-2 text-neon-blue ${isRefreshing ? 'animate-spin' : ''}` }), isRefreshing ? 'Refreshing...' : 'Refresh Sync'] }), _jsxs(Button, { variant: "outline", size: "sm", className: "h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10", onClick: () => handleOpenSettings('github'), children: [_jsx(GitPullRequest, { className: "h-3.5 w-3.5 mr-2 text-neon-pink" }), "Manage Auth"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10", onClick: () => NavigationService.openExternalUrl(`https://github.com/${username}`), children: [_jsx(GitBranch, { className: "h-3.5 w-3.5 mr-2 text-neon-blue" }), "Open GitHub"] })] })] }));
}
