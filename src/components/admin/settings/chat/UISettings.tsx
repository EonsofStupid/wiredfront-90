
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Code, MessageSquare } from "lucide-react";

interface UISettingsProps {
  settings: {
    darkMode: boolean;
    fontSize: string;
    messageAlignment: string;
    showTimestamps: boolean;
    iconStyle: string;
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
        
        <div className="space-y-3">
          <Label>Chat Icon Style</Label>
          <RadioGroup 
            value={settings.iconStyle || 'default'} 
            onValueChange={(value) => handleSettingChange('ui', 'iconStyle', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
              <RadioGroupItem value="default" id="icon-default" />
              <Label htmlFor="icon-default" className="flex items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center mr-2">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>Default</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
              <RadioGroupItem value="wfpulse" id="icon-wfpulse" />
              <Label htmlFor="icon-wfpulse" className="flex items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                  <MessageSquare className="h-5 w-5 text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
                </div>
                <span>WFPULSE (Neon)</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
              <RadioGroupItem value="retro" id="icon-retro" />
              <Label htmlFor="icon-retro" className="flex items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mr-2 shadow-[3px_3px_0px_rgba(0,0,0,1)]" style={{ imageRendering: 'pixelated' }}>
                  <MessageSquare className="h-5 w-5 text-black" />
                </div>
                <span>Retro (Pixelated)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
