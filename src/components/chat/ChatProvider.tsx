
import React, { useEffect } from 'react';
import { useSessionStore } from '@/components/chat/store/chat-sessions';
import { useThemeInit } from '@/hooks/useThemeInit';
import { logger } from '@/services/chat/LoggingService';

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { fetchSessions } = useSessionStore();
  const { initialized, error } = useThemeInit();

  // Initialize sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await fetchSessions(); // This will also set the user property in the session store
        logger.info('Sessions initialized in ChatProvider');
      } catch (error) {
        logger.error('Error initializing sessions', { error });
      }
    };

    loadSessions();
  }, [fetchSessions]);

  // Log any theme initialization errors
  useEffect(() => {
    if (error) {
      logger.error('Error initializing theme', { error });
    } else if (initialized) {
      logger.info('Theme initialized successfully in ChatProvider');
    }
  }, [error, initialized]);

  return <>{children}</>;
};
