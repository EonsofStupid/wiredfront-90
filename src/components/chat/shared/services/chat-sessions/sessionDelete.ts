
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete all sessions from the database, with option to preserve a specific session
 */
export async function clearAllSessions(preserveSessionId: string | null = null): Promise<{success: boolean, error?: Error}> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('No authenticated user found when clearing sessions');
      return { success: false, error: new Error('User not authenticated') };
    }
    
    let query = supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', user.id);
    
    if (preserveSessionId) {
      query = query.neq('id', preserveSessionId);
    }
    
    const { error } = await query;
    
    if (error) throw error;
    
    logger.info('Cleared sessions', { preserveSessionId });
    return { success: true };
  } catch (error) {
    logger.error('Error clearing all sessions', { error });
    
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to clear sessions')
    };
  }
}

/**
 * Archive a session instead of deleting it
 */
export async function archiveSessionById(sessionId: string): Promise<{success: boolean, error?: Error}> {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ archived: true })
      .eq('id', sessionId);
    
    if (error) throw error;
    
    logger.info('Archiving session', { sessionId });
    return { success: true };
  } catch (error) {
    logger.error('Error archiving session', { error });
    
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to archive session')
    };
  }
}
