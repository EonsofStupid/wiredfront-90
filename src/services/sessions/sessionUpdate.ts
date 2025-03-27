
import { supabase } from '@/integrations/supabase/client';
import { UpdateSessionParams, SessionOperationResult } from '@/types/sessions';
import { logger } from '@/services/chat/LoggingService';

/**
 * Updates an existing chat session
 */
export async function updateSession(
  sessionId: string, 
  params: UpdateSessionParams
): Promise<SessionOperationResult> {
  try {
    // Prepare update object with proper types for Supabase
    const updateData: Record<string, any> = {};
    
    if (params.title) {
      updateData.title = params.title;
    }
    
    if (params.archived !== undefined) {
      updateData.archived = params.archived;
    }
    
    if (params.metadata) {
      // Convert any complex objects in metadata to strings for JSON compatibility
      const processedMetadata = Object.fromEntries(
        Object.entries(params.metadata)
          .map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v])
      );
      updateData.metadata = processedMetadata;
    }
    
    // Always update last_accessed
    updateData.last_accessed = new Date().toISOString();
    
    const { error } = await supabase
      .from('chat_sessions')
      .update(updateData)
      .eq('id', sessionId);
      
    if (error) throw error;
    
    logger.info('Updated session', { sessionId });
    return { success: true, sessionId };
  } catch (error) {
    logger.error('Failed to update session', { error });
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
    logger.error('Failed to switch session', { error });
    return { success: false, error };
  }
}
