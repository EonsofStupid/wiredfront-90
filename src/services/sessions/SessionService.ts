import { supabase } from '@/integrations/supabase/client';
import { Session, SessionOperationResult, CreateSessionParams, UpdateSessionParams } from '@/types/sessions';
import { v4 as uuidv4 } from 'uuid';
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

/**
 * Creates a new chat session
 */
export async function createNewSession(params?: CreateSessionParams): Promise<SessionOperationResult> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const sessionId = uuidv4();
    const now = new Date().toISOString();
    
    // Create a new session
    const { error } = await supabase
      .from('chat_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        title: params?.title || `Chat ${new Date().toLocaleString()}`,
        created_at: now,
        last_accessed: now,
        is_active: true,
        metadata: params?.metadata || {}
      });

    if (error) throw error;
    
    logger.info('New session created', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to create session', { error });
    return { success: false, error };
  }
}

/**
 * Updates an existing chat session
 */
export async function updateSession(
  sessionId: string, 
  params: UpdateSessionParams
): Promise<SessionOperationResult> {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        ...(params.title && { title: params.title }),
        ...(params.is_active !== undefined && { is_active: params.is_active }),
        ...(params.metadata && { metadata: params.metadata }),
        last_accessed: new Date().toISOString()
      })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Updated session', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to update session', { error, sessionId });
    return { success: false, error };
  }
}

/**
 * Updates the last_accessed timestamp for a session
 */
export async function switchToSession(sessionId: string): Promise<SessionOperationResult> {
  try {
    // Update the session's last_accessed timestamp
    const { error } = await supabase
      .from('chat_sessions')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Switched to session', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to switch session', { error, sessionId });
    return { success: false, error };
  }
}

/**
 * Archives a session by setting is_active to false
 */
export async function archiveSession(sessionId: string): Promise<SessionOperationResult> {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Archived session', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to archive session', { error, sessionId });
    return { success: false, error };
  }
}

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
 * Clears all sessions for the current user except the active one
 */
export async function clearAllSessions(currentSessionId: string): Promise<SessionOperationResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Delete all sessions except the current one
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', user.id)
      .neq('id', currentSessionId);

    if (error) throw error;
    
    logger.info('Cleared all sessions', { currentSessionId });
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear sessions', { error });
    return { success: false, error };
  }
}
