
import React from "react";
import { MobileSettingsSection } from "../components/settings/MobileSettingsSection";
import { MobileGitHubSettings } from "../components/settings/MobileGitHubSettings";

export const MobileSettings = () => {
  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <MobileSettingsSection
        title="GitHub Integration"
        icon="github"
        description="Manage your GitHub connection and repository preferences"
      >
        <MobileGitHubSettings />
      </MobileSettingsSection>
      
      {/* Add other settings sections here */}
      <MobileSettingsSection
        title="Account"
        icon="user"
        description="Manage your account settings and preferences"
      >
        {/* Account settings content */}
        <div className="p-4 rounded-lg bg-dark-lighter/30 text-sm text-muted-foreground">
          Account settings coming soon
        </div>
      </MobileSettingsSection>
      
      <MobileSettingsSection
        title="Appearance"
        icon="palette"
        description="Customize the app's appearance"
      >
        {/* Appearance settings content */}
        <div className="p-4 rounded-lg bg-dark-lighter/30 text-sm text-muted-foreground">
          Appearance settings coming soon
        </div>
      </MobileSettingsSection>
    </div>
  );
};
