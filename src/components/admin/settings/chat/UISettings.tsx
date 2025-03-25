
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UISettingsProps {
  settings: {
    darkMode: boolean;
    fontSize: string;
    messageAlignment: string;
    showTimestamps: boolean;
  };
  handleSettingChange: (section: string, setting: string, value: any) => void;
}

export const UISettings: React.FC<UISettingsProps> = ({ 
  settings, 
  handleSettingChange 
}) => {
  return (
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
  );
};

// Export as ChatFeatureSettings for backward compatibility
export const ChatFeatureSettings = UISettings;
