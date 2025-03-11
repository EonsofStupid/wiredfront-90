import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
import { useMessageStore } from "@/components/chat/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SettingsContainer } from "./layout/SettingsContainer";
import { toast } from "sonner";
import { APIKeyManagement } from "./api/APIKeyManagement";

export function ChatSettings() {
  const { clearMessages } = useMessageStore();
  const { currentSessionId, refreshSessions } = useSessionManager();
  const [activeTab, setActiveTab] = useState("general");
  
  const [settings, setSettings] = useState({
    // General settings
    defaultModel: "gpt-4",
    systemPrompt: "You are a helpful AI assistant.",
    temperature: 0.7,
    maxTokens: 2048,
    streamingEnabled: true,
    
    // Privacy settings
    saveHistory: true,
    anonymizeData: false,
    dataRetentionDays: 30,
    allowAnalytics: true,
    
    // UI settings
    darkMode: true,
    fontSize: "medium",
    messageAlignment: "left",
    showTimestamps: true,
    
    // Advanced settings
    debugMode: false,
    experimentalFeatures: false,
    apiTimeout: 60,
    retryAttempts: 3,
    
    // Notification settings
    soundEnabled: true,
    desktopNotifications: false,
    mentionAlerts: true,
    emailDigest: false
  });
  
  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleSave = () => {
    // Save settings logic would go here
    toast.success("Chat settings saved successfully");
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearMessages();
      refreshSessions();
      toast.success("Chat history cleared successfully");
    }
  };

  return (
    <SettingsContainer
      title="Chat System Settings"
      description="Configure the behavior and features of the chat system."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>Configure the AI model behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Default Model</Label>
                <Select 
                  value={settings.defaultModel} 
                  onValueChange={(value) => handleSettingChange('general', 'defaultModel', value)}
                >
                  <SelectTrigger id="defaultModel">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Input
                  id="systemPrompt"
                  value={settings.systemPrompt}
                  onChange={(e) => handleSettingChange('general', 'systemPrompt', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This prompt sets the behavior of the AI assistant
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={([value]) => handleSettingChange('general', 'temperature', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values make responses more deterministic, higher values more creative
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                </div>
                <Slider
                  id="maxTokens"
                  min={256}
                  max={4096}
                  step={256}
                  value={[settings.maxTokens]}
                  onValueChange={([value]) => handleSettingChange('general', 'maxTokens', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="streamingEnabled">Streaming Responses</Label>
                  <p className="text-xs text-muted-foreground">
                    Show responses as they are generated
                  </p>
                </div>
                <Switch
                  id="streamingEnabled"
                  checked={settings.streamingEnabled}
                  onCheckedChange={(checked) => handleSettingChange('general', 'streamingEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="saveHistory">Save Chat History</Label>
                  <p className="text-xs text-muted-foreground">
                    Store your conversations for future reference
                  </p>
                </div>
                <Switch
                  id="saveHistory"
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'saveHistory', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymizeData">Anonymize Data</Label>
                  <p className="text-xs text-muted-foreground">
                    Remove personal identifiers from stored conversations
                  </p>
                </div>
                <Switch
                  id="anonymizeData"
                  checked={settings.anonymizeData}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'anonymizeData', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="dataRetentionDays">Data Retention (days): {settings.dataRetentionDays}</Label>
                </div>
                <Slider
                  id="dataRetentionDays"
                  min={7}
                  max={365}
                  step={1}
                  value={[settings.dataRetentionDays]}
                  onValueChange={([value]) => handleSettingChange('privacy', 'dataRetentionDays', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowAnalytics">Allow Analytics</Label>
                  <p className="text-xs text-muted-foreground">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  id="allowAnalytics"
                  checked={settings.allowAnalytics}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'allowAnalytics', checked)}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleClearHistory}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Chat History
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This action cannot be undone
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Interface Settings</CardTitle>
              <CardDescription>Customize the chat appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme for the chat interface
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('ui', 'darkMode', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select 
                  value={settings.fontSize} 
                  onValueChange={(value) => handleSettingChange('ui', 'fontSize', value)}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="messageAlignment">Message Alignment</Label>
                <Select 
                  value={settings.messageAlignment} 
                  onValueChange={(value) => handleSettingChange('ui', 'messageAlignment', value)}
                >
                  <SelectTrigger id="messageAlignment">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="alternate">Alternate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showTimestamps">Show Timestamps</Label>
                  <p className="text-xs text-muted-foreground">
                    Display time for each message
                  </p>
                </div>
                <Switch
                  id="showTimestamps"
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) => handleSettingChange('ui', 'showTimestamps', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure technical aspects of the chat system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debugMode">Debug Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Show technical information for troubleshooting
                  </p>
                </div>
                <Switch
                  id="debugMode"
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => handleSettingChange('advanced', 'debugMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="experimentalFeatures">
                    Experimental Features
                    <Badge className="ml-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/30">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Beta
                    </Badge>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable features still in development
                  </p>
                </div>
                <Switch
                  id="experimentalFeatures"
                  checked={settings.experimentalFeatures}
                  onCheckedChange={(checked) => handleSettingChange('advanced', 'experimentalFeatures', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="apiTimeout">API Timeout (seconds): {settings.apiTimeout}</Label>
                </div>
                <Slider
                  id="apiTimeout"
                  min={10}
                  max={300}
                  step={5}
                  value={[settings.apiTimeout]}
                  onValueChange={([value]) => handleSettingChange('advanced', 'apiTimeout', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="retryAttempts">Retry Attempts: {settings.retryAttempts}</Label>
                </div>
                <Slider
                  id="retryAttempts"
                  min={0}
                  max={5}
                  step={1}
                  value={[settings.retryAttempts]}
                  onValueChange={([value]) => handleSettingChange('advanced', 'retryAttempts', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="soundEnabled">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for new messages and events
                  </p>
                </div>
                <Switch
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'soundEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Show browser notifications when you receive messages
                  </p>
                </div>
                <Switch
                  id="desktopNotifications"
                  checked={settings.desktopNotifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'desktopNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mentionAlerts">Mention Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when you are mentioned in a message
                  </p>
                </div>
                <Switch
                  id="mentionAlerts"
                  checked={settings.mentionAlerts}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'mentionAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailDigest">Email Digest</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive a summary of activity by email
                  </p>
                </div>
                <Switch
                  id="emailDigest"
                  checked={settings.emailDigest}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'emailDigest', checked)}
                />
              </div>
            </CardContent>
          </Card>
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
    </SettingsContainer>
  );
}
