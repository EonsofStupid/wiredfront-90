
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from "sonner";
import { useSessionManager } from '../hooks/useSessionManager';
import { logger } from '../services/LoggingService';
import { useChatStore } from '../store/chatStore';
import { ChatModeProvider } from './ChatModeProvider';

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
  const { isOpen, initializeChatSettings, setSessionLoading } = useChatStore();
  const { currentSessionId, refreshSessions } = useSessionManager();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the chat system
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);

        // Initialize chat settings from the store
        initializeChatSettings();
        logger.info('Chat settings initialized');

        // If on editor or home page, load sessions
        if (isEditorPage || location.pathname === '/') {
          setSessionLoading(true);
          await refreshSessions();
          setSessionLoading(false);
        }

        setIsInitialized(true);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to initialize chat');
        setError(err);
        logger.error('Failed to initialize chat', { error });
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [initializeChatSettings, isEditorPage, location.pathname, refreshSessions, setSessionLoading]);

  // Log important state changes
  useEffect(() => {
    logger.info('Chat context updated', {
      isEditorPage,
      isOpen,
      currentSessionId,
      isInitialized
    });
  }, [isEditorPage, isOpen, currentSessionId, isInitialized]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Initializing chat system...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-destructive mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-destructive">Failed to initialize chat</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ChatContext.Provider value={{ isEditorPage, isInitialized, isInitializing }}>
        <ChatModeProvider isEditorPage={isEditorPage}>
          {children}
          <Toaster position="top-right" />
        </ChatModeProvider>
      </ChatContext.Provider>
    </ErrorBoundary>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
