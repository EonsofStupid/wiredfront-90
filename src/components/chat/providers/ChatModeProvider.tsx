
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type ChatModeType = 'standard' | 'editor' | 'image' | 'chat-only';

interface ChatModeContextType {
  mode: ChatModeType;
  setMode: (mode: ChatModeType) => void;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
}

export function ChatModeProvider({ children, isEditorPage = false }: ChatModeProviderProps) {
  const [mode, setMode] = useState<ChatModeType>(isEditorPage ? 'editor' : 'standard');
  const location = useLocation();

  // Automatically set mode based on route
  useEffect(() => {
    if (location.pathname.includes('/editor')) {
      setMode('editor');
    } else if (location.pathname.includes('/gallery')) {
      setMode('image');
    } else if (location.pathname === '/chat') {
      setMode('chat-only');
    } else {
      setMode('standard');
    }
  }, [location.pathname]);

  return (
    <ChatModeContext.Provider value={{ mode, setMode }}>
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
