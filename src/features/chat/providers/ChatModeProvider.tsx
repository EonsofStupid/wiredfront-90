import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChatMode } from '../types';

interface ChatModeContextType {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorMode: boolean;
  isProjectMode: boolean;
  isChatMode: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  const [mode, setMode] = useState<ChatMode>('chat');

  useEffect(() => {
    // Set mode based on page context
    if (isEditorPage) {
      setMode('editor' as ChatMode);
    } else {
      setMode('chat' as ChatMode);
    }
  }, [isEditorPage]);

  const value = {
    mode,
    setMode,
    isEditorMode: mode === ('editor' as ChatMode),
    isProjectMode: mode === ('project' as ChatMode),
    isChatMode: mode === ('chat' as ChatMode)
  };

  return (
    <ChatModeContext.Provider value={value}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = () => {
  const context = useContext(ChatModeContext);
  if (context === undefined) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
