import { supabase } from '@/integrations/supabase/client';
import { SessionOperationResult } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Deletes inactive sessions, keeping the current session and recent ones
 */
export async function cleanupSessions(currentSessionId: string): Promise<number> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Keep current session and the 5 most recently updated sessions
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, last_accessed')
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data returned from database');
    }

    // Keep the current session and the 5 most recent ones
    const sessionsToKeep = new Set<string>([
      currentSessionId, 
      ...data.slice(0, 5).map(s => s.id)
    ]);
    
    const sessionsToDelete = data
      .filter(s => !sessionsToKeep.has(s.id))
      .map(s => s.id);

    if (sessionsToDelete.length === 0) {
      return 0;
    }

    // Delete inactive sessions
    const { error: deleteError } = await supabase
      .from('chat_sessions')
      .delete()
      .in('id', sessionsToDelete);

    if (deleteError) throw deleteError;

    logger.info('Cleaned up inactive sessions', { count: sessionsToDelete.length });
    return sessionsToDelete.length;
  } catch (error) {
    logger.error('Failed to clean up sessions', { error });
    throw error;
  }
}

/**
 * Clears all sessions for the current user except the specified one
 */
export async function clearAllSessions(currentSessionId: string | null = null): Promise<SessionOperationResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', user.id);
    
    // If currentSessionId is provided and not null, exclude it from deletion
    if (currentSessionId) {
      query = query.neq('id', currentSessionId);
    }
    
    const { error, count } = await query;

    if (error) throw error;
    
    logger.info('Cleared sessions', { 
      count: count, 
      preservedSessionId: currentSessionId || 'none' 
    });
    
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear sessions', { error });
    return { success: false, error };
  }
}
