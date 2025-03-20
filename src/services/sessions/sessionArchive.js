import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
/**
 * Archives a session by setting is_active to false
 */
export async function archiveSession(sessionId) {
    try {
        const { error } = await supabase
            .from('chat_sessions')
            .update({ is_active: false })
            .eq('id', sessionId);
        if (error)
            throw error;
        logger.info('Archived session', { sessionId });
        return { success: true, sessionId };
    }
    catch (error) {
        logger.error('Failed to archive session', { error, sessionId });
        return { success: false, error };
    }
}
