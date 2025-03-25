
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
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
  const handleTabChange = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: value }
    }, undefined, { shallow: true });
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={defaultTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="github-repos">GitHub Repos</TabsTrigger>
          <TabsTrigger value="project-hub">Project Hub</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiSettings />
        </TabsContent>
        
        <TabsContent value="github">
          <GitHubSettings />
        </TabsContent>
        
        <TabsContent value="github-repos">
          <GitHubRepositorySettings />
        </TabsContent>
        
        <TabsContent value="project-hub">
          <ProjectHubSettings />
        </TabsContent>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
