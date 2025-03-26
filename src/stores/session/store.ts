import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  Session, 
  CreateSessionParams, 
  UpdateSessionParams 
} from '@/types/sessions';
import { 
  createNewSession, 
  fetchUserSessions, 
  switchToSession, 
  updateSession as updateSessionApi,
  archiveSession as archiveSessionApi,
  clearAllSessions as clearAllSessionsApi
} from '@/services/sessions';
import { mapDbSessionToSession } from '@/services/sessions/mappers';
import { logger } from '@/services/chat/LoggingService';

export interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  // User property for auth integration
  user: {
    id: string | null;
    email: string | null;
    isAuthenticated: boolean;
  };
}

export interface SessionActions {
  fetchSessions: () => Promise<void>;
  createSession: (params?: CreateSessionParams) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, params: UpdateSessionParams) => Promise<void>;
  archiveSession: (sessionId: string) => Promise<void>;
  clearSessions: (preserveCurrentSession?: boolean) => Promise<void>;
  cleanupInactiveSessions: () => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
}

export type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      user: {
        id: null,
        email: null,
        isAuthenticated: false
      },

      // Actions
      fetchSessions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionsData = await fetchUserSessions();
          
          // Map to proper Session type
          const sessions = Array.isArray(sessionsData) 
            ? sessionsData.map(mapDbSessionToSession)
            : [];
            
          set({ 
            sessions,
            isLoading: false 
          });
          
          logger.info('Sessions fetched', { count: sessions.length });
          return sessions;
        } catch (error) {
          logger.error('Failed to fetch sessions', { error });
          set({ error: error as Error, isLoading: false });
          return [];
        }
      },
      createSession: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          // Call API to create a new session
          const { success, sessionId } = await createNewSession(params);
          
          if (!success || !sessionId) {
            throw new Error('Failed to create session');
          }
          
          // Create a new session object
          const newSession: Session = {
            id: sessionId,
            title: params.title || 'New Chat',
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString(),
            message_count: 0,
            is_active: true,
            archived: false,
            metadata: params.metadata || {},
            user_id: get().user.id || undefined
          };
          
          // Add to sessions list
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
          set({ isLoading: true, error: null });
          
          // Call API to switch session
          const { success } = await switchToSession(sessionId);
          
          if (!success) {
            throw new Error('Failed to switch session');
          }
          
          // Update last_accessed for this session
          const now = new Date().toISOString();
          
          set(state => ({
            currentSessionId: sessionId,
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, last_accessed: now, is_active: true }
                : { ...session, is_active: false }
            ),
            isLoading: false
          }));
          
          logger.info('Switched to session', { sessionId });
        } catch (error) {
          logger.error('Failed to switch session', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      updateSession: async (sessionId, params) => {
        try {
          set({ isLoading: true, error: null });
          
          // Call API to update session
          const { success } = await updateSessionApi(sessionId, params);
          
          if (!success) {
            throw new Error('Failed to update session');
          }
          
          // Update session in state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, ...params }
                : session
            ),
            isLoading: false
          }));
          
          logger.info('Session updated', { sessionId });
        } catch (error) {
          logger.error('Failed to update session', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      archiveSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Call API to archive session
          const { success } = await archiveSessionApi(sessionId);
          
          if (!success) {
            throw new Error('Failed to archive session');
          }
          
          // Update session in state
          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, archived: true, is_active: false }
                : session
            ),
            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
            isLoading: false
          }));
          
          logger.info('Session archived', { sessionId });
        } catch (error) {
          logger.error('Failed to archive session', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      clearSessions: async (preserveCurrentSession = true) => {
        try {
          set({ isLoading: true, error: null });
          
          const currentSessionId = get().currentSessionId;
          
          // Call API to clear sessions
          const { success } = await clearAllSessionsApi(
            preserveCurrentSession ? currentSessionId : null
          );
          
          if (!success) {
            throw new Error('Failed to clear sessions');
          }
          
          // Update state
          set(state => ({
            sessions: preserveCurrentSession && currentSessionId
              ? state.sessions.filter(session => session.id === currentSessionId)
              : [],
            currentSessionId: preserveCurrentSession ? currentSessionId : null,
            isLoading: false
          }));
          
          logger.info('Sessions cleared', { 
            preserveCurrentSession, 
            currentSessionId 
          });
        } catch (error) {
          logger.error('Failed to clear sessions', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      cleanupInactiveSessions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Filter out archived sessions
          set(state => ({
            sessions: state.sessions.filter(session => !session.archived),
            isLoading: false
          }));
          
          logger.info('Inactive sessions cleaned up');
        } catch (error) {
          logger.error('Failed to cleanup inactive sessions', { error });
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      setCurrentSessionId: (sessionId) => {
        set({ currentSessionId: sessionId });
      }
    }),
    { name: 'SessionStore' }
  )
);
