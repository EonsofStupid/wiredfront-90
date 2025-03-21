export interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isEnabled: boolean;
}

export interface SettingsPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface SettingsState {
  // UI State
  activeSection: string | null;
  isOpen: boolean;

  // Settings State
  sections: Record<string, SettingsSection>;
  preferences: SettingsPreferences;

  // Actions
  setActiveSection: (sectionId: string) => void;
  toggleSettings: () => void;
  updatePreferences: (prefs: Partial<SettingsPreferences>) => void;
  toggleSection: (sectionId: string) => void;
  resetToDefaults: () => void;
}
