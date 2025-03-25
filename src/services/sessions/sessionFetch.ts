
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Fetches all sessions for the current authenticated user
 */
export async function fetchUserSessions(): Promise<Session[]> {
  try {
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
        is_active,
        metadata,
        user_id
      `)
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    // Get message counts for each session
    const sessionsWithCounts = await Promise.all((data || []).map(async (session) => {
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('chat_session_id', session.id);
      
      if (countError) {
        logger.warn('Failed to get message count', { error: countError, sessionId: session.id });
      }
      
      return {
        ...session,
        message_count: count || 0
      };
    }));
    
    logger.info('Sessions fetched', { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}
