
import React, { useEffect } from 'react';
import { useChatSessionStore } from '@/components/chat/store/chat-sessions/store';
import { logger } from '@/services/chat/LoggingService';

interface ChatSessionProviderProps {
  children: React.ReactNode;
}

export const ChatSessionProvider: React.FC<ChatSessionProviderProps> = ({ children }) => {
  const { fetchSessions } = useChatSessionStore();

  // Initialize sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await fetchSessions(); // This will also set the user property in the session store
        logger.info('Chat sessions initialized in ChatSessionProvider');
      } catch (error) {
        logger.error('Error initializing chat sessions', { error });
      }
    };

    loadSessions();
  }, [fetchSessions]);

  return <>{children}</>;
};

export default ChatSessionProvider;
