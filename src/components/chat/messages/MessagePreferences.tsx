import React from "react";

interface MessagePreferences {
  showTimestamps: boolean;
  fontSize: "small" | "medium" | "large";
}

interface MessagePreferencesContextType {
  preferences: MessagePreferences;
  setPreferences: (preferences: Partial<MessagePreferences>) => void;
}

const defaultPreferences: MessagePreferences = {
  showTimestamps: true,
  fontSize: "medium",
};

const MessagePreferencesContext =
  React.createContext<MessagePreferencesContextType | null>(null);

export const MessagePreferencesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [preferences, setPreferences] =
    React.useState<MessagePreferences>(defaultPreferences);

  const updatePreferences = React.useCallback(
    (newPreferences: Partial<MessagePreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    },
    []
  );

  return (
    <MessagePreferencesContext.Provider
      value={{ preferences, setPreferences: updatePreferences }}
    >
      {children}
    </MessagePreferencesContext.Provider>
  );
};

export const useMessagePreferences = () => {
  const context = React.useContext(MessagePreferencesContext);
  if (!context) {
    throw new Error(
      "useMessagePreferences must be used within a MessagePreferencesProvider"
    );
  }
  return context;
};
