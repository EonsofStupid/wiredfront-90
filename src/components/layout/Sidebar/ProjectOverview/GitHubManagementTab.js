import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Github, UserCog, History, RefreshCw, Loader2 } from "lucide-react";
import { GitHubAccountCard } from "./github/GitHubAccountCard";
import { GitHubQuickActions } from "./github/GitHubQuickActions";
import { GitHubRecentActivity } from "./github/GitHubRecentActivity";
import { NavigationService } from "@/services/navigation/NavigationService";
import { GitHubErrorBoundary } from "@/components/github/GitHubErrorBoundary";
export function GitHubManagementTab({ isConnected, githubUsername, connectGitHub, disconnectGitHub, isChecking = false, checkConnectionStatus = () => { }, linkedAccounts = [], error = null }) {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tabError, setTabError] = useState(error);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        // Set a slight delay to ensure component is properly mounted
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        setTabError(error);
    }, [error]);
    const handleRefreshConnection = async () => {
        try {
            setIsRefreshing(true);
            await checkConnectionStatus();
            setTabError(null);
        }
        catch (err) {
            setTabError(err instanceof Error ? err.message : "Failed to refresh GitHub connection");
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const handleOpenRepositories = () => {
        NavigationService.navigateToSettings(navigate, 'github-repos');
    };
    const handleAdvancedSettings = () => {
        NavigationService.navigateToSettings(navigate, 'github');
    };
    // Show loading state while component is initializing
    if (!isLoaded) {
        return (_jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-6 w-6 mx-auto mb-2 animate-spin text-neon-blue/50" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Loading GitHub information..." })] }) }));
    }
    if (!isConnected) {
        return (_jsx("div", { className: "flex-1 flex flex-col items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(Github, { className: "h-12 w-12 mx-auto text-neon-blue/50" }), _jsx("h3", { className: "text-lg font-medium text-neon-blue", children: "GitHub Not Connected" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Connect your GitHub account to manage repositories and track sync status." }), _jsx(Button, { onClick: connectGitHub, disabled: isChecking, className: "bg-neon-blue hover:bg-neon-blue/80", children: isChecking ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }), "Connecting..."] })) : (_jsxs(_Fragment, { children: [_jsx(Github, { className: "h-4 w-4 mr-2" }), "Connect GitHub"] })) })] }) }));
    }
    return (_jsx(GitHubErrorBoundary, { children: _jsx(ScrollArea, { className: "flex-1", children: _jsxs("div", { className: "p-4 space-y-4", children: [tabError && (_jsx(ErrorMessage, { message: tabError, className: "mb-4" })), _jsx(GitHubAccountCard, { username: githubUsername, accounts: linkedAccounts, onAddAccount: connectGitHub, onDisconnect: disconnectGitHub }), _jsx(GitHubQuickActions, { username: githubUsername, onRefreshConnection: handleRefreshConnection, onOpenRepositories: handleOpenRepositories, isRefreshing: isRefreshing }), _jsxs(Card, { className: "bg-background/30 border border-neon-blue/20 p-3", children: [_jsxs("h3", { className: "text-sm font-medium mb-2 flex items-center gap-1.5", children: [_jsx(History, { className: "h-4 w-4 text-neon-pink" }), "Recent Activity"] }), _jsx(GitHubRecentActivity, { username: githubUsername })] }), _jsx("div", { className: "text-center pt-2", children: _jsxs(Button, { variant: "link", size: "sm", className: "text-xs text-muted-foreground hover:text-neon-blue", onClick: handleAdvancedSettings, children: [_jsx(UserCog, { className: "h-3 w-3 mr-1" }), "Advanced GitHub Settings"] }) })] }) }) }));
}
