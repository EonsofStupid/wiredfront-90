
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface GeneralSettingsProps {
  settings: {
    defaultModel: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    streamingEnabled: boolean;
  };
  handleSettingChange: (section: string, setting: string, value: any) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  settings, 
  handleSettingChange 
}) => {
  return (
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
  );
};
