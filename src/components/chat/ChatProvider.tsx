
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';

interface ChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
  isEditorPage: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';

  // Close chat when navigating away from editor page if open
  useEffect(() => {
    if (!isEditorPage && isOpen) {
      // Optional: Add this if you want chat to close when leaving editor page
      // setIsOpen(false);
    }
  }, [isEditorPage, isOpen]);

  const toggleChat = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, isEditorPage }}>
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
