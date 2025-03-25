
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

// Define a simplified raw database record type that avoids recursive types
interface RawSessionData {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  archived: boolean;
  metadata: any; // Explicitly use any to break recursion
  user_id: string | null;
}

/**
 * Maps raw database data to a Session object, breaking type recursion
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
    metadata: rawData.metadata as any, // Force break type recursion
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

    // Explicitly cast to RawSessionData[] to break recursive type analysis
    const rawData = data as any as RawSessionData[];
    
    // Get message counts for each session and map to Session objects
    const sessionsWithCounts = await Promise.all(rawData.map(async (session) => {
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('chat_session_id', session.id);
      
      if (countError) {
        logger.warn('Failed to get message count', { error: countError, sessionId: session.id });
      }
      
      // Map to Session object using the helper function
      return mapToSession(session, count || 0);
    }));
    
    logger.info('Sessions fetched', { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}
