import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Session, CreateSessionParams, UpdateSessionParams } from '@/types/sessions';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { User } from '@supabase/supabase-js';

interface SessionStore {
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
}

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
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            set({ user: null, isLoading: false });
            return;
          }

          const { data: sessions, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('last_accessed', { ascending: false });

          if (error) throw error;

          set({ 
            sessions: sessions || [], 
            user,
            isLoading: false 
          });
        } catch (error) {
          logger.error('Failed to fetch sessions', error);
          set({ error: error as Error, isLoading: false });
        }
      },

      createSession: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const sessionId = crypto.randomUUID();
          const now = new Date().toISOString();
          
          const newSession = {
            id: sessionId,
            user_id: user.id,
            title: params?.title || `Chat ${new Date().toLocaleString()}`,
            created_at: now,
            updated_at: now,
            last_accessed: now,
            message_count: 0,
            is_active: true,
            metadata: params?.metadata || {},
            archived: false,
            context: {},
            mode: 'chat'
          };

          const { error } = await supabase
            .from('chat_sessions')
            .insert(newSession);

          if (error) throw error;

          set(state => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: sessionId,
            isLoading: false
          }));

          return sessionId;
        } catch (error) {
          logger.error('Failed to create session', error);
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },

      switchSession: async (sessionId) => {
        try {
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session) {
            throw new Error(`Session with ID ${sessionId} not found`);
          }

          set({ currentSessionId: sessionId });

          const { error } = await supabase
            .from('chat_sessions')
            .update({ last_accessed: new Date().toISOString() })
            .eq('id', sessionId);

          if (error) throw error;

          logger.info('Switched to session', { sessionId });
        } catch (error) {
          logger.error('Failed to switch session', error);
          throw error;
        }
      },

      updateSession: async (sessionId, params) => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase
            .from('chat_sessions')
            .update({
              ...params,
              updated_at: new Date().toISOString()
            })
            .eq('id', sessionId);

          if (error) throw error;

          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, ...params }
                : session
            ),
            isLoading: false
          }));

          logger.info('Session updated', { sessionId });
          return true;
        } catch (error) {
          logger.error('Failed to update session', error);
          set({ error: error as Error, isLoading: false });
          return false;
        }
      },

      archiveSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase
            .from('chat_sessions')
            .update({ archived: true })
            .eq('id', sessionId);

          if (error) throw error;

          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? { ...session, archived: true }
                : session
            ),
            isLoading: false,
            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
          }));

          logger.info('Session archived', { sessionId });
          return true;
        } catch (error) {
          logger.error('Failed to archive session', error);
          set({ error: error as Error, isLoading: false });
          return false;
        }
      },

      clearSessions: async (preserveCurrentSession = false) => {
        try {
          const currentSessionId = get().currentSessionId;
          const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .neq('id', preserveCurrentSession ? currentSessionId : '');

          if (error) throw error;

          set(state => ({
            sessions: preserveCurrentSession 
              ? state.sessions.filter(s => s.id === currentSessionId)
              : [],
            currentSessionId: preserveCurrentSession ? currentSessionId : null
          }));

          logger.info('Sessions cleared', { preserveCurrentSession });
        } catch (error) {
          logger.error('Failed to clear sessions', error);
          throw error;
        }
      },

      cleanupInactiveSessions: async () => {
        try {
          const currentSessionId = get().currentSessionId;
          const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .neq('id', currentSessionId)
            .lt('last_accessed', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          if (error) throw error;

          set(state => ({
            sessions: state.sessions.filter(s => s.id === currentSessionId)
          }));

          logger.info('Inactive sessions cleaned up');
        } catch (error) {
          logger.error('Failed to cleanup inactive sessions', error);
          throw error;
        }
      }
    }),
    {
      name: 'SessionStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);
