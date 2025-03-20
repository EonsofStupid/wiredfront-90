import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
/**
 * Updates an existing chat session
 */
export async function updateSession(sessionId, params) {
    try {
        const { error } = await supabase
            .from('chat_sessions')
            .update({
            ...(params.title && { title: params.title }),
            ...(params.is_active !== undefined && { is_active: params.is_active }),
            ...(params.metadata && { metadata: params.metadata }),
            last_accessed: new Date().toISOString()
        })
            .eq('id', sessionId);
        if (error)
            throw error;
        logger.info('Updated session', { sessionId });
        return { success: true, sessionId };
    }
    catch (error) {
        logger.error('Failed to update session', { error, sessionId });
        return { success: false, error };
    }
}
/**
 * Updates the last_accessed timestamp for a session
 */
export async function switchToSession(sessionId) {
    try {
        // Update the session's last_accessed timestamp
        const { error } = await supabase
            .from('chat_sessions')
            .update({ last_accessed: new Date().toISOString() })
            .eq('id', sessionId);
        if (error)
            throw error;
        logger.info('Switched to session', { sessionId });
        return { success: true, sessionId };
    }
    catch (error) {
        logger.error('Failed to switch session', { error, sessionId });
        return { success: false, error };
    }
}
