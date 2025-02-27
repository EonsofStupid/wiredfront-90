
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Extended mode types to include 'chat-only'
export type ChatMode = 'standard' | 'editor' | 'chat-only';

interface ChatModeContextType {
  mode: ChatMode;
  isEditorPage: boolean;
  setMode?: (mode: ChatMode) => void;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  // Default mode based on page context
  const defaultMode: ChatMode = isEditorPage ? 'editor' : 'standard';
  const [mode, setMode] = useState<ChatMode>(defaultMode);

  // Reset mode when switching pages
  useEffect(() => {
    setMode(isEditorPage ? 'editor' : 'standard');
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
