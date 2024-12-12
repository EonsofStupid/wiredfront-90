import { createContext, useContext, useCallback } from "react";
import { useSettingsStore } from "@/stores";
import type { SettingsContextValue, UserPreferences } from "@/types/settings";

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  defaultView: 'dashboard',
  refreshInterval: 30000,
  notifications: true,
  timezone: 'UTC'
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences: updateStore } = useSettingsStore();

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    updateStore(updates);
  }, [updateStore]);

  const resetPreferences = useCallback(() => {
    updateStore(defaultPreferences);
  }, [updateStore]);

  const contextValue: SettingsContextValue = {
    preferences: {
      theme: preferences.theme || defaultPreferences.theme,
      language: preferences.language || defaultPreferences.language,
      defaultView: preferences.defaultView || defaultPreferences.defaultView,
      refreshInterval: preferences.refreshInterval || defaultPreferences.refreshInterval,
      notifications: preferences.notifications ?? defaultPreferences.notifications,
      timezone: preferences.timezone || defaultPreferences.timezone
    },
    updatePreferences,
    resetPreferences,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}