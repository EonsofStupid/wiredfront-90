
import { Session } from '@/components/chat/chat-structure/chatsidebar/types/chatsessions';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { mapDbSessionToSession } from './mappers';

/**
 * Fetch all sessions for the current user
 */
export async function fetchUserSessions(): Promise<Session[]> {
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
    
    // Use the mapper to convert DB format to Session type
    const sessions: Session[] = data.map(session => mapDbSessionToSession(session));
    
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
    
    // Use the mapper to convert DB format to Session type
    const session: Session = mapDbSessionToSession(data);
    
    logger.info('Successfully fetched session', { sessionId });
    
    return session;
  } catch (error) {
    logger.error('Error fetching session', { error, sessionId });
    throw error;
  }
}
