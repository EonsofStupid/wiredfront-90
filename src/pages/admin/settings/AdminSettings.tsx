
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Globe, Bell, MessageSquare, Eye, Webhook } from "lucide-react";
import { APISettings } from "@/components/admin/settings/APISettings";
import { AccessibilitySettings } from "@/components/admin/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChatSettings } from "@/components/admin/settings/ChatSettings";
import { LivePreviewSettings } from "@/components/admin/settings/LivePreviewSettings";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function AdminSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'api';

  useEffect(() => {
    // If we're at /admin/settings, redirect to /admin/settings/api
    if (location.pathname === '/admin/settings') {
      navigate('/admin/settings/api');
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/admin/settings/${value}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>

      <Card className="p-6">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              API & Integrations
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="live-preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <APISettings />
          </TabsContent>

          <TabsContent value="accessibility">
            <AccessibilitySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSettings />
          </TabsContent>

          <TabsContent value="live-preview">
            <LivePreviewSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
