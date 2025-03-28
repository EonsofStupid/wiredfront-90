
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMode } from '@/types/chat/enums';
import { TaskType } from '@/types/chat/communication';
import { useModeManager } from './useModeManager';
import { ModeContextType } from './types';
import { logger } from '@/services/chat/LoggingService';

// Create context with default values
const ModeContext = createContext<ModeContextType | undefined>(undefined);

/**
 * Hook to use the mode context
 */
export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the mode context
 */
export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  // Use the mode manager hook
  const modeManager = useModeManager();
  
  // Log when provider is mounted
  React.useEffect(() => {
    logger.info('ModeProvider initialized', { 
      currentMode: modeManager.currentMode,
      currentTaskType: modeManager.currentTaskType,
      availableTaskTypes: modeManager.availableTaskTypes
    });
  }, []);
  
  return (
    <ModeContext.Provider value={modeManager}>
      {children}
    </ModeContext.Provider>
  );
};
