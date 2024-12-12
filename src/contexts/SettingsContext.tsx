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
  const { preferences: storePreferences, updatePreferences: updateStore } = useSettingsStore();

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    updateStore(updates);
  }, [updateStore]);

  const resetPreferences = useCallback(() => {
    updateStore(defaultPreferences);
  }, [updateStore]);

  const preferences = {
    ...defaultPreferences,
    ...storePreferences,
  } as UserPreferences;

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
      }}
    >
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