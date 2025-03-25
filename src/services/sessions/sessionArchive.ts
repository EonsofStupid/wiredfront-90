
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '../chat/LoggingService';

/**
 * Archive a chat session
 */
export const archiveSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('No authenticated user found when archiving session', { sessionId });
      throw new Error('You must be logged in to archive a session');
    }
    
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        archived: true,
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .eq('user_id', user.id);
    
    if (error) {
      logger.error('Error archiving chat session', { error, sessionId });
      throw error;
    }
    
    logger.info('Chat session archived', { sessionId });
    return true;
  } catch (error) {
    logger.error('Failed to archive chat session', { error, sessionId });
    toast.error('Failed to archive chat session');
    return false;
  }
};

/**
 * Restore an archived chat session
 */
export const restoreSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('No authenticated user found when restoring session', { sessionId });
      throw new Error('You must be logged in to restore a session');
    }
    
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        archived: false,
        updated_at: new Date().toISOString(),
        last_accessed: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', user.id);
    
    if (error) {
      logger.error('Error restoring chat session', { error, sessionId });
      throw error;
    }
    
    logger.info('Chat session restored', { sessionId });
    return true;
  } catch (error) {
    logger.error('Failed to restore chat session', { error, sessionId });
    toast.error('Failed to restore chat session');
    return false;
  }
};
