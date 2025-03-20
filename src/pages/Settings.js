import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/layout/SettingsLayout";
import { SettingsNavigation } from "@/components/settings/layout/SettingsNavigation";
import { GeneralSettings } from "@/components/settings/sections/GeneralSettings";
import { ApiSettings } from "@/components/settings/sections/ApiSettings";
import { GitHubSettings } from "@/components/settings/sections/GitHubSettings";
import { GitHubRepositorySettings } from "@/components/settings/sections/GitHubRepositorySettings";
import { ProfileSettings } from "@/components/settings/sections/ProfileSettings";
import { ProjectHubSettings } from "@/components/settings/sections/ProjectHubSettings";
import { ChatSettings } from "@/components/settings/sections/ChatSettings";
import { RouteLoggingService } from "@/services/navigation/RouteLoggingService";
export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    // Default to 'account' tab if no tab specified
    const currentTab = tabParam || 'account';
    // Log navigation to this page
    useEffect(() => {
        const previousRoute = document.referrer;
        RouteLoggingService.logRouteChange(previousRoute || 'unknown', `${location.pathname}?tab=${currentTab}`);
    }, [location.pathname, currentTab]);
    // Handle tab change
    const handleTabChange = (tab) => {
        navigate(`/settings?tab=${tab}`, { replace: true });
        // Log tab change
        RouteLoggingService.logRouteChange(`${location.pathname}?tab=${currentTab}`, `${location.pathname}?tab=${tab}`);
    };
    const tabs = [
        {
            value: "account",
            label: "Account",
            content: _jsx(ProfileSettings, {})
        },
        {
            value: "api",
            label: "API",
            content: _jsx(ApiSettings, {})
        },
        {
            value: "github",
            label: "GitHub",
            content: _jsx(GitHubSettings, {})
        },
        {
            value: "github-repos",
            label: "GitHub Repos",
            content: _jsx(GitHubRepositorySettings, {})
        },
        {
            value: "chat",
            label: "Chat",
            content: _jsx(ChatSettings, {})
        },
        {
            value: "project-hub",
            label: "Project Hub",
            content: _jsx(ProjectHubSettings, {})
        },
        {
            value: "general",
            label: "General",
            content: _jsx(GeneralSettings, {})
        }
    ];
    return (_jsx(SettingsLayout, { children: _jsx(SettingsNavigation, { tabs: tabs, defaultValue: currentTab, onTabChange: handleTabChange }) }));
}
