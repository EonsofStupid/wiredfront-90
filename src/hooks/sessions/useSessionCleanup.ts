
import { useEffect } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { clearMiddlewareStorage } from '@/components/chat/store';
import { clearAllSessions } from '@/services/sessions/sessionDelete';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { messageCache } from '@/services/chat/MessageCacheService';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';

/**
 * Hook to handle chat session cleanup and persistence management
 */
export function useSessionCleanup(
  currentSessionId: string | null = null,
  clearMessages: () => void = () => {},
  createSession: (params?: any) => Promise<string> = async () => '',
  refreshSessions: () => void = () => {}
) {
  const { resetChatState } = useChatStore();

  /**
   * Delete all sessions except the current one
   */
  const cleanupInactiveSessions = async () => {
    try {
      if (!currentSessionId) {
        toast.error('No active session');
        return;
      }
      
      const result = await clearAllSessions(currentSessionId);
      if (result.success) {
        toast.success('Inactive sessions cleared');
        logger.info('Inactive sessions cleared', { preservedSession: currentSessionId });
        
        // Also clear local storage for inactive sessions
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('chat-session-') && !key.includes(currentSessionId)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        toast.error('Failed to clear inactive sessions');
        logger.error('Failed to clear inactive sessions', result.error);
      }
    } catch (error) {
      toast.error('Error cleaning up sessions');
      logger.error('Error in cleanupInactiveSessions', error);
    }
  };

  /**
   * Completely flush all persistent storage and start fresh
   */
  const clearSessions = async (preserveCurrentSession: boolean = false) => {
    try {
      // Clear DB sessions
      await clearAllSessions(preserveCurrentSession ? currentSessionId : null);
      
      // Clear message cache
      messageCache.clearAllCache();
      
      // Clear messages from MessageStore
      clearMessages();
      
      // Reset chat state (clears Zustand store)
      resetChatState();
      
      // Force clear any middleware storage directly
      clearMiddlewareStorage();
      
      // If we're not preserving sessions, create a new one
      if (!preserveCurrentSession) {
        const newSessionId = await createSession();
        logger.info('New session created after clearing all', { newSessionId });
      }
      
      // Refresh sessions list
      refreshSessions();
      
      toast.success(
        preserveCurrentSession 
          ? 'All sessions except current cleared' 
          : 'All sessions cleared, new session created'
      );
    } catch (error) {
      toast.error('Error clearing sessions');
      logger.error('Error in clearSessions', error);
    }
  };

  return {
    cleanupInactiveSessions,
    clearSessions
  };
}
