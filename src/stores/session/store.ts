
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Session, CreateSessionParams, UpdateSessionParams } from '@/types/sessions';
import { fetchAllSessions } from '@/services/sessions/sessionFetch';
import { createSession } from '@/services/sessions/sessionCreate';
import { updateSession as updateSessionService, updateSessionMetadata } from '@/services/sessions/sessionUpdate';
import { archiveSession as archiveSessionService } from '@/services/sessions/sessionArchive';
import { logger } from '@/services/chat/LoggingService';

export type SessionStore = {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (params?: CreateSessionParams) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, params: UpdateSessionParams) => Promise<boolean>;
  archiveSession: (sessionId: string) => Promise<boolean>;
};

export const useSessionStore = create<SessionStore>()(
  devtools(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      
      fetchSessions: async () => {
        try {
          set({ isLoading: true, error: null });
          
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
          
          const sessionId = await createSession(params);
          
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
      }
    }),
    { name: 'SessionStore' }
  )
);
