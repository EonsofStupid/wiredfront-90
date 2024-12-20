import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settings";

export function AccessibilitySettings() {
  const { preferences, updatePreferences } = useSettingsStore((state) => ({
    preferences: state.preferences,
    updatePreferences: state.updatePreferences,
  }));

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
            onCheckedChange={(checked) =>
              updatePreferences({ highContrast: checked })
            }
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
            onCheckedChange={(checked) =>
              updatePreferences({ reduceMotion: checked })
            }
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
            onCheckedChange={(checked) =>
              updatePreferences({ largeText: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}