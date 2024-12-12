import { createContext, useContext, useCallback } from "react";
import { useSettingsStore } from "@/stores";
import type { SettingsContextValue, UserPreferences, ThemeMode } from "@/types/settings";

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'system' as ThemeMode,
  language: 'en',
  defaultView: 'dashboard',
  refreshInterval: 30000,
  notifications: true,
  timezone: 'UTC'
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Move store access inside the component
  const storePreferences = useSettingsStore((state) => state.preferences);
  const updateStore = useSettingsStore((state) => state.updatePreferences);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    updateStore(updates);
  }, [updateStore]);

  const resetPreferences = useCallback(() => {
    updateStore(defaultPreferences);
  }, [updateStore]);

  const preferences = {
    ...defaultPreferences,
    ...storePreferences,
  };

  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
  };

  return (
    <SettingsContext.Provider value={value}>
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