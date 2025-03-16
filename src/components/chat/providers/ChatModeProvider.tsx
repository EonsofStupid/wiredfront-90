
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

interface ChatModeContextType {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
}

export function ChatModeProvider({ children, isEditorPage = false }: ChatModeProviderProps) {
  const { currentMode, setCurrentMode } = useChatStore();
  const [mode, setModeState] = useState<ChatMode>(currentMode);

  useEffect(() => {
    // When the store's mode changes, update our local state
    setModeState(currentMode);
  }, [currentMode]);

  // When local state changes, update the store
  const setMode = (newMode: ChatMode) => {
    logger.info(`Changing chat mode from ${mode} to ${newMode}`);
    setModeState(newMode);
    setCurrentMode(newMode);
  };

  return (
    <ChatModeContext.Provider value={{ mode, setMode, isEditorPage }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = (): ChatModeContextType => {
  const context = useContext(ChatModeContext);
  if (context === undefined) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
