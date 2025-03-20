import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, User, Plus, Check, Loader2, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
export function AccountSwitcher() {
    const { isConnected, isChecking, linkedAccounts, githubUsername, connectGitHub, disconnectGitHub, setDefaultGitHubAccount } = useGitHubConnection();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isSettingDefault, setIsSettingDefault] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const handleConnectAccount = () => {
        connectGitHub();
    };
    const handleSetDefaultAccount = async () => {
        if (!selectedAccount) {
            toast.error("Please select an account to set as default");
            return;
        }
        setIsSettingDefault(true);
        try {
            await setDefaultGitHubAccount(selectedAccount);
            toast.success("Default GitHub account updated");
        }
        catch (error) {
            console.error("Error setting default account:", error);
        }
        finally {
            setIsSettingDefault(false);
        }
    };
    const handleDisconnectAccount = async () => {
        if (!selectedAccount) {
            toast.error("Please select an account to disconnect");
            return;
        }
        setIsDisconnecting(true);
        try {
            await disconnectGitHub(selectedAccount);
            setSelectedAccount(null);
            toast.success("GitHub account disconnected");
        }
        catch (error) {
            console.error("Error disconnecting account:", error);
        }
        finally {
            setIsDisconnecting(false);
        }
    };
    if (!isConnected) {
        return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Accounts" }), _jsx(CardDescription, { children: "Connect and manage your GitHub accounts" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center", children: [_jsx(Github, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "font-medium mb-2", children: "Not Connected to GitHub" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Connect your GitHub account to get started" }), _jsx(Button, { onClick: handleConnectAccount, disabled: isChecking, children: isChecking ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Checking Connection..."] })) : (_jsxs(_Fragment, { children: [_jsx(Github, { className: "h-4 w-4 mr-2" }), "Connect to GitHub"] })) })] }) }) })] }));
    }
    if (linkedAccounts.length === 0) {
        return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Accounts" }), _jsx(CardDescription, { children: "Connect and manage your GitHub accounts" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center", children: [_jsx(User, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "font-medium mb-2", children: "No Linked Accounts" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "You're connected to GitHub but don't have any linked accounts." }), _jsxs(Button, { onClick: handleConnectAccount, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add GitHub Account"] })] }) }) })] }));
    }
    const defaultAccount = linkedAccounts.find(account => account.default);
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "GitHub Accounts" }), _jsx(CardDescription, { children: "Manage your connected GitHub accounts" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "p-4 rounded-lg bg-muted/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5 text-green-500" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Default Account" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Used for all GitHub operations" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4 text-neon-blue" }), _jsx("span", { className: "font-medium", children: defaultAccount ? `@${defaultAccount.username}` : "None set" })] })] }) }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Select Account" }), _jsxs(Select, { value: selectedAccount || "", onValueChange: setSelectedAccount, children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, { placeholder: "Select a GitHub account" }) }), _jsx(SelectContent, { children: linkedAccounts.map(account => (_jsx(SelectItem, { value: account.id, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Github, { className: "h-4 w-4" }), "@", account.username] }), account.default && (_jsx(Check, { className: "h-4 w-4 text-green-500" }))] }) }, account.id))) })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [_jsx(Button, { variant: "default", onClick: handleSetDefaultAccount, disabled: !selectedAccount || isSettingDefault, className: "sm:flex-1", children: isSettingDefault ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Setting Default..."] })) : (_jsxs(_Fragment, { children: [_jsx(Check, { className: "h-4 w-4 mr-2" }), "Set as Default"] })) }), _jsx(Button, { variant: "destructive", onClick: handleDisconnectAccount, disabled: !selectedAccount || isDisconnecting, className: "sm:flex-1", children: isDisconnecting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Disconnecting..."] })) : ("Disconnect Account") })] })] })] }), _jsx(CardFooter, { className: "flex justify-center border-t pt-4", children: _jsxs(Button, { variant: "outline", onClick: handleConnectAccount, className: "w-full", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Another Account"] }) })] }));
}
