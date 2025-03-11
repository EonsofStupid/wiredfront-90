
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface AdvancedSettingsProps {
  settings: {
    debugMode: boolean;
    experimentalFeatures: boolean;
    apiTimeout: number;
    retryAttempts: number;
  };
  handleSettingChange: (section: string, setting: string, value: any) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ 
  settings, 
  handleSettingChange 
}) => {
  return (
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
  );
};
