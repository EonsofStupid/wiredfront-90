import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Eye, Globe } from "lucide-react";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";

export default function Settings() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            <Eye className="h-4 w-4 mr-2" />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="accessibility">
            <AccessibilitySettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}