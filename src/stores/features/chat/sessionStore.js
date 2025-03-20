import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { toJson } from '@/types/supabase';
export const useChatSessionStore = create()(devtools(persist((set, get) => ({
    sessions: [],
    currentSession: null,
    isLoading: false,
    error: null,
    fetchSessions: async () => {
        try {
            set({ isLoading: true, error: null });
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError)
                throw authError;
            if (!user)
                throw new Error('User not authenticated');
            // Get sessions from database
            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('last_accessed', { ascending: false });
            if (error)
                throw error;
            // Transform sessions to our Session type
            const sessions = (data || []).map(dbSession => {
                const metadata = typeof dbSession.metadata === 'string'
                    ? JSON.parse(dbSession.metadata)
                    : (dbSession.metadata || {});
                const context = typeof dbSession.context === 'string'
                    ? JSON.parse(dbSession.context)
                    : (dbSession.context || {});
                return {
                    id: dbSession.id,
                    title: dbSession.title,
                    user_id: dbSession.user_id,
                    provider_id: dbSession.provider_id,
                    project_id: dbSession.project_id,
                    mode: dbSession.mode,
                    created_at: dbSession.created_at,
                    last_accessed: dbSession.last_accessed,
                    is_active: dbSession.is_active,
                    tokens_used: dbSession.tokens_used,
                    message_count: dbSession.message_count || 0,
                    metadata,
                    context
                };
            });
            set({
                sessions,
                isLoading: false
            });
            logger.info('Sessions fetched successfully', { count: sessions.length });
        }
        catch (error) {
            set({
                error: error,
                isLoading: false
            });
            logger.error('Failed to fetch sessions', { error });
        }
    },
    setCurrentSession: (session) => {
        set({ currentSession: session });
        logger.info('Current session set', { sessionId: session.id });
    },
    clearSessions: () => {
        set({ sessions: [], currentSession: null });
        logger.info('Sessions cleared');
    },
    createSession: async (options = {}) => {
        try {
            set({ isLoading: true, error: null });
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError)
                throw authError;
            if (!user)
                throw new Error('User not authenticated');
            // Create new session
            const newSession = {
                id: uuidv4(),
                title: options.title || 'New Chat',
                user_id: user.id,
                provider_id: options.provider_id || '',
                project_id: '',
                mode: options.mode || 'chat',
                created_at: new Date().toISOString(),
                last_accessed: new Date().toISOString(),
                is_active: true,
                tokens_used: 0,
                message_count: 0,
                metadata: options.metadata || {},
                context: {}
            };
            // Save to database
            const { error } = await supabase
                .from('chat_sessions')
                .insert({
                id: newSession.id,
                title: newSession.title,
                user_id: newSession.user_id,
                provider_id: newSession.provider_id,
                project_id: newSession.project_id,
                mode: newSession.mode,
                is_active: newSession.is_active,
                created_at: newSession.created_at,
                last_accessed: newSession.last_accessed,
                tokens_used: newSession.tokens_used,
                message_count: newSession.message_count,
                metadata: toJson(newSession.metadata),
                context: toJson(newSession.context)
            });
            if (error)
                throw error;
            // Update local state
            set(state => ({
                sessions: [newSession, ...state.sessions],
                currentSession: newSession,
                isLoading: false
            }));
            logger.info('Session created successfully', { sessionId: newSession.id });
            return newSession;
        }
        catch (error) {
            set({
                error: error,
                isLoading: false
            });
            logger.error('Failed to create session', { error });
            toast.error('Failed to create new chat session');
            throw error;
        }
    },
    updateSession: async (sessionId, updates) => {
        try {
            // Update last_accessed automatically
            const sessionUpdates = {
                ...updates,
                last_accessed: new Date().toISOString()
            };
            // Prepare data for database - handle JSON fields
            const dbUpdates = { ...sessionUpdates };
            if (updates.metadata) {
                dbUpdates.metadata = toJson(updates.metadata);
            }
            if (updates.context) {
                dbUpdates.context = toJson(updates.context);
            }
            // Update in database
            const { error } = await supabase
                .from('chat_sessions')
                .update(dbUpdates)
                .eq('id', sessionId);
            if (error)
                throw error;
            // Update local state
            set(state => {
                const updatedSessions = state.sessions.map(session => session.id === sessionId ? { ...session, ...sessionUpdates } : session);
                const updatedCurrentSession = state.currentSession?.id === sessionId
                    ? { ...state.currentSession, ...sessionUpdates }
                    : state.currentSession;
                return {
                    sessions: updatedSessions,
                    currentSession: updatedCurrentSession
                };
            });
            logger.info('Session updated successfully', { sessionId });
        }
        catch (error) {
            logger.error('Failed to update session', { error, sessionId });
            throw error;
        }
    },
    deleteSession: async (sessionId) => {
        try {
            // Delete from database
            const { error } = await supabase
                .from('chat_sessions')
                .delete()
                .eq('id', sessionId);
            if (error)
                throw error;
            // Delete from local state
            set(state => {
                const filteredSessions = state.sessions.filter(session => session.id !== sessionId);
                // If we're deleting the current session, set currentSession to null
                const updatedCurrentSession = state.currentSession?.id === sessionId
                    ? null
                    : state.currentSession;
                return {
                    sessions: filteredSessions,
                    currentSession: updatedCurrentSession
                };
            });
            logger.info('Session deleted successfully', { sessionId });
            // If we're deleting the current session, show a toast
            if (get().currentSession?.id === sessionId) {
                toast.info('Current chat session deleted');
            }
        }
        catch (error) {
            logger.error('Failed to delete session', { error, sessionId });
            toast.error('Failed to delete chat session');
            throw error;
        }
    }
}), {
    name: 'chat-session-storage',
    partialize: (state) => ({
        // Don't persist everything
        sessions: state.sessions.map(session => ({
            id: session.id,
            title: session.title,
            mode: session.mode,
            last_accessed: session.last_accessed
        })),
        currentSession: state.currentSession ? {
            id: state.currentSession.id,
            title: state.currentSession.title,
            mode: state.currentSession.mode,
            last_accessed: state.currentSession.last_accessed
        } : null
    })
}), {
    name: 'ChatSessionStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
// Selector hooks for more granular access
export const useCurrentSession = () => useChatSessionStore(state => state.currentSession);
export const useSessions = () => useChatSessionStore(state => state.sessions);
export const useSessionActions = () => ({
    fetchSessions: useChatSessionStore(state => state.fetchSessions),
    setCurrentSession: useChatSessionStore(state => state.setCurrentSession),
    clearSessions: useChatSessionStore(state => state.clearSessions),
    createSession: useChatSessionStore(state => state.createSession),
    updateSession: useChatSessionStore(state => state.updateSession),
    deleteSession: useChatSessionStore(state => state.deleteSession)
});
