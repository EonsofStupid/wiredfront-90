
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Raw session data structure from database
 * Using a completely decoupled interface to prevent type recursion issues
 */
interface RawSessionData {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  archived: boolean;
  metadata: any; // Explicitly use any to break type recursion
  user_id: string | null;
}

/**
 * Clean mapping function to transform database records to application domain objects
 * This function handles type conversion and provides a clear separation between 
 * database schema and application domain model
 */
function mapToSession(rawData: RawSessionData, messageCount: number = 0): Session {
  return {
    id: rawData.id,
    title: rawData.title,
    created_at: rawData.created_at,
    last_accessed: rawData.last_accessed,
    message_count: messageCount,
    is_active: !rawData.archived,
    archived: rawData.archived,
    metadata: rawData.metadata, // Already typed as 'any' in the interface
    user_id: rawData.user_id || undefined
  };
}

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
        archived,
        metadata,
        user_id
      `)
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to our internal type to break recursive type chains
    // Use type assertion only at this boundary between external and internal types
    const rawSessions: RawSessionData[] = data.map(item => ({
      id: item.id,
      title: item.title,
      created_at: item.created_at,
      last_accessed: item.last_accessed,
      archived: item.archived,
      metadata: item.metadata,
      user_id: item.user_id
    }));
    
    // Get message counts for each session and map to final Session objects
    const sessionsWithCounts = await Promise.all(rawSessions.map(async (session) => {
      // Count messages for this session
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('chat_session_id', session.id);
      
      if (countError) {
        logger.warn('Failed to get message count', { error: countError, sessionId: session.id });
      }
      
      // Convert to domain model using the mapper function
      return mapToSession(session, count || 0);
    }));
    
    logger.info('Sessions fetched', { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}
