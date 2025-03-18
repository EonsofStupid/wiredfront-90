
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Toaster } from "sonner";
import { ChatModeProvider } from './providers/ChatModeProvider';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from './messaging/MessageManager';
import { Spinner } from './components/Spinner';
import './styles/index.css'; // Import all chat styles

interface ChatContextType {
  isEditorPage: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { isOpen, initialize, setSessionLoading } = useChatStore();
  const { currentSessionId, refreshSessions } = useSessionManager();
  const messageStore = useMessageStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize CSS custom properties
  useEffect(() => {
    const initializeStyles = () => {
      // Ensure CSS variables are set with defaults if they aren't already
      const cssVars = {
        '--chat-bg': 'rgba(0, 0, 0, 0.3)',
        '--chat-message-user-bg': '#8B5CF6',
        '--chat-message-assistant-bg': '#374151',
        '--chat-width': '400px',
        '--chat-height': '500px'
      };
      
      Object.entries(cssVars).forEach(([property, defaultValue]) => {
        const currentValue = getComputedStyle(document.documentElement).getPropertyValue(property);
        if (!currentValue || currentValue === '') {
          document.documentElement.style.setProperty(property, defaultValue);
        }
      });
    };
    
    initializeStyles();
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsInitializing(true);
        
        initialize();
        logger.info('Chat settings initialized');
        
        if (isEditorPage || location.pathname === '/') {
          setSessionLoading(true);
          await refreshSessions();
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
    
    initializeChat();
  }, [initialize, isEditorPage, location.pathname, refreshSessions, setSessionLoading]);

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
