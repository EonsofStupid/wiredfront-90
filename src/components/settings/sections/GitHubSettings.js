import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";
import { GitHubConnectedActions } from "./github/GitHubConnectedActions";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
export function GitHubSettings() {
    const { isConnected, isChecking, connectionStatus, connectGitHub, disconnectGitHub } = useGitHubConnection();
    // Extract username and error message from connection status
    const githubUsername = connectionStatus.metadata?.username || null;
    const errorMessage = connectionStatus.errorMessage || null;
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Integration" }), _jsx(CardDescription, { children: "Connect your GitHub account to access repositories and collaborate on code" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(GitHubConnectionStatus, { isConnected: isConnected, username: githubUsername, loading: isChecking, connectionStatus: connectionStatus.status === "connected" ? "connected" :
                            connectionStatus.status === "pending" ? "connecting" :
                                connectionStatus.status === "error" ? "error" : "idle", onConnect: connectGitHub, onDisconnect: disconnectGitHub }), _jsx(GitHubErrorMessage, { errorMessage: errorMessage, connectionStatus: connectionStatus.status === "connected" ? "connected" :
                            connectionStatus.status === "pending" ? "connecting" :
                                connectionStatus.status === "error" ? "error" : "idle" }), _jsx(GitHubConnectedActions, { isConnected: isConnected })] })] }));
}
