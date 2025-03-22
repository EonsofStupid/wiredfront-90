import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '@/stores/chat/chatStore';
import { ChatSession } from '@/types/chat';
import { handleError } from '@/utils/errorHandling';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface CreateSessionOptions {
    title?: string;
}

export function useSessionManager() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setCurrentSession } = useChatStore();

    const refreshSessions = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('last_accessed', { ascending: false });

            if (error) throw error;

            const formattedSessions: ChatSession[] = (data || []).map((session) => ({
                id: session.id,
                title: session.title || 'Untitled Chat',
                createdAt: session.created_at || new Date().toISOString(),
                updatedAt: session.last_accessed || new Date().toISOString(),
                messages: [],
                isMinimized: false,
                position: { x: 0, y: 0 }
            }));

            setSessions(formattedSessions);

            if (formattedSessions.length > 0 && !currentSessionId) {
                setCurrentSessionId(formattedSessions[0].id);
                setCurrentSession(formattedSessions[0]);
            }

            logger.info('Sessions refreshed', { count: formattedSessions.length });
            return formattedSessions;
        } catch (error) {
            handleError(error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [currentSessionId, setCurrentSession]);

    const createSession = useCallback(async (options: CreateSessionOptions = {}) => {
        try {
            setIsLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            const sessionId = uuidv4();
            const now = new Date().toISOString();

            const newSession: ChatSession = {
                id: sessionId,
                title: options.title || `New Chat ${new Date().toLocaleString()}`,
                createdAt: now,
                updatedAt: now,
                messages: [],
                isMinimized: false,
                position: { x: 0, y: 0 }
            };

            const { error } = await supabase
                .from('chat_sessions')
                .insert({
                    id: sessionId,
                    title: newSession.title,
                    user_id: user.id,
                    created_at: now,
                    last_accessed: now,
                    is_active: true
                });

            if (error) throw error;

            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(sessionId);
            setCurrentSession(newSession);

            toast.success('New session created');
            logger.info('Session created', { sessionId });
            return sessionId;
        } catch (error) {
            handleError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [setCurrentSession]);

    const switchSession = useCallback(async (sessionId: string) => {
        if (sessions.some(s => s.id === sessionId)) {
            setCurrentSessionId(sessionId);
            const session = sessions.find(s => s.id === sessionId);
            if (session) {
                setCurrentSession(session);
            }

            try {
                await supabase
                    .from('chat_sessions')
                    .update({ last_accessed: new Date().toISOString() })
                    .eq('id', sessionId);
                logger.info('Session switched', { sessionId });
            } catch (error) {
                logger.error('Failed to update session last_accessed', { error, sessionId });
            }

            return true;
        }
        return false;
    }, [sessions, setCurrentSession]);

    const deleteSession = useCallback(async (sessionId: string) => {
        try {
            const { error } = await supabase
                .from('chat_sessions')
                .delete()
                .eq('id', sessionId);

            if (error) throw error;

            setSessions(prev => prev.filter(s => s.id !== sessionId));

            if (currentSessionId === sessionId) {
                const remainingSessions = sessions.filter(s => s.id !== sessionId);
                if (remainingSessions.length > 0) {
                    setCurrentSessionId(remainingSessions[0].id);
                    setCurrentSession(remainingSessions[0]);
                } else {
                    setCurrentSessionId(null);
                    setCurrentSession(null as unknown as ChatSession);
                }
            }

            toast.success('Session deleted');
            logger.info('Session deleted', { sessionId });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [currentSessionId, sessions, setCurrentSession]);

    const clearSessions = useCallback(async (preserveCurrent = true) => {
        try {
            if (sessions.length === 0) return true;

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            let query = supabase
                .from('chat_sessions')
                .delete()
                .eq('user_id', user.id);

            if (preserveCurrent && currentSessionId) {
                query = query.neq('id', currentSessionId);
            }

            const { error } = await query;
            if (error) throw error;

            if (preserveCurrent && currentSessionId) {
                setSessions(prev => prev.filter(s => s.id === currentSessionId));
            } else {
                setSessions([]);
                setCurrentSessionId(null);
                setCurrentSession(null as unknown as ChatSession);
            }

            toast.success(preserveCurrent ? 'Other sessions cleared' : 'All sessions cleared');
            logger.info('Sessions cleared', { preserveCurrent });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [currentSessionId, sessions, setCurrentSession]);

    const cleanupInactiveSessions = useCallback(async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('chat_sessions')
                .delete()
                .eq('user_id', user.id)
                .lt('last_accessed', thirtyDaysAgo.toISOString())
                .neq('id', currentSessionId || '')
                .select();

            if (error) throw error;

            const deletedCount = data?.length || 0;
            if (deletedCount > 0) {
                setSessions(prev => prev.filter(s => {
                    const lastAccessed = new Date(s.updatedAt);
                    return s.id === currentSessionId || lastAccessed >= thirtyDaysAgo;
                }));

                toast.success(`Cleaned up ${deletedCount} inactive session${deletedCount === 1 ? '' : 's'}`);
                logger.info('Inactive sessions cleaned up', { count: deletedCount });
            }

            return deletedCount;
        } catch (error) {
            handleError(error);
            return 0;
        }
    }, [currentSessionId]);

    useEffect(() => {
        refreshSessions();
    }, [refreshSessions]);

    return {
        sessions,
        currentSessionId,
        isLoading,
        refreshSessions,
        createSession,
        switchSession,
        deleteSession,
        clearSessions,
        cleanupInactiveSessions
    };
}
