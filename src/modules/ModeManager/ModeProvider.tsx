
import React, { createContext, useContext, ReactNode } from 'react';
import { useModeManager } from './useModeManager';
import { ModeContextType } from './types';
import { ChatMode } from '@/types/chat/enums';

// Create context for mode management
const ModeContext = createContext<ModeContextType>({
  currentMode: ChatMode.Chat,
  setMode: async () => false,
  availableModes: [],
  isModeSwitchEnabled: false,
});

/**
 * Hook to access the mode context
 */
export const useMode = () => useContext(ModeContext);

/**
 * Provider component for mode management
 */
export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const modeManager = useModeManager();
  
  return (
    <ModeContext.Provider value={modeManager}>
      {children}
    </ModeContext.Provider>
  );
};
