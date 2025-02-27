
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ChatMode = 'default' | 'chat-only';

interface ChatModeContextType {
  mode: ChatMode;
  toggleMode: () => void;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  const [mode, setMode] = useState<ChatMode>('default');

  // Set appropriate mode based on page context when component mounts or route changes
  useEffect(() => {
    if (isEditorPage) {
      setMode('default'); // Code generation mode is default in editor
    }
  }, [isEditorPage]);

  const toggleMode = () => {
    setMode(prev => prev === 'default' ? 'chat-only' : 'default');
  };

  return (
    <ChatModeContext.Provider value={{ mode, toggleMode, setMode, isEditorPage }}>
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
