import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Session, SupabaseSession, fromSupabaseSession, ChatMode } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

interface SessionManagerState {
  // State
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  setCurrentSession: (session: Session) => void;
  clearSessions: () => void;
  createSession: (title?: string) => Promise<Session>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

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

const transformDBSession = (rawSession: SupabaseSession): Session => {
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
};

export const useSessionManager = create<SessionManagerState>()(
  devtools(
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

          const sessions = (data || [])
            .map(fromSupabaseSession)
            .map(transformDBSession);

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

      createSession: async (title = 'New Chat') => {
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;
          if (!user) throw new Error('User not authenticated');

          const newSession = {
            id: uuidv4(),
            title,
            user_id: user.id,
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString(),
            is_active: true,
            metadata: {},
            mode: 'standard' as ChatMode,
            provider_id: '',
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

          const session = transformDBSession(fromSupabaseSession(data));
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

          const updatedSession = transformDBSession(fromSupabaseSession(data));
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

          set(state => ({
            sessions: state.sessions.filter(s => s.id !== sessionId),
            currentSession: state.currentSession?.id === sessionId 
              ? null 
              : state.currentSession
          }));

          logger.info('Session deleted successfully', { sessionId });
        } catch (error) {
          logger.error('Failed to delete session', { error, sessionId });
          throw error;
        }
      }
    }),
    {
      name: 'SessionManager',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);
