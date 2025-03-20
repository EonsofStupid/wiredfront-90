import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RepositoryManagement } from "@/components/github/RepositoryManagement";
import { SyncStatusDashboard } from "@/components/github/SyncStatusDashboard";
import { AccountSwitcher } from "@/components/github/AccountSwitcher";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";
export function GitHubRepositorySettings() {
    const { isConnected, isChecking, connectionStatus, githubUsername, connectGitHub, disconnectGitHub } = useGitHubConnection();
    // Extract error message from connection status
    const errorMessage = connectionStatus.errorMessage || null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Integration" }), _jsx(CardDescription, { children: "Connect your GitHub account to access repositories and collaborate on code" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(GitHubConnectionStatus, { isConnected: isConnected, username: githubUsername, loading: isChecking, connectionStatus: connectionStatus.status === "connected" ? "connected" :
                                    connectionStatus.status === "pending" ? "connecting" :
                                        connectionStatus.status === "error" ? "error" : "idle", onConnect: connectGitHub, onDisconnect: disconnectGitHub }), _jsx(GitHubErrorMessage, { errorMessage: errorMessage, connectionStatus: connectionStatus.status === "connected" ? "connected" :
                                    connectionStatus.status === "pending" ? "connecting" :
                                        connectionStatus.status === "error" ? "error" : "idle" })] })] }), isConnected && (_jsxs(Tabs, { defaultValue: "accounts", className: "space-y-4", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "accounts", children: "Account Management" }), _jsx(TabsTrigger, { value: "repositories", children: "Repositories" }), _jsx(TabsTrigger, { value: "sync", children: "Sync Status" })] }), _jsx(TabsContent, { value: "accounts", children: _jsx(AccountSwitcher, {}) }), _jsx(TabsContent, { value: "repositories", children: _jsx(RepositoryManagement, {}) }), _jsx(TabsContent, { value: "sync", children: _jsx(SyncStatusDashboard, {}) })] }))] }));
}
