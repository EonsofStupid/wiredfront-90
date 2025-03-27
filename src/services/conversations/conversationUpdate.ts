
import { supabase } from '@/integrations/supabase/client';
import { UpdateConversationParams, ConversationOperationResult } from '@/types/conversations';
import { logger } from '@/services/chat/LoggingService';

/**
 * Updates an existing chat conversation
 */
export async function updateConversation(
  conversationId: string, 
  params: UpdateConversationParams
): Promise<ConversationOperationResult> {
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
      .from('chat_conversations')
      .update(updateData)
      .eq('id', conversationId);
      
    if (error) throw error;
    
    logger.info('Updated conversation', { conversationId });
    return { success: true, conversationId };
  } catch (error) {
    logger.error('Failed to update conversation', { error });
    return { success: false, error };
  }
}

/**
 * Updates the last_accessed timestamp for a conversation
 */
export async function switchToConversation(conversationId: string): Promise<ConversationOperationResult> {
  try {
    // Update the conversation's last_accessed timestamp
    const { error } = await supabase
      .from('chat_conversations')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', conversationId);
      
    if (error) throw error;
    
    logger.info('Switched to conversation', { conversationId });
    return { success: true, conversationId };
  } catch (error) {
    logger.error('Failed to switch conversation', { error });
    return { success: false, error };
  }
}
