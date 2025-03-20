import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { Loader2, Github, Plus, ExternalLink, Check, AlertCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
export const MobileGitHubSettings = () => {
    const { isConnected, isChecking, connectionStatus, githubUsername, linkedAccounts, connectGitHub, disconnectGitHub, setDefaultGitHubAccount } = useGitHubConnection();
    const [expandedAccount, setExpandedAccount] = useState(null);
    const [activeTab, setActiveTab] = useState("accounts");
    const handleConnect = () => {
        connectGitHub();
    };
    const handleDisconnect = (accountId) => {
        if (accountId) {
            disconnectGitHub(accountId);
        }
        else {
            disconnectGitHub();
        }
    };
    const handleSetDefaultAccount = (accountId) => {
        setDefaultGitHubAccount(accountId);
        toast.success("Default GitHub account updated");
    };
    const toggleAccountExpanded = (accountId) => {
        if (expandedAccount === accountId) {
            setExpandedAccount(null);
        }
        else {
            setExpandedAccount(accountId);
        }
    };
    const renderConnectionStatus = () => {
        if (isChecking) {
            return (_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Checking connection..."] }));
        }
        if (connectionStatus.status === 'error') {
            return (_jsxs("div", { className: "flex items-start gap-2 mt-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-red-500 mt-0.5 shrink-0" }), _jsx("div", { className: "text-sm text-red-500", children: connectionStatus.errorMessage || "Connection error" })] }));
        }
        if (isConnected && connectionStatus.lastCheck) {
            const lastCheck = new Date(connectionStatus.lastCheck);
            return (_jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: ["Last checked ", formatDistanceToNow(lastCheck, { addSuffix: true })] }));
        }
        return null;
    };
    if (!isConnected) {
        return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-dark-lighter/30 flex flex-col items-center justify-center space-y-3", children: [_jsx(Github, { className: "h-10 w-10 text-muted-foreground" }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium", children: "Not Connected" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Connect to GitHub to enable repository creation and code synchronization" })] }), renderConnectionStatus(), _jsx(Button, { className: "w-full mt-2", onClick: handleConnect, disabled: isChecking || connectionStatus.status === 'connecting', children: isChecking || connectionStatus.status === 'connecting' ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Connecting..."] })) : (_jsxs(_Fragment, { children: [_jsx(Github, { className: "h-4 w-4 mr-2" }), "Connect to GitHub"] })) })] }), _jsxs("div", { className: "text-xs text-muted-foreground space-y-2", children: [_jsx("p", { className: "font-medium", children: "GitHub integration enables:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 pl-2", children: [_jsx("li", { children: "Creating and managing repositories" }), _jsx("li", { children: "Syncing code changes" }), _jsx("li", { children: "Connecting multiple GitHub accounts" }), _jsx("li", { children: "Importing existing projects" })] })] })] }));
    }
    return (_jsx("div", { className: "p-4", children: _jsxs(Tabs, { defaultValue: "accounts", onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "w-full grid grid-cols-3 mb-4", children: [_jsx(TabsTrigger, { value: "accounts", children: "Accounts" }), _jsx(TabsTrigger, { value: "repos", children: "Repositories" }), _jsx(TabsTrigger, { value: "sync", children: "Sync" })] }), _jsxs(TabsContent, { value: "accounts", className: "space-y-4", children: [_jsx("div", { className: "bg-dark-lighter/20 border border-neon-blue/20 rounded-lg p-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Default Account" }), linkedAccounts.find(a => a.default) ? (_jsxs(Badge, { className: "bg-green-500/20 text-green-500 font-normal", children: ["@", linkedAccounts.find(a => a.default)?.username] })) : (_jsx(Badge, { variant: "outline", className: "font-normal", children: "None set" }))] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium", children: "Linked Accounts" }), linkedAccounts.map((account) => (_jsxs("div", { className: "border border-neon-blue/20 rounded-lg overflow-hidden bg-dark-lighter/20", children: [_jsxs("div", { className: "flex items-center justify-between p-3 cursor-pointer hover:bg-dark-lighter/30 transition-colors", onClick: () => toggleAccountExpanded(account.id), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4 text-neon-blue" }), _jsxs("span", { className: "font-medium", children: ["@", account.username] }), account.default && (_jsx(Badge, { className: "text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500", children: "Default" }))] }), _jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })] }), expandedAccount === account.id && (_jsxs("div", { className: "p-3 border-t border-neon-blue/10 space-y-3 animate-in fade-in-50 duration-200", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("a", { href: `https://github.com/${account.username}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs flex items-center gap-1 text-neon-blue", children: ["View Profile", _jsx(ExternalLink, { className: "h-3 w-3" })] }), !account.default && (_jsxs(Button, { variant: "outline", size: "sm", className: "text-xs h-7 text-green-500 border-green-500/30 hover:bg-green-500/10", onClick: () => handleSetDefaultAccount(account.id), children: [_jsx(Check, { className: "h-3 w-3 mr-1" }), "Set as Default"] }))] }), _jsx(Button, { variant: "destructive", size: "sm", className: "w-full text-xs", onClick: () => handleDisconnect(account.id), children: "Disconnect This Account" })] }))] }, account.id))), _jsxs(Button, { variant: "outline", size: "sm", className: "w-full mt-2", onClick: handleConnect, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Connect Another Account"] })] })] }), _jsx(TabsContent, { value: "repos", children: _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "p-4 rounded-lg bg-dark-lighter/20 border border-neon-blue/10 flex flex-col items-center justify-center", children: [_jsx("h3", { className: "font-medium", children: "Repository Management" }), _jsx("p", { className: "text-sm text-muted-foreground text-center mt-1 mb-3", children: "Go to the full GitHub settings page to manage your repositories" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full", onClick: () => window.location.href = '/settings', children: "Open Full Settings" })] }) }) }), _jsx(TabsContent, { value: "sync", children: _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "p-4 rounded-lg bg-dark-lighter/20 border border-neon-blue/10 flex flex-col items-center justify-center", children: [_jsx("h3", { className: "font-medium", children: "Sync Status Dashboard" }), _jsx("p", { className: "text-sm text-muted-foreground text-center mt-1 mb-3", children: "Go to the full GitHub settings page to view your sync history" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full", onClick: () => window.location.href = '/settings', children: "Open Full Settings" })] }) }) })] }) }));
};
