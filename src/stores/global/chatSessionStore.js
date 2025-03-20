import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { jsonToRecord, toJson } from '@/types/supabase';
import { normalizeChatMode } from '@/types/chat/core';
// Create the store
export const useChatSessionStore = create()(devtools(persist((set, get) => ({
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
            if (authError)
                throw authError;
            if (!user)
                throw new Error('User not authenticated');
            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('last_accessed', { ascending: false });
            if (error)
                throw error;
            const sessions = (data || []).map(rawSession => {
                const metadata = jsonToRecord(rawSession.metadata);
                const context = jsonToRecord(rawSession.context);
                return {
                    id: rawSession.id,
                    title: rawSession.title || 'New Chat',
                    created_at: rawSession.created_at,
                    last_accessed: rawSession.last_accessed,
                    message_count: rawSession.message_count || 0,
                    is_active: rawSession.is_active,
                    metadata,
                    user_id: rawSession.user_id,
                    mode: normalizeChatMode(rawSession.mode),
                    provider_id: rawSession.provider_id || '',
                    project_id: rawSession.project_id || '',
                    tokens_used: rawSession.tokens_used || 0,
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
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError)
                throw authError;
            if (!user)
                throw new Error('User not authenticated');
            const mode = options.mode || 'chat';
            const newSession = {
                id: uuidv4(),
                title: options.title || 'New Chat',
                user_id: user.id,
                created_at: new Date().toISOString(),
                last_accessed: new Date().toISOString(),
                is_active: true,
                metadata: options.metadata || {},
                mode,
                provider_id: options.provider_id || '',
                project_id: '',
                tokens_used: 0,
                context: {},
                message_count: 0
            };
            const { data, error } = await supabase
                .from('chat_sessions')
                .insert({
                id: newSession.id,
                title: newSession.title,
                user_id: newSession.user_id,
                created_at: newSession.created_at,
                last_accessed: newSession.last_accessed,
                is_active: newSession.is_active,
                metadata: toJson(newSession.metadata),
                mode,
                provider_id: newSession.provider_id,
                project_id: newSession.project_id,
                tokens_used: newSession.tokens_used,
                context: toJson(newSession.context),
                message_count: newSession.message_count,
            })
                .select()
                .single();
            if (error)
                throw error;
            if (!data)
                throw new Error('Failed to create session');
            const metadata = jsonToRecord(data.metadata);
            const context = jsonToRecord(data.context);
            const session = {
                ...data,
                metadata,
                context,
                mode: normalizeChatMode(data.mode)
            };
            set(state => ({
                sessions: [session, ...state.sessions],
                currentSession: session
            }));
            logger.info('Session created successfully', { sessionId: session.id });
            return session;
        }
        catch (error) {
            logger.error('Failed to create session', { error });
            throw error;
        }
    },
    updateSession: async (sessionId, updates) => {
        try {
            const normalizedMode = updates.mode ? normalizeChatMode(updates.mode) : undefined;
            const dbUpdates = {
                ...updates,
                last_accessed: new Date().toISOString(),
                mode: normalizedMode,
                metadata: updates.metadata ? toJson(updates.metadata) : undefined,
                context: updates.context ? toJson(updates.context) : undefined
            };
            const { data, error } = await supabase
                .from('chat_sessions')
                .update(dbUpdates)
                .eq('id', sessionId)
                .select()
                .single();
            if (error)
                throw error;
            if (!data)
                throw new Error('Session not found');
            const metadata = jsonToRecord(data.metadata);
            const context = jsonToRecord(data.context);
            const updatedSession = {
                ...data,
                metadata,
                context,
                mode: normalizeChatMode(data.mode)
            };
            set(state => ({
                sessions: state.sessions.map(s => s.id === sessionId ? updatedSession : s),
                currentSession: state.currentSession?.id === sessionId
                    ? updatedSession
                    : state.currentSession
            }));
            logger.info('Session updated successfully', { sessionId });
        }
        catch (error) {
            logger.error('Failed to update session', { error, sessionId });
            throw error;
        }
    },
    deleteSession: async (sessionId) => {
        try {
            const { error } = await supabase
                .from('chat_sessions')
                .delete()
                .eq('id', sessionId);
            if (error)
                throw error;
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
        }
        catch (error) {
            toast.error('Failed to delete session');
            logger.error('Failed to delete session', { error, sessionId });
            throw error;
        }
    }
}), {
    name: 'chat-session-storage',
    partialize: (state) => ({
        currentSession: state.currentSession,
    })
}), {
    name: 'ChatSessionStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
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
