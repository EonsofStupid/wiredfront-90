import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Github, Server } from "lucide-react";
import { SettingsContainer } from "../../layout/SettingsContainer";
import { GitHubSettings } from "./GitHubSettings";
import { DockerSettings } from "./DockerSettings";
import { DatabaseSettings } from "./DatabaseSettings";
export function DevelopmentSettings({ githubToken, dockerToken, onGithubTokenChange, onDockerTokenChange }) {
    return (_jsx(SettingsContainer, { title: "Development Integrations", description: "Manage development tokens for GitHub, Docker, and other services", children: _jsxs(Tabs, { defaultValue: "github", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "github", className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4" }), "GitHub"] }), _jsxs(TabsTrigger, { value: "docker", className: "flex items-center gap-2", children: [_jsx(Server, { className: "h-4 w-4" }), "Docker"] }), _jsxs(TabsTrigger, { value: "database", className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-4 w-4" }), "Database"] })] }), _jsx(TabsContent, { value: "github", className: "space-y-4 pt-4", children: _jsx(GitHubSettings, { githubToken: githubToken, onGithubTokenChange: onGithubTokenChange }) }), _jsx(TabsContent, { value: "docker", className: "space-y-4 pt-4", children: _jsx(DockerSettings, { dockerToken: dockerToken, onDockerTokenChange: onDockerTokenChange }) }), _jsx(TabsContent, { value: "database", className: "space-y-4 pt-4", children: _jsx(DatabaseSettings, {}) })] }) }));
}
