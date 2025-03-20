import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Github, Key, Shield } from "lucide-react";
import { useAPIKeyManagement } from "@/hooks/admin/settings/api/useAPIKeyManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
export function ApiSettings() {
    const [githubToken, setGithubToken] = useState("");
    const [tokenName, setTokenName] = useState("primary_github_token");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createApiKey, configurations } = useAPIKeyManagement();
    // Check if a GitHub token already exists, using type assertion
    const hasGitHubToken = configurations.some(config => config.api_type === 'github');
    const handleSaveGitHubToken = async () => {
        if (!githubToken) {
            toast.error("Please enter a GitHub token");
            return;
        }
        setIsSubmitting(true);
        try {
            await createApiKey('github', // Type assertion to bypass TypeScript restriction
            tokenName, githubToken, {
                feature_bindings: ['github_sync'],
                rag_preference: 'supabase',
                planning_mode: 'basic'
            }, ['developer', 'user'], []);
            setGithubToken("");
            toast.success("GitHub token saved successfully!");
        }
        catch (error) {
            console.error("Error saving GitHub token:", error);
            toast.error("Failed to save GitHub token");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "API Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Configure API tokens for integration with external services" })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-5 w-5" }), "GitHub Integration"] }), _jsx(CardDescription, { children: "Connect to GitHub for repository access and code management" })] }), hasGitHubToken && (_jsx(Shield, { className: "h-5 w-5 text-green-500" }))] }), _jsxs(CardContent, { className: "pt-4", children: [hasGitHubToken ? (_jsxs(Alert, { className: "bg-green-500/10 border-green-500/30 text-green-600", children: [_jsx(Shield, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "GitHub Connected" }), _jsx(AlertDescription, { children: "Your GitHub token is securely stored. You can manage your tokens in the settings." })] })) : (_jsxs(_Fragment, { children: [_jsxs(Alert, { className: "mb-4 border-amber-500/40 bg-amber-500/10 text-amber-600", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "GitHub Token Required" }), _jsx(AlertDescription, { children: "Add a GitHub personal access token to enable repository access and code syncing." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "tokenName", children: "Token Name" }), _jsx(Input, { id: "tokenName", placeholder: "e.g., primary_github_token", value: tokenName, onChange: (e) => setTokenName(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "githubToken", children: "GitHub Personal Access Token" }), _jsx(Input, { id: "githubToken", type: "password", placeholder: "ghp_...", value: githubToken, onChange: (e) => setGithubToken(e.target.value) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Create a token with ", _jsx("code", { children: "repo" }), " and ", _jsx("code", { children: "read:user" }), " scopes."] })] }), _jsx(Button, { onClick: handleSaveGitHubToken, disabled: isSubmitting, className: "w-full", children: isSubmitting ? "Saving..." : "Save GitHub Token" })] })] })), _jsx("div", { className: "mt-4 pt-4 border-t border-border", children: _jsxs("a", { href: "https://github.com/settings/tokens?type=beta", target: "_blank", rel: "noopener noreferrer", className: "text-sm flex items-center gap-1 text-primary hover:underline", children: [_jsx(Key, { className: "h-3 w-3" }), "Generate a new GitHub token"] }) })] })] })] }));
}
