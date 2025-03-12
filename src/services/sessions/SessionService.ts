import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';

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

    // Transform data to include message_count
    const sessionsWithCounts = (data || []).map(session => ({
      ...session,
      message_count: 0 // Default value until we implement message counting
    }));
    
    logger.info('Sessions fetched', { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    throw error;
  }
}

export async function createNewSession(): Promise<string> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const sessionId = uuidv4();
    const now = new Date().toISOString();
    
    // Create a new session
    const { error } = await supabase
      .from('chat_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        title: `Chat ${new Date().toLocaleString()}`,
        created_at: now,
        last_accessed: now,
        is_active: true,
        metadata: {}
      });

    if (error) throw error;
    
    logger.info('New session created', { sessionId });
    return sessionId;
  } catch (error) {
    logger.error('Failed to create session', { error });
    throw error;
  }
}

export async function switchToSession(sessionId: string): Promise<void> {
  try {
    // Update the session's last_accessed timestamp
    const { error } = await supabase
      .from('chat_sessions')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Switched to session', { sessionId });
  } catch (error) {
    logger.error('Failed to switch session', { error, sessionId });
    throw error;
  }
}

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
