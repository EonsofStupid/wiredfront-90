
import { supabase } from '@/integrations/supabase/client';
import { CreateSessionParams, SessionOperationResult, UpdateSessionParams } from '@/types/sessions';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../chat/LoggingService';

/**
 * Fetch all sessions for the current user
 */
export async function fetchUserSessions() {
  try {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userAuth.user.id)
      .eq('is_active', true)
      .order('last_accessed', { ascending: false });

    if (error) {
      logger.error('Error fetching sessions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error in fetchUserSessions:', error);
    throw error;
  }
}

/**
 * Create a new chat session
 */
export async function createChatSession(params: CreateSessionParams = {}): Promise<SessionOperationResult> {
  try {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const sessionId = uuidv4();
    const now = new Date().toISOString();
    
    const { error } = await supabase.from('chat_sessions').insert({
      id: sessionId,
      user_id: userAuth.user.id,
      title: params.title || 'New Chat',
      created_at: now,
      last_accessed: now,
      is_active: true,
      message_count: 0,
      metadata: params.metadata || {}
    });

    if (error) {
      logger.error('Error creating session:', error);
      return { success: false, error };
    }

    return { success: true, sessionId };
  } catch (error) {
    logger.error('Error in createChatSession:', error);
    return { success: false, error };
  }
}

/**
 * Update an existing chat session
 */
export async function updateChatSession(
  sessionId: string, 
  params: UpdateSessionParams
): Promise<SessionOperationResult> {
  try {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const updates: Record<string, any> = {
      last_accessed: new Date().toISOString(),
    };

    if (params.title !== undefined) updates.title = params.title;
    if (params.is_active !== undefined) updates.is_active = params.is_active;
    if (params.metadata !== undefined) updates.metadata = params.metadata;

    const { error } = await supabase
      .from('chat_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', userAuth.user.id);

    if (error) {
      logger.error('Error updating session:', error);
      return { success: false, error };
    }

    return { success: true, sessionId };
  } catch (error) {
    logger.error('Error in updateChatSession:', error);
    return { success: false, error };
  }
}

/**
 * Archive a chat session
 */
export async function archiveChatSession(sessionId: string): Promise<SessionOperationResult> {
  return updateChatSession(sessionId, { is_active: false });
}

/**
 * Switch to a specific session (mark as recently accessed)
 */
export async function switchToSession(sessionId: string): Promise<SessionOperationResult> {
  return updateChatSession(sessionId, {});
}

/**
 * Clear all chat sessions (except optionally the current one)
 */
export async function clearChatSessions(preserveSessionId: string | null = null): Promise<SessionOperationResult & { count?: number }> {
  try {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    let query = supabase
      .from('chat_sessions')
      .update({ is_active: false })
      .eq('user_id', userAuth.user.id)
      .eq('is_active', true);

    if (preserveSessionId) {
      query = query.neq('id', preserveSessionId);
    }

    const { error, count } = await query;

    if (error) {
      logger.error('Error clearing sessions:', error);
      return { success: false, error };
    }

    return { success: true, count };
  } catch (error) {
    logger.error('Error in clearChatSessions:', error);
    return { success: false, error };
  }
}

/**
 * Cleanup inactive chat sessions (older than 30 days)
 */
export async function cleanupInactiveChatSessions(): Promise<SessionOperationResult & { count?: number }> {
  try {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    const { error, count } = await supabase
      .from('chat_sessions')
      .update({ is_active: false })
      .eq('user_id', userAuth.user.id)
      .eq('is_active', true)
      .lt('last_accessed', cutoffDate);

    if (error) {
      logger.error('Error cleaning up sessions:', error);
      return { success: false, error };
    }

    return { success: true, count };
  } catch (error) {
    logger.error('Error in cleanupInactiveChatSessions:', error);
    return { success: false, error };
  }
}
