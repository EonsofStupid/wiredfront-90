
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from '../providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';

interface ChatContextType {
  isEditorPage: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { toggleChat, isOpen } = useChatStore();

  // Close chat when navigating away from editor page if open
  useEffect(() => {
    if (!isEditorPage && isOpen) {
      // Optional: Add this if you want chat to close when leaving editor page
      // toggleChat();
    }
  }, [isEditorPage, isOpen, toggleChat]);

  return (
    <ChatContext.Provider value={{ isEditorPage }}>
      <ChatModeProvider isEditorPage={isEditorPage}>
        {children}
        <Toaster />
      </ChatModeProvider>
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
