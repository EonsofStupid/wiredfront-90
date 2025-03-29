
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';
import { UiChatMode } from '../store/types/chat-store-types';

type ChatModeContextType = {
  mode: UiChatMode;
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
  const [mode, setLocalMode] = useState<UiChatMode>('standard');
  
  // Initialize the mode based on current page and store state
  useEffect(() => {
    let newMode: UiChatMode = 'standard';
    
    if (isEditorPage) {
      newMode = 'editor';
      if (currentMode !== ChatMode.Dev && currentMode !== ChatMode.Editor) {
        // Sync store with UI if on editor page
        setMode(ChatMode.Dev);
      }
    } else {
      // Convert database mode to UI mode using EnumUtils
      const chatModeEnum = typeof currentMode === 'string' 
        ? EnumUtils.stringToChatMode(currentMode) 
        : currentMode;
        
      newMode = EnumUtils.chatModeToUiMode(chatModeEnum) as UiChatMode || 'standard';
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
