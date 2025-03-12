
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from './messaging/MessageManager';
import { Spinner } from './components/Spinner';

interface ChatContextType {
  isEditorPage: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { isOpen, initializeChatSettings, setSessionLoading } = useChatStore();
  const { currentSessionId, fetchSessions } = useSessionManager();
  const messageStore = useMessageStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize chat settings and fetch initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize chat settings
        initializeChatSettings();
        logger.info('Chat settings initialized');
        
        // Fetch sessions if we're on a page that needs them
        if (isEditorPage || location.pathname === '/') {
          setSessionLoading(true);
          await fetchSessions();
          setSessionLoading(false);
        }
        
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize chat', { error });
        console.error('Failed to initialize chat:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, [initializeChatSettings, isEditorPage, location.pathname, fetchSessions, setSessionLoading]);

  // Log page navigation for chat context
  useEffect(() => {
    logger.info('Chat context updated', { 
      isEditorPage, 
      isOpen, 
      currentSessionId,
      isInitialized
    });
  }, [isEditorPage, isOpen, currentSessionId, isInitialized]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Initializing chat system...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatContext.Provider value={{ isEditorPage, isInitialized, isInitializing }}>
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
