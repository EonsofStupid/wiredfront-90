
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMode } from '@/types/chat/enums';
import { useChatStore } from '../store/chatStore';
import { chatModeForDatabase } from '../types/enums-mapper';

interface SessionMetadata {
  mode?: ChatMode;
  providerId?: string;
  [key: string]: any;
}

interface CreateSessionParams {
  title?: string;
  metadata?: SessionMetadata;
}

export function useSessionManager() {
  const { setChatId, setMode, resetChatState } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(async (params: CreateSessionParams = {}) => {
    try {
      setIsLoading(true);

      // Generate a new session ID
      const sessionId = uuidv4();
      
      // Set the session ID in the store
      setChatId(sessionId);
      
      // If a mode is provided, set it
      if (params.metadata?.mode) {
        setMode(params.metadata.mode);
      }
      
      // Return the session ID
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setChatId, setMode]);

  const refreshSessions = useCallback(() => {
    // This would typically fetch sessions from the database
    // For now, just reset the chat state
    resetChatState();
  }, [resetChatState]);

  return {
    createSession,
    refreshSessions,
    isLoading
  };
}
