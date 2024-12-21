import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";
import { useCallback } from "react";

export function AccessibilitySettings() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  const handlePreferenceChange = useCallback((key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
  }, [updatePreferences]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Accessibility Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your accessibility preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={preferences.highContrast}
            onCheckedChange={(checked) => handlePreferenceChange('highContrast', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reduce-motion">Reduce Motion</Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            id="reduce-motion"
            checked={preferences.reduceMotion}
            onCheckedChange={(checked) => handlePreferenceChange('reduceMotion', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="large-text">Large Text</Label>
            <p className="text-sm text-muted-foreground">
              Increase text size for better readability
            </p>
          </div>
          <Switch
            id="large-text"
            checked={preferences.largeText}
            onCheckedChange={(checked) => handlePreferenceChange('largeText', checked)}
          />
        </div>
      </div>
    </div>
  );
}