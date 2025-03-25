import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsContainer } from "../layout/SettingsContainer";

interface GeneralSettingsProps {
  preferences: {
    username: string;
    language: string;
    timezone: string;
  };
  onPreferenceChange: (key: string, value: string) => void;
}

export function GeneralSettingsSection({ preferences, onPreferenceChange }: GeneralSettingsProps) {
  return (
    <SettingsContainer
      title="General Settings"
      description="Configure your general application preferences."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={preferences.username}
            onChange={(e) => onPreferenceChange('username', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={preferences.language}
            onChange={(e) => onPreferenceChange('language', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={preferences.timezone}
            onChange={(e) => onPreferenceChange('timezone', e.target.value)}
          />
        </div>
      </div>
    </SettingsContainer>
  );
}