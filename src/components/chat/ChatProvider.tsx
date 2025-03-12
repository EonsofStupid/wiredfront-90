
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { logger } from '@/services/chat/LoggingService';

interface ChatContextType {
  isEditorPage: boolean;
  isInitialized: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { isOpen, initializeChatSettings } = useChatStore();
  const { currentSessionId } = useSessionManager();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize chat settings when component mounts
  useEffect(() => {
    try {
      initializeChatSettings();
      logger.info('Chat settings initialized');
      setIsInitialized(true);
    } catch (error) {
      logger.error('Failed to initialize chat settings', { error });
      console.error('Failed to initialize chat settings:', error);
    }
  }, [initializeChatSettings]);

  // Log page navigation for chat context
  useEffect(() => {
    logger.info('Chat context updated', { 
      isEditorPage, 
      isOpen, 
      currentSessionId 
    });
  }, [isEditorPage, isOpen, currentSessionId]);

  return (
    <ChatContext.Provider value={{ isEditorPage, isInitialized }}>
      <ChatModeProvider isEditorPage={isEditorPage}>
        {children}
        <Toaster position="top-right" />
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
