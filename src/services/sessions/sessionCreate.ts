
import { supabase } from '@/integrations/supabase/client';
import { CreateSessionParams, SessionOperationResult } from '@/types/sessions';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';

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
    
    // Extract mode from metadata if available
    const mode = params?.metadata?.mode || 'standard';
    const providerId = params?.metadata?.providerId;
    
    // Generate a better default title based on mode
    let defaultTitle = params?.title;
    if (!defaultTitle) {
      const dateStr = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      
      switch (mode) {
        case 'editor':
          defaultTitle = `Code Session (${dateStr})`;
          break;
        case 'image':
          defaultTitle = `Image Generation (${dateStr})`;
          break;
        default:
          defaultTitle = `Chat ${dateStr}`;
      }
    }
    
    // Create a new session
    const { error } = await supabase
      .from('chat_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        title: defaultTitle,
        created_at: now,
        last_accessed: now,
        is_active: true,
        metadata: {
          ...params?.metadata,
          mode,
          providerId
        }
      });

    if (error) throw error;
    
    logger.info('New session created', { 
      sessionId, 
      title: defaultTitle,
      mode,
      providerId
    });
    
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to create session', { error });
    return { success: false, error };
  }
}
