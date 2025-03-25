
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

// Define a type for the raw database record to prevent excessive type depth
interface RawSessionData {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  archived: boolean;
  metadata: any; // Use any here to break the recursive Json type
  user_id: string | null;
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

    if (!data) {
      return [];
    }

    // Get message counts for each session
    // Force-cast data to RawSessionData[] to break recursive type analysis
    const rawData = data as unknown as RawSessionData[];
    
    const sessionsWithCounts = await Promise.all(rawData.map(async (session) => {
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('chat_session_id', session.id);
      
      if (countError) {
        logger.warn('Failed to get message count', { error: countError, sessionId: session.id });
      }
      
      // Create a new object with explicit typing to avoid deep type analysis
      const sessionObject: Session = {
        id: session.id,
        title: session.title,
        created_at: session.created_at,
        last_accessed: session.last_accessed,
        message_count: count || 0,
        is_active: !session.archived,
        archived: session.archived,
        metadata: session.metadata,
        user_id: session.user_id || undefined
      };
      
      return sessionObject;
    }));
    
    logger.info('Sessions fetched', { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}
