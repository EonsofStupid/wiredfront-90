
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Toaster } from "sonner";
import { useLocation } from 'react-router-dom';
import { useChatUIStore } from '../stores/uiStore';
import { useMessageStore } from '../hooks/useMessageStore';
import { ChatMode } from '../types';

interface ChatContextType {
  isEditorPage: boolean;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { toggleChat, isOpen } = useChatUIStore();
  const { clearMessages } = useMessageStore();
  const [mode, setMode] = useState<ChatMode>(isEditorPage ? 'editor' : 'standard');

  // Reset mode when switching pages
  useEffect(() => {
    setMode(isEditorPage ? 'editor' : 'standard');
  }, [isEditorPage]);

  // Close chat when navigating away from editor page if open
  useEffect(() => {
    if (!isEditorPage && isOpen) {
      // Optional: Add this if you want chat to close when leaving editor page
      // toggleChat();
    }
  }, [isEditorPage, isOpen, toggleChat]);

  return (
    <ChatContext.Provider value={{ isEditorPage, mode, setMode }}>
      {children}
      <Toaster />
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
