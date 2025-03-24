
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatMode } from '@/integrations/supabase/types/enums';

interface ChatModeContextType {
  mode: ChatMode;
  isEditorPage: boolean;
  setMode: (mode: ChatMode) => void;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean; // Make this optional with a default value
}

export function ChatModeProvider({ children, isEditorPage = false }: ChatModeProviderProps) {
  // Default mode based on page context
  const defaultMode: ChatMode = isEditorPage ? 'dev' : 'chat';
  const [mode, setMode] = useState<ChatMode>(defaultMode);

  // Reset mode when switching pages
  useEffect(() => {
    setMode(isEditorPage ? 'dev' : 'chat');
  }, [isEditorPage]);

  return (
    <ChatModeContext.Provider value={{ mode, isEditorPage, setMode }}>
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
