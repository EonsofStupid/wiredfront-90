import { SettingsLayout } from "@/components/settings/layout/SettingsLayout";
import { SettingsNavigation } from "@/components/settings/layout/SettingsNavigation";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { APISettings } from "@/components/settings/APISettings";
import { APIConfigurationPanel } from "@/components/settings/APIConfigurationPanel";
import { ChatSettings } from "@/components/settings/ChatSettings";

const Settings = () => {
  const settingsTabs = [
    { value: "general", label: "General", content: <GeneralSettings /> },
    { value: "accessibility", label: "Accessibility", content: <AccessibilitySettings /> },
    { value: "notifications", label: "Notifications", content: <NotificationSettings /> },
    { value: "chat", label: "Chat", content: <ChatSettings /> },
    { value: "api", label: "API Keys", content: <APISettings /> },
    { value: "api-config", label: "API Config", content: <APIConfigurationPanel /> },
  ];

  return (
    <SettingsLayout>
      <SettingsNavigation tabs={settingsTabs} defaultValue="general" />
    </SettingsLayout>
  );
};

export default Settings;