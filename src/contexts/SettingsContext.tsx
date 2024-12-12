import { createContext, useContext, useCallback } from "react";
import { useSettingsStore } from "@/stores";
import type { SettingsContextValue, UserPreferences } from "@/types/settings";

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { preferences, updatePreferences: updateStore } = useSettingsStore();

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    updateStore(updates);
  }, [updateStore]);

  const resetPreferences = useCallback(() => {
    updateStore({
      theme: 'system',
      language: 'en',
      defaultView: 'dashboard',
      refreshInterval: 30000,
      notifications: true,
      timezone: 'UTC'
    });
  }, [updateStore]);

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