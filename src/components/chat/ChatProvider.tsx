
import React, { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';
import { useThemeInit } from '@/hooks/useThemeInit';
import { logger } from '@/services/chat/LoggingService';

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { fetchSessions } = useSessionStore(); // Use fetchSessions directly
  const { initialized, error } = useThemeInit();

  // Initialize sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await fetchSessions(); // Use fetchSessions instead of refreshSessions
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
    }
  }, [error]);

  return <>{children}</>;
};
