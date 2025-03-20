import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { GitHubConnectedView } from "./components/GitHubConnectedView";
import { GitHubNotConnectedView } from "./components/GitHubNotConnectedView";
import { useGitHubToken } from "./hooks/useGitHubToken";
export function GitHubSettings({ githubToken, onGithubTokenChange }) {
    const [newGithubToken, setNewGithubToken] = useState("");
    const { isSaving, isValidating, isValid, metrics, githubUsername, validateGithubToken, saveGithubToken, syncGithubMetrics } = useGitHubToken();
    const handleSaveToken = async () => {
        await saveGithubToken(newGithubToken, onGithubTokenChange);
        setNewGithubToken("");
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-5 w-5" }), "GitHub Integration"] }), _jsx(CardDescription, { children: "Connect your GitHub account to enable repository access and code generation" })] }), _jsx(CardContent, { children: githubToken ? (_jsx(GitHubConnectedView, { githubUsername: githubUsername, metrics: metrics, isValidating: isValidating, syncGithubMetrics: syncGithubMetrics, validateGithubToken: validateGithubToken, token: githubToken })) : (_jsx(GitHubNotConnectedView, { newGithubToken: newGithubToken, setNewGithubToken: setNewGithubToken, isValidating: isValidating, validateGithubToken: validateGithubToken })) }), _jsx(CardFooter, { className: "pt-2", children: !githubToken && (_jsx(Button, { onClick: handleSaveToken, disabled: isSaving || !isValid, className: "w-full", children: isSaving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Github, { className: "h-4 w-4 mr-2" }), "Save GitHub Token"] })) })) })] }));
}
