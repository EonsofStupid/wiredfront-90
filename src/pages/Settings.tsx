import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { APISettings } from "@/components/settings/APISettings";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="glass-card p-6">
            <GeneralSettings />
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="glass-card p-6">
            <AccessibilitySettings />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="glass-card p-6">
            <NotificationSettings />
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="glass-card p-6">
            <APISettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;