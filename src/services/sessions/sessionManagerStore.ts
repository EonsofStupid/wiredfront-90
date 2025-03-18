
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  SessionManager, 
  SessionState,
  SessionMetadata
} from './types';
import { Session as SessionType, CreateSessionParams } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';
import { 
  fetchUserSessions, 
  createChatSession,
  switchToSession,
  updateChatSession,
  archiveChatSession,
  deleteChatSession,
  clearChatSessions
} from '@/services/sessions';
import { useMessageStorage } from '../messages/messageStorageStore';

const initialState: SessionState = {
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null
};

export const useSessionManager = create<SessionManager>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...initialState,

        createSession: async (title?: string, metadata?: any) => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info('Creating new session', { title, metadata });
            
            const params: CreateSessionParams = {
              title: title || `New Chat ${new Date().toLocaleString()}`,
              metadata: metadata || {}
            };
            
            const result = await createChatSession(params);
            
            if (!result.success || !result.sessionId) {
              throw new Error('Failed to create session');
            }
            
            const sessionId = result.sessionId;
            
            // Fetch sessions to get the newly created session
            await get().fetchSessions();
            
            // Set as current session
            set({ currentSessionId: sessionId, isLoading: false });
            
            return sessionId;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error creating session:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        switchSession: async (sessionId: string) => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info(`Switching to session: ${sessionId}`);
            
            if (sessionId === get().currentSessionId) {
              logger.info('Already in requested session');
              set({ isLoading: false });
              return;
            }
            
            const result = await switchToSession(sessionId);
            
            if (!result.success) {
              throw new Error('Failed to switch session');
            }
            
            // Set current session ID
            set({ currentSessionId: sessionId, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error switching session:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        updateSession: async (sessionId: string, updates: Partial<SessionType>) => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info(`Updating session: ${sessionId}`, { updates });
            
            const result = await updateChatSession(sessionId, updates);
            
            if (!result.success) {
              throw new Error('Failed to update session');
            }
            
            // Update the session in the local state
            set(state => ({
              sessions: state.sessions.map(session => 
                session.id === sessionId ? { ...session, ...updates } : session
              ),
              isLoading: false
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error updating session:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        archiveSession: async (sessionId: string) => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info(`Archiving session: ${sessionId}`);
            
            const result = await archiveChatSession(sessionId);
            
            if (!result.success) {
              throw new Error('Failed to archive session');
            }
            
            // Update the sessions list to reflect archived status
            await get().fetchSessions();
            
            // If this was the current session, create a new one
            if (sessionId === get().currentSessionId) {
              const newSessionId = await get().createSession();
              set({ currentSessionId: newSessionId });
            }
            
            set({ isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error archiving session:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        deleteSession: async (sessionId: string) => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info(`Deleting session: ${sessionId}`);
            
            const result = await deleteChatSession(sessionId);
            
            if (!result.success) {
              throw new Error('Failed to delete session');
            }
            
            // Clear the messages for this session
            useMessageStorage.getState().clearSessionMessages(sessionId);
            
            // Update the sessions list
            await get().fetchSessions();
            
            // If this was the current session, create a new one
            if (sessionId === get().currentSessionId) {
              const newSessionId = await get().createSession();
              set({ currentSessionId: newSessionId });
            }
            
            set({ isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error deleting session:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        clearAllSessions: async () => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info('Clearing all sessions');
            
            const result = await clearChatSessions(null);
            
            if (!result.success) {
              throw new Error('Failed to clear sessions');
            }
            
            // Clear all messages
            useMessageStorage.getState().clearAllMessages();
            
            // Create a new session
            const newSessionId = await get().createSession();
            
            set({ 
              sessions: [get().findSessionById(newSessionId)].filter(Boolean) as SessionType[],
              currentSessionId: newSessionId,
              isLoading: false
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error clearing sessions:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        fetchSessions: async () => {
          try {
            set({ isLoading: true, error: null });
            
            logger.info('Fetching sessions');
            
            const sessions = await fetchUserSessions();
            
            set({ 
              sessions,
              isLoading: false
            });
            
            // If we don't have a current session but have sessions, use the first one
            if (!get().currentSessionId && sessions.length > 0) {
              set({ currentSessionId: sessions[0].id });
            }
            // If we don't have any sessions, create a new one
            else if (sessions.length === 0) {
              const newSessionId = await get().createSession();
              set({ currentSessionId: newSessionId });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error('Error fetching sessions:', { error });
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        findSessionById: (id: string) => {
          return get().sessions.find(session => session.id === id) || null;
        },

        getCurrentSession: () => {
          const { currentSessionId, sessions } = get();
          if (!currentSessionId) return null;
          
          return sessions.find(session => session.id === currentSessionId) || null;
        }
      }),
      {
        name: 'session-manager',
        partialize: (state) => ({
          currentSessionId: state.currentSessionId
        }),
      }
    ),
    {
      name: 'Session Manager',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
