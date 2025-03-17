
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
    RouteLoggingService.logRouteChange(
      previousRoute || 'unknown', 
      `${location.pathname}?tab=${currentTab}`
    );
  }, [location.pathname, currentTab]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    navigate(`/settings?tab=${tab}`, { replace: true });
    
    // Log tab change
    RouteLoggingService.logRouteChange(
      `${location.pathname}?tab=${currentTab}`,
      `${location.pathname}?tab=${tab}`
    );
  };
  
  const tabs = [
    {
      value: "account",
      label: "Account",
      content: <ProfileSettings />
    },
    {
      value: "api",
      label: "API",
      content: <ApiSettings />
    },
    {
      value: "github",
      label: "GitHub",
      content: <GitHubSettings />
    },
    {
      value: "github-repos",
      label: "GitHub Repos",
      content: <GitHubRepositorySettings />
    },
    {
      value: "chat",
      label: "Chat",
      content: <ChatSettings />
    },
    {
      value: "project-hub",
      label: "Project Hub",
      content: <ProjectHubSettings />
    },
    {
      value: "general",
      label: "General",
      content: <GeneralSettings />
    }
  ];
  
  return (
    <SettingsLayout>
      <SettingsNavigation 
        tabs={tabs} 
        defaultValue={currentTab} 
        onTabChange={handleTabChange}
      />
    </SettingsLayout>
  );
}
