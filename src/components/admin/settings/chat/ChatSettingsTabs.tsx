
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  MessageSquare, 
  Settings, 
  Brain, 
  UserCog, 
  Share2, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Save, 
  Shield, 
  Bell 
} from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { PrivacySettings } from "./PrivacySettings";
import { UISettings } from "./UISettings";
import { AdvancedSettings } from "./AdvancedSettings";
import { NotificationSettings } from "./NotificationSettings";
import { APIKeyManagement } from "../api/APIKeyManagement";
import { Button } from "@/components/ui/button";

export interface ChatSettingsTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  settings?: any;
  handleSettingChange?: (section: string, setting: string, value: any) => void;
  handleClearHistory?: () => void;
  handleSave?: () => void;
}

export const ChatSettingsTabs: React.FC<ChatSettingsTabsProps> = ({
  activeTab = "general",
  setActiveTab = () => {},
  settings = {},
  handleSettingChange = () => {},
  handleClearHistory = () => {},
  handleSave = () => {}
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  
  const handleTabChange = (value: string) => {
    setLocalActiveTab(value);
    setActiveTab(value);
  };

  return (
    <Tabs value={localActiveTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-1">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="api_keys" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Keys
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Privacy
        </TabsTrigger>
        <TabsTrigger value="ui" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          UI
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Advanced
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="api_keys" className="space-y-4 pt-4">
        <APIKeyManagement />
      </TabsContent>

      <TabsContent value="general" className="space-y-4 pt-4">
        <GeneralSettings 
          settings={settings} 
          handleSettingChange={handleSettingChange} 
        />
      </TabsContent>

      <TabsContent value="privacy" className="space-y-4 pt-4">
        <PrivacySettings 
          settings={settings} 
          handleSettingChange={handleSettingChange} 
          handleClearHistory={handleClearHistory}
        />
      </TabsContent>

      <TabsContent value="ui" className="space-y-4 pt-4">
        <UISettings 
          settings={settings} 
          handleSettingChange={handleSettingChange} 
        />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 pt-4">
        <AdvancedSettings 
          settings={settings} 
          handleSettingChange={handleSettingChange} 
        />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4 pt-4">
        <NotificationSettings 
          settings={settings} 
          handleSettingChange={handleSettingChange} 
        />
      </TabsContent>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave}
          className="admin-primary-button group"
        >
          <Save className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Save Settings
        </Button>
      </div>
    </Tabs>
  );
};

// Export ChatSettings for backward compatibility
export const ChatSettings = ChatSettingsTabs;
