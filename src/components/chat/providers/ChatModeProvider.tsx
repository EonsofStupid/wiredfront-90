
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Simplified mode types - just 'standard' and 'editor'
export type ChatMode = 'standard' | 'editor';

interface ChatModeContextType {
  mode: ChatMode;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  // Set mode based on page context
  const mode: ChatMode = isEditorPage ? 'editor' : 'standard';

  return (
    <ChatModeContext.Provider value={{ mode, isEditorPage }}>
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
