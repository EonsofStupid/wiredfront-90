import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Session, CreateSessionParams, UpdateSessionParams } from '@/types/sessions';
import { fetchAllSessions } from '@/components/chat/shared/services/chat-sessions/chat-sessionFetch';
import { createNewSession } from '@/components/chat/shared/services/chat-sessions/chat-sessionCreate';
import { updateSession as updateSessionService } from '@/components/chat/shared/services/chat-sessions/chat-sessionUpdate';
import { archiveSession as archiveSessionService } from '@/components/chat/shared/services/chat-sessions/chat-sessionArchive';
import { logger } from '@/services/chat/LoggingService';
import { clearAllSessions } from '@/components/chat/shared/services/chat-sessions/chat-sessionDelete';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type SessionStore = {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  user: User | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (params?: CreateSessionParams) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, params: UpdateSessionParams) => Promise<boolean>;
  archiveSession: (sessionId: string) => Promise<boolean>;
  clearSessions: (preserveCurrentSession?: boolean) => Promise<void>;
  cleanupInactiveSessions: () => Promise<void>;
};

export const useSessionStore = create<SessionStore>()(
  devtools(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      user: null,
      
      fetchSessions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current user and set it in the store
          const { data: { user } } = await supabase.auth.getUser();
          set({ user });
          
          const sessions = await fetchAllSessions();
          set({ sessions, isLoading: false });
          
          logger.info('Sessions fetched', { count: sessions.length });
          
          // If no current session is set but we have sessions, set the first one as current
          if (!get().currentSessionId && sessions.length > 0) {
            set({ currentSessionId: sessions[0].id });
          }
          
          return;
        } catch (error) {
          logger.error('Failed to fetch sessions', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      createSession: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const { success, sessionId, error } = await createNewSession(params);
          
          if (!success || !sessionId) {
            throw error || new Error('Failed to create session');
          }
          
          // Add the new session to the store (simplified version)
          // In a real app, you'd fetch the fresh session or use the returned data
          const newSession: Session = {
            id: sessionId,
            title: params.title || 'New Chat',
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString(),
            message_count: 0,
            is_active: true,
            metadata: params.metadata || {}
          };
          
          set(state => ({ 
            sessions: [newSession, ...state.sessions],
            currentSessionId: sessionId,
            isLoading: false
          }));
          
          logger.info('Session created', { sessionId });
          
          return sessionId;
        } catch (error) {
          logger.error('Failed to create session', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      switchSession: async (sessionId) => {
        try {
          // Check if session exists
          const session = get().sessions.find(s => s.id === sessionId);
          
          if (!session) {
            throw new Error(`Session with ID ${sessionId} not found`);
          }
          
          // Update current session in the store
          set({ currentSessionId: sessionId });
          
          // Update last_accessed time in the database
          await updateSessionService(sessionId, {
            metadata: {
              ...session.metadata,
              last_accessed: new Date().toISOString()
            }
          });
          
          logger.info('Switched to session', { sessionId });
          
          return;
        } catch (error) {
          logger.error('Failed to switch session', { error, sessionId });
          throw error;
        }
      },
      
      updateSession: async (sessionId, params) => {
        try {
          set({ isLoading: true, error: null });
          
          // Update in database
          await updateSessionService(sessionId, params);
          
          // Update in store
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, ...params, metadata: { ...session.metadata, ...params.metadata } }
                : session
            ),
            isLoading: false
          }));
          
          logger.info('Session updated', { sessionId });
          
          return true;
        } catch (error) {
          logger.error('Failed to update session', { error, sessionId });
          set({ error: error as Error, isLoading: false });
          return false;
        }
      },
      
      archiveSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Archive in database
          await archiveSessionService(sessionId);
          
          // Update in store
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, archived: true }
                : session
            ),
            isLoading: false,
            // If the archived session was the current one, set currentSessionId to null
            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
          }));
          
          logger.info('Session archived', { sessionId });
          
          return true;
        } catch (error) {
          logger.error('Failed to archive session', { error, sessionId });
          set({ error: error as Error, isLoading: false });
          return false;
        }
      },
      
      // Add the missing methods
      clearSessions: async (preserveCurrentSession = true) => {
        try {
          const currentId = get().currentSessionId;
          
          // Clear sessions from database
          await clearAllSessions(preserveCurrentSession ? currentId : null);
          
          // Update store state
          if (preserveCurrentSession && currentId) {
            const currentSession = get().sessions.find(s => s.id === currentId);
            set({ 
              sessions: currentSession ? [currentSession] : [],
              currentSessionId: currentId
            });
          } else {
            set({ sessions: [], currentSessionId: null });
          }
          
          logger.info('Sessions cleared', { preserveCurrentSession });
          return;
        } catch (error) {
          logger.error('Failed to clear sessions', { error });
          throw error;
        }
      },
      
      cleanupInactiveSessions: async () => {
        try {
          const currentId = get().currentSessionId;
          
          if (!currentId) {
            throw new Error('No active session to preserve');
          }
          
          await clearAllSessions(currentId);
          
          // Update store to remove inactive sessions
          const currentSession = get().sessions.find(s => s.id === currentId);
          if (currentSession) {
            set({ sessions: [currentSession] });
          }
          
          logger.info('Inactive sessions cleaned up');
          return;
        } catch (error) {
          logger.error('Failed to cleanup inactive sessions', { error });
          throw error;
        }
      }
    }),
    { name: 'SessionStore' }
  )
);
