
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';

type ChatModeContextType = {
  mode: 'standard' | 'editor' | 'image' | 'training';
  isEditorPage: boolean;
};

const ChatModeContext = createContext<ChatModeContextType>({
  mode: 'standard',
  isEditorPage: false
});

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  const { currentMode, setMode } = useChatStore();
  const [mode, setLocalMode] = useState<'standard' | 'editor' | 'image' | 'training'>('standard');
  
  // Initialize the mode based on current page and store state
  useEffect(() => {
    let newMode: 'standard' | 'editor' | 'image' | 'training' = 'standard';
    
    if (isEditorPage) {
      newMode = 'editor';
      if (currentMode !== 'dev' && currentMode !== 'editor') {
        // Sync store with UI if on editor page
        setMode('dev');
      }
    } else if (currentMode === 'dev' || currentMode === 'editor') {
      newMode = 'editor';
    } else if (currentMode === 'image') {
      newMode = 'image';
    } else if (currentMode === 'training') {
      newMode = 'training';
    }
    
    setLocalMode(newMode);
    logger.info('Chat mode context initialized', { mode: newMode, currentMode, isEditorPage });
  }, [currentMode, isEditorPage, setMode]);
  
  return (
    <ChatModeContext.Provider value={{ mode, isEditorPage }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = () => useContext(ChatModeContext);
