
import React, { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';
import { useThemeInit } from '@/hooks/useThemeInit';
import { logger } from '@/services/chat/LoggingService';

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { refreshSessions } = useSessionStore();
  const { initialized, error } = useThemeInit();

  // Initialize sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await refreshSessions();
      } catch (error) {
        logger.error('Error initializing sessions', { error });
      }
    };

    loadSessions();
  }, [refreshSessions]);

  // Log any theme initialization errors
  useEffect(() => {
    if (error) {
      logger.error('Error initializing theme', { error });
    }
  }, [error]);

  return <>{children}</>;
};
