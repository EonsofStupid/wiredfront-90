
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { 
  Session, 
  CreateSessionParams, 
  UpdateSessionParams, 
  SessionOperationResult, 
  SessionMetadata 
} from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

export interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
}

export interface SessionActions {
  // Core actions
  setCurrentSession: (sessionId: string | null) => void;
  refreshSessions: () => Promise<void>;
  
  // Session CRUD operations
  createSession: (params?: CreateSessionParams) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, params: UpdateSessionParams) => Promise<void>;
  archiveSession: (sessionId: string) => Promise<void>;
  
  // Utility functions
  clearSessions: (preserveCurrentSession?: boolean) => Promise<void>;
  cleanupInactiveSessions: () => Promise<void>;
}

export type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sessions: [],
        currentSessionId: null,
        isLoading: false,
        error: null,

        // Core state management
        setCurrentSession: (sessionId) => {
          set({ currentSessionId: sessionId });
        },

        refreshSessions: async () => {
          try {
            set({ isLoading: true, error: null });
            
            // Get user from Supabase auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            // Fetch chat sessions for the current user
            const { data, error } = await supabase
              .from('chat_sessions')
              .select(`
                id,
                title,
                created_at,
                last_accessed,
                archived,
                metadata,
                user_id
              `)
              .eq('user_id', user.id)
              .order('last_accessed', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
              set({ sessions: [], isLoading: false });
              return;
            }

            // Get message counts for each session
            const sessionsWithCounts = await Promise.all(data.map(async (session) => {
              // Count messages for this session
              const { count, error: countError } = await supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('chat_session_id', session.id);
              
              if (countError) {
                logger.warn('Failed to get message count', { error: countError, sessionId: session.id });
              }
              
              // Convert to domain model
              return {
                id: session.id,
                title: session.title,
                created_at: session.created_at,
                last_accessed: session.last_accessed,
                message_count: count || 0,
                is_active: !session.archived,
                archived: session.archived,
                metadata: session.metadata as SessionMetadata,
                user_id: session.user_id || undefined
              } as Session;
            }));
            
            set({ sessions: sessionsWithCounts, isLoading: false });
            logger.info('Sessions fetched', { count: sessionsWithCounts.length });
          } catch (error) {
            logger.error('Failed to fetch sessions', { error });
            set({ error: error as Error, isLoading: false });
          }
        },

        // CRUD operations
        createSession: async (params = {}) => {
          try {
            set({ isLoading: true, error: null });
            
            // Get user from Supabase auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            const now = new Date().toISOString();
            const sessionId = uuidv4();
            
            // Create new session
            const { error } = await supabase
              .from('chat_sessions')
              .insert({
                id: sessionId,
                title: params.title || `Chat ${new Date().toLocaleString()}`,
                created_at: now,
                last_accessed: now,
                archived: false,
                metadata: params.metadata || {},
                user_id: user.id
              });

            if (error) throw error;
            
            // Refresh sessions
            await get().refreshSessions();
            
            // Set current session
            set({ currentSessionId: sessionId, isLoading: false });
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
            
            // Update last accessed timestamp
            const now = new Date().toISOString();
            const { error } = await supabase
              .from('chat_sessions')
              .update({ last_accessed: now })
              .eq('id', sessionId);

            if (error) throw error;
            
            // Set current session
            set({ currentSessionId: sessionId, isLoading: false });
          } catch (error) {
            logger.error('Failed to switch session', { error });
            set({ error: error as Error, isLoading: false });
            throw error;
          }
        },
        
        updateSession: async (sessionId, params) => {
          try {
            set({ isLoading: true, error: null });
            
            // Build update object
            const updates: any = {};
            if (params.title !== undefined) updates.title = params.title;
            if (params.archived !== undefined) updates.archived = params.archived;
            if (params.metadata !== undefined) updates.metadata = params.metadata;
            
            // Update session
            const { error } = await supabase
              .from('chat_sessions')
              .update(updates)
              .eq('id', sessionId);

            if (error) throw error;
            
            // Refresh sessions
            await get().refreshSessions();
            set({ isLoading: false });
          } catch (error) {
            logger.error('Failed to update session', { error });
            set({ error: error as Error, isLoading: false });
            throw error;
          }
        },
        
        archiveSession: async (sessionId) => {
          try {
            await get().updateSession(sessionId, { archived: true });
            
            // If we archived the current session, set current session to null
            if (get().currentSessionId === sessionId) {
              set({ currentSessionId: null });
            }
          } catch (error) {
            logger.error('Failed to archive session', { error });
            throw error;
          }
        },
        
        // Utility functions
        clearSessions: async (preserveCurrentSession = false) => {
          try {
            set({ isLoading: true, error: null });
            
            // Get user from Supabase auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            let query = supabase
              .from('chat_sessions')
              .delete()
              .eq('user_id', user.id);
            
            // If preserving current session, add a not-equal condition
            if (preserveCurrentSession && get().currentSessionId) {
              query = query.neq('id', get().currentSessionId);
            }

            const { error } = await query;
            if (error) throw error;
            
            // Refresh sessions
            await get().refreshSessions();
            
            // If we deleted the current session, set current session to null
            if (!preserveCurrentSession) {
              set({ currentSessionId: null });
            }
            
            set({ isLoading: false });
          } catch (error) {
            logger.error('Failed to clear sessions', { error });
            set({ error: error as Error, isLoading: false });
            throw error;
          }
        },
        
        cleanupInactiveSessions: async () => {
          try {
            set({ isLoading: true, error: null });
            
            // Get user from Supabase auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            // Get timestamp for 30 days ago
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            // Delete sessions that haven't been accessed in 30 days
            const { error } = await supabase
              .from('chat_sessions')
              .delete()
              .eq('user_id', user.id)
              .lt('last_accessed', thirtyDaysAgo.toISOString());

            if (error) throw error;
            
            // Refresh sessions
            await get().refreshSessions();
            set({ isLoading: false });
          } catch (error) {
            logger.error('Failed to cleanup inactive sessions', { error });
            set({ error: error as Error, isLoading: false });
            throw error;
          }
        }
      }),
      {
        name: 'chat-sessions',
        partialize: (state) => ({
          currentSessionId: state.currentSessionId,
        }),
      }
    ),
    { name: 'SessionStore' }
  )
);
