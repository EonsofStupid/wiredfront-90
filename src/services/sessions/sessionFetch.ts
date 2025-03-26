
import { Session } from '@/types/sessions';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

/**
 * Fetch all sessions for the current user
 */
export async function fetchAllSessions(): Promise<Session[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('No authenticated user found when fetching sessions');
      return [];
    }
    
    // Fetch sessions from Supabase
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('last_accessed', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    // Format the sessions to match our Session type
    const sessions: Session[] = data.map(session => ({
      id: session.id,
      title: session.title || 'Untitled Chat',
      created_at: session.created_at,
      last_accessed: session.last_accessed,
      message_count: session.message_count || 0,
      is_active: true,
      archived: session.archived || false,
      metadata: session.metadata || {},
      user_id: session.user_id
    }));
    
    logger.info('Successfully fetched sessions', { count: sessions.length });
    
    return sessions;
  } catch (error) {
    logger.error('Error fetching sessions', { error });
    throw error;
  }
}

/**
 * Fetch a specific session by ID
 */
export async function fetchSessionById(sessionId: string): Promise<Session | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Format the session to match our Session type
    const session: Session = {
      id: data.id,
      title: data.title || 'Untitled Chat',
      created_at: data.created_at,
      last_accessed: data.last_accessed,
      message_count: data.message_count || 0,
      is_active: true,
      archived: data.archived || false,
      metadata: data.metadata || {},
      user_id: data.user_id
    };
    
    logger.info('Successfully fetched session', { sessionId });
    
    return session;
  } catch (error) {
    logger.error('Error fetching session', { error, sessionId });
    throw error;
  }
}
