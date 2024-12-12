import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ThemeMode } from "@/types/settings";

export function GeneralSettings() {
  const { preferences, updatePreferences } = useSettings();

  const handleThemeChange = (theme: ThemeMode) => {
    updatePreferences({ theme });
  };

  const handleLanguageChange = (language: string) => {
    updatePreferences({ language });
  };

  return (
    <div className="settings-general">
      <h2 className="settings-general__title text-lg font-semibold mb-4">General Settings</h2>
      <div className="settings-general__form grid gap-4">
        <div className="settings-general__form-group grid gap-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={preferences.theme}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="settings-general__form-group grid gap-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}