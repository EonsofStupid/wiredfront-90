import { supabase } from '@/integrations/supabase/client';
import { Session, SupabaseSession, fromSupabaseSession } from '@/types/chat';
import { Json } from '@/integrations/supabase/types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Safely parses a JSON field from the database
 */
const parseJsonField = (field: Json | null): Record<string, any> => {
  if (field === null) return {};
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (error) {
      logger.warn('Failed to parse JSON field', { error });
      return {};
    }
  }
  if (typeof field === 'object' && !Array.isArray(field) && field !== null) {
    return field as Record<string, any>;
  }
  return {};
};

/**
 * Transforms a database session into an application session
 */
const transformDBSession = (rawSession: SupabaseSession): Session => {
  const metadata = parseJsonField(rawSession.metadata);
  const context = parseJsonField(rawSession.context);

  return {
    id: rawSession.id,
    title: rawSession.title,
    created_at: rawSession.created_at,
    last_accessed: rawSession.last_accessed,
    message_count: rawSession.message_count,
    is_active: rawSession.is_active,
    metadata,
    user_id: rawSession.user_id,
    mode: rawSession.mode,
    provider_id: rawSession.provider_id,
    project_id: rawSession.project_id,
    tokens_used: rawSession.tokens_used,
    context
  };
};

/**
 * Fetches all sessions for the current authenticated user
 */
export async function fetchUserSessions(): Promise<Session[]> {
  try {
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('User not authenticated');

    // Fetch chat sessions for the current user
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    // Transform each session
    const sessions = data.map(fromSupabaseSession).map(transformDBSession);

    logger.info('Sessions fetched successfully', { 
      count: sessions.length,
      userId: user.id 
    });

    return sessions;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}

/**
 * Fetches all sessions (admin only)
 */
export async function fetchSessions(): Promise<Session[]> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    // Transform each session
    const sessions = data.map(fromSupabaseSession).map(transformDBSession);

    logger.info('All sessions fetched successfully', { 
      count: sessions.length 
    });

    return sessions;
  } catch (error) {
    logger.error('Failed to fetch all sessions', { error });
    throw error;
  }
}
