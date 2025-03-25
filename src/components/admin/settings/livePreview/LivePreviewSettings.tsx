
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/stores/settings";
import { SettingsContainer } from "../layout/SettingsContainer";

export function LivePreviewSettings() {
  const preferences = useSettingsStore((state) => state.preferences);
  const updatePreferences = useSettingsStore((state) => state.updatePreferences);
  const [saving, setSaving] = useState(false);

  const handleToggleLivePreview = (enabled: boolean) => {
    setSaving(true);
    updatePreferences({
      livePreview: {
        ...preferences.livePreview,
        enabled
      }
    });
    setTimeout(() => setSaving(false), 500);
  };

  const handleAutoStartChange = (autoStart: boolean) => {
    updatePreferences({
      livePreview: {
        ...preferences.livePreview,
        autoStart
      }
    });
  };

  const handleLogLevelChange = (logLevel: string) => {
    updatePreferences({
      livePreview: {
        ...preferences.livePreview,
        logLevel: logLevel as 'debug' | 'info' | 'warn' | 'error'
      }
    });
  };

  return (
    <SettingsContainer
      title="Live Preview Settings"
      description="Configure how the live preview feature works"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-live-preview">Enable Live Preview</Label>
            <p className="text-sm text-muted-foreground">
              Show real-time preview of code changes
            </p>
          </div>
          <Switch
            id="enable-live-preview"
            checked={preferences.livePreview?.enabled ?? false}
            onCheckedChange={handleToggleLivePreview}
            disabled={saving}
          />
        </div>

        {preferences.livePreview?.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-start">Auto Start Preview</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start preview when code changes
                </p>
              </div>
              <Switch
                id="auto-start"
                checked={preferences.livePreview?.autoStart ?? false}
                onCheckedChange={handleAutoStartChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="log-level">Log Level</Label>
              <Select 
                value={preferences.livePreview?.logLevel || 'info'} 
                onValueChange={handleLogLevelChange}
              >
                <SelectTrigger id="log-level" className="w-full">
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    </SettingsContainer>
  );
}
