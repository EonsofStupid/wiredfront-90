
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatUIStore } from './store/useChatUIStore';
import { useChatProvidersStore } from './store/useChatProvidersStore';

interface ChatContextType {
  isEditorPage: boolean;
  isProviderConfigured: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { toggleChat, isOpen, setKnowledgeSourceVisible } = useChatUIStore();
  const { isProviderConfigured, checkProviderStatus } = useChatProvidersStore();

  // Close knowledge source panel when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setKnowledgeSourceVisible(false);
      }
      
      // Toggle chat with Alt+C
      if (e.altKey && e.key === 'c') {
        toggleChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setKnowledgeSourceVisible, toggleChat]);

  // Check provider status on component mount
  useEffect(() => {
    checkProviderStatus();
  }, [checkProviderStatus]);

  return (
    <ChatContext.Provider value={{ isEditorPage, isProviderConfigured }}>
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
