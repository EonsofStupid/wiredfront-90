
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatMode } from '@/types/chat/enums';
import { ModeConfig, ModeContextType, CHAT_MODES } from './types';

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
  defaultMode?: ChatMode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ 
  children, 
  defaultMode = ChatMode.Chat
}) => {
  const [currentMode, setCurrentMode] = useState<ChatMode>(defaultMode);
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  
  // Auto-switch mode based on route
  useEffect(() => {
    if (isEditorPage && currentMode !== ChatMode.Dev) {
      setCurrentMode(ChatMode.Dev);
    } else if (location.pathname === '/gallery' && currentMode !== ChatMode.Image) {
      setCurrentMode(ChatMode.Image);
    } else if (location.pathname === '/training' && currentMode !== ChatMode.Training) {
      setCurrentMode(ChatMode.Training);
    } else if (location.pathname === '/' && 
               currentMode !== ChatMode.Chat && 
               currentMode !== ChatMode.Dev && 
               currentMode !== ChatMode.Image && 
               currentMode !== ChatMode.Training) {
      setCurrentMode(ChatMode.Chat);
    }
  }, [isEditorPage, currentMode, location.pathname]);
  
  // Convert configs from record to array
  const availableModes = Object.values(CHAT_MODES) as ModeConfig[];
  
  return (
    <ModeContext.Provider value={{ 
      currentMode, 
      setMode: setCurrentMode, 
      isEditorPage,
      availableModes
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
