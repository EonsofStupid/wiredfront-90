
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ChatMode = 'default' | 'chat-only';

interface ChatModeContextType {
  mode: ChatMode;
  toggleMode: () => void;
  setMode: (mode: ChatMode) => void;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

export function ChatModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ChatMode>('default');

  const toggleMode = () => {
    setMode(prev => prev === 'default' ? 'chat-only' : 'default');
  };

  return (
    <ChatModeContext.Provider value={{ mode, toggleMode, setMode }}>
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
