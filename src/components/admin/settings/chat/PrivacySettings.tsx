
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PrivacySettingsProps {
  settings: {
    saveHistory: boolean;
    anonymizeData: boolean;
    dataRetentionDays: number;
    allowAnalytics: boolean;
  };
  handleSettingChange: (section: string, setting: string, value: any) => void;
  handleClearHistory: () => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ 
  settings, 
  handleSettingChange,
  handleClearHistory
}) => {
  return (
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
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Chat History
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This action cannot be undone
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
