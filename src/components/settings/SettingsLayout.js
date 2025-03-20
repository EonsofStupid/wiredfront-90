import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubSettings } from "@/components/settings/sections/GitHubSettings";
import { GitHubRepositorySettings } from "@/components/settings/sections/GitHubRepositorySettings";
import { ProfileSettings } from "@/components/settings/sections/ProfileSettings";
import { ApiSettings } from "@/components/settings/sections/ApiSettings";
import { GeneralSettings } from "@/components/settings/sections/GeneralSettings";
import { ProjectHubSettings } from "@/components/settings/sections/ProjectHubSettings";
import { useRouter } from "next/router";
export function SettingsLayout() {
    const router = useRouter();
    const { tab } = router.query;
    // Set the active tab based on the URL query parameter
    const defaultTab = typeof tab === 'string' ? tab : 'account';
    // Update URL when tab changes
    const handleTabChange = (value) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: value }
        }, undefined, { shallow: true });
    };
    return (_jsxs("div", { className: "container py-10", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Settings" }), _jsxs(Tabs, { value: defaultTab, onValueChange: handleTabChange, className: "space-y-4", children: [_jsxs(TabsList, { className: "grid grid-cols-6", children: [_jsx(TabsTrigger, { value: "account", children: "Account" }), _jsx(TabsTrigger, { value: "api", children: "API" }), _jsx(TabsTrigger, { value: "github", children: "GitHub" }), _jsx(TabsTrigger, { value: "github-repos", children: "GitHub Repos" }), _jsx(TabsTrigger, { value: "project-hub", children: "Project Hub" }), _jsx(TabsTrigger, { value: "general", children: "General" })] }), _jsx(TabsContent, { value: "account", children: _jsx(ProfileSettings, {}) }), _jsx(TabsContent, { value: "api", children: _jsx(ApiSettings, {}) }), _jsx(TabsContent, { value: "github", children: _jsx(GitHubSettings, {}) }), _jsx(TabsContent, { value: "github-repos", children: _jsx(GitHubRepositorySettings, {}) }), _jsx(TabsContent, { value: "project-hub", children: _jsx(ProjectHubSettings, {}) }), _jsx(TabsContent, { value: "general", children: _jsx(GeneralSettings, {}) })] })] }));
}
