
import { supabase } from '@/integrations/supabase/client';
import { SessionOperationResult } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Archives a session by setting archived to true
 */
export async function archiveSession(sessionId: string): Promise<SessionOperationResult> {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ archived: true })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Archived session', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to archive session', { error, sessionId });
    return { success: false, error };
  }
}
