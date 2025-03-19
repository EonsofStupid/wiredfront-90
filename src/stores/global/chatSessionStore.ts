
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionCreateOptions } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

interface SessionState {
  // State
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: Error | null;
}

interface SessionActions {
  // Actions
  fetchSessions: () => Promise<void>;
  setCurrentSession: (session: Session) => void;
  clearSessions: () => void;
  createSession: (options?: SessionCreateOptions) => Promise<Session>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export type SessionStore = SessionState & SessionActions;

const parseJsonField = (field: any): Record<string, any> => {
  if (field === null) return {};
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (error) {
      logger.warn('Failed to parse JSON field', { error });
      return {};
    }
  }
  if (typeof field === 'object' && !Array.isArray(field) && field !== null) {
    return field as Record<string, any>;
  }
  return {};
};

export const useChatSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sessions: [],
        currentSession: null,
        isLoading: false,
        error: null,

        // Actions
        fetchSessions: async () => {
          set({ isLoading: true, error: null });
          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
              .from('chat_sessions')
              .select('*')
              .eq('user_id', user.id)
              .order('last_accessed', { ascending: false });

            if (error) throw error;

            const sessions = (data || []).map(rawSession => {
              const metadata = parseJsonField(rawSession.metadata);
              const context = parseJsonField(rawSession.context);

              return {
                id: rawSession.id,
                title: rawSession.title,
                created_at: rawSession.created_at,
                last_accessed: rawSession.last_accessed,
                message_count: rawSession.message_count,
                is_active: rawSession.is_active,
                metadata,
                user_id: rawSession.user_id,
                mode: rawSession.mode,
                provider_id: rawSession.provider_id,
                project_id: rawSession.project_id,
                tokens_used: rawSession.tokens_used,
                context
              };
            });

            set({ 
              sessions,
              error: null,
              isLoading: false 
            });

            logger.info('Sessions fetched successfully', { 
              count: sessions.length,
              userId: user.id 
            });
          } catch (error) {
            set({ 
              error: error as Error,
              isLoading: false 
            });
            logger.error('Failed to fetch sessions', { error });
          }
        },

        setCurrentSession: (session: Session) => {
          set({ currentSession: session });
          logger.info('Current session set', { sessionId: session.id });
        },

        clearSessions: () => {
          set({ sessions: [], currentSession: null });
          logger.info('Sessions cleared');
        },

        createSession: async (options: SessionCreateOptions = {}) => {
          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            const newSession = {
              id: uuidv4(),
              title: options.title || 'New Chat',
              user_id: user.id,
              created_at: new Date().toISOString(),
              last_accessed: new Date().toISOString(),
              is_active: true,
              metadata: options.metadata || {},
              mode: options.mode || 'chat',
              provider_id: options.provider_id || '',
              project_id: '',
              tokens_used: 0,
              context: {},
              message_count: 0
            };

            const { data, error } = await supabase
              .from('chat_sessions')
              .insert(newSession)
              .select()
              .single();

            if (error) throw error;
            if (!data) throw new Error('Failed to create session');

            const metadata = parseJsonField(data.metadata);
            const context = parseJsonField(data.context);

            const session: Session = {
              ...data,
              metadata,
              context
            };

            set(state => ({
              sessions: [session, ...state.sessions],
              currentSession: session
            }));

            logger.info('Session created successfully', { sessionId: session.id });
            return session;
          } catch (error) {
            logger.error('Failed to create session', { error });
            throw error;
          }
        },

        updateSession: async (sessionId: string, updates: Partial<Session>) => {
          try {
            const { data, error } = await supabase
              .from('chat_sessions')
              .update({
                ...updates,
                last_accessed: new Date().toISOString()
              })
              .eq('id', sessionId)
              .select()
              .single();

            if (error) throw error;
            if (!data) throw new Error('Session not found');

            const metadata = parseJsonField(data.metadata);
            const context = parseJsonField(data.context);

            const updatedSession: Session = {
              ...data,
              metadata,
              context
            };

            set(state => ({
              sessions: state.sessions.map(s => 
                s.id === sessionId ? updatedSession : s
              ),
              currentSession: state.currentSession?.id === sessionId 
                ? updatedSession 
                : state.currentSession
            }));

            logger.info('Session updated successfully', { sessionId });
          } catch (error) {
            logger.error('Failed to update session', { error, sessionId });
            throw error;
          }
        },

        deleteSession: async (sessionId: string) => {
          try {
            const { error } = await supabase
              .from('chat_sessions')
              .delete()
              .eq('id', sessionId);

            if (error) throw error;

            set(state => {
              const newState = {
                sessions: state.sessions.filter(s => s.id !== sessionId),
                currentSession: state.currentSession?.id === sessionId 
                  ? null 
                  : state.currentSession
              };
              
              if (newState.currentSession === null && newState.sessions.length > 0) {
                newState.currentSession = newState.sessions[0];
              }
              
              return newState;
            });

            toast.success('Session deleted');
            logger.info('Session deleted successfully', { sessionId });
          } catch (error) {
            toast.error('Failed to delete session');
            logger.error('Failed to delete session', { error, sessionId });
            throw error;
          }
        }
      }),
      {
        name: 'chat-session-storage',
        partialize: (state) => ({
          currentSession: state.currentSession,
        })
      }
    ),
    {
      name: 'ChatSessionStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks for more granular access
export const useCurrentSession = () => useChatSessionStore(state => state.currentSession);
export const useSessions = () => useChatSessionStore(state => state.sessions);
export const useSessionActions = () => ({
  createSession: useChatSessionStore(state => state.createSession),
  updateSession: useChatSessionStore(state => state.updateSession),
  deleteSession: useChatSessionStore(state => state.deleteSession),
  setCurrentSession: useChatSessionStore(state => state.setCurrentSession),
  fetchSessions: useChatSessionStore(state => state.fetchSessions),
});
