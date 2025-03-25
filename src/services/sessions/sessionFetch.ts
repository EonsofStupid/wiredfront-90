
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';
import { toast } from 'sonner';
import { logger } from '../chat/LoggingService';

/**
 * Fetch all chat sessions for the current user
 */
export const fetchUserSessions = async (): Promise<Session[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('No authenticated user found when fetching sessions');
      return [];
    }
    
    // Get active sessions (not archived)
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        id, 
        title,
        message_count,
        created_at,
        last_accessed,
        archived,
        mode,
        provider_id,
        metadata
      `)
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('last_accessed', { ascending: false });
    
    if (error) {
      logger.error('Error fetching chat sessions', { error });
      return [];
    }
    
    // Convert to Session objects
    const sessions = data.map(session => ({
      id: session.id,
      title: session.title || 'Untitled Chat',
      messageCount: session.message_count || 0,
      lastAccessed: new Date(session.last_accessed),
      createdAt: new Date(session.created_at),
      mode: session.mode || 'chat',
      providerId: session.provider_id,
      provider: session.metadata?.provider_name || undefined,
      isArchived: session.archived
    }));
    
    logger.info(`Fetched ${sessions.length} chat sessions`);
    return sessions;
  } catch (error) {
    logger.error('Failed to fetch chat sessions', { error });
    toast.error('Failed to load chat sessions');
    return [];
  }
};

// Additional session fetch functions can be exported from here...
