
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import useChatBridge from '../ChatBridge/useChatBridge';
import { ChatMode } from '@/types/chat/enums';
import { CHAT_MODES, ChatMode as ModeType } from './types';

interface ModeContextValue {
  isEditorPage: boolean;
  currentMode: ModeType;
  setMode: (mode: ModeType) => void;
  isDevMode: boolean;
  isImageMode: boolean;
  isTrainingMode: boolean;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const location = useLocation();
  const chatBridge = useChatBridge();
  const isEditorPage = location.pathname.includes('/editor');
  
  // Initialize with standard mode
  const [currentMode, setCurrentMode] = useState<ModeType>('standard');

  // Set the initial mode based on the current path
  useEffect(() => {
    const newMode = isEditorPage ? 'developer' : 'standard';
    setCurrentMode(newMode);
    
    // Also update the ChatBridge
    if (isEditorPage) {
      chatBridge.setMode(ChatMode.Dev);
    } else {
      chatBridge.setMode(ChatMode.Chat);
    }
  }, [isEditorPage, chatBridge]);

  // Handle mode changes
  const setMode = (mode: ModeType) => {
    setCurrentMode(mode);
    
    // Map to ChatMode enum
    let chatMode = ChatMode.Chat;
    if (mode === 'developer') chatMode = ChatMode.Dev;
    else if (mode === 'image') chatMode = ChatMode.Image;
    else if (mode === 'training') chatMode = ChatMode.Training;
    
    // Update the ChatBridge
    chatBridge.setMode(chatMode);
  };

  const value = {
    isEditorPage,
    currentMode,
    setMode,
    isDevMode: currentMode === 'developer',
    isImageMode: currentMode === 'image',
    isTrainingMode: currentMode === 'training'
  };

  return (
    <ModeContext.Provider value={value}>
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
