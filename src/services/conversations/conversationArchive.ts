
import { supabase } from '@/integrations/supabase/client';
import { ConversationOperationResult } from '@/types/conversations';
import { logger } from '@/services/chat/LoggingService';

/**
 * Archives a conversation by setting archived to true
 */
export async function archiveConversation(conversationId: string): Promise<ConversationOperationResult> {
  try {
    const { error } = await supabase
      .from('chat_conversations')
      .update({ archived: true })
      .eq('id', conversationId);
      
    if (error) throw error;
    
    logger.info('Archived conversation', { conversationId });
    return { success: true, conversationId };
  } catch (error) {
    logger.error('Failed to archive conversation', { error, conversationId });
    return { success: false, error };
  }
}
