import { supabase } from '@/integrations/supabase/client';
import { ConversationOperationResult } from '@/types/conversations';
import { logger } from '@/services/chat/LoggingService';
import { clearMiddlewareStorage } from '@/components/chat/store/chatStore';

/**
 * Deletes inactive conversations, keeping the current conversation and recent ones
 */
export async function cleanupConversations(currentConversationId: string): Promise<number> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Keep current conversation and the 5 most recently updated conversations
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, last_accessed')
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data returned from database');
    }

    // Keep the current conversation and the 5 most recent ones
    const conversationsToKeep = new Set<string>([
      currentConversationId, 
      ...data.slice(0, 5).map(s => s.id)
    ]);
    
    const conversationsToDelete = data
      .filter(s => !conversationsToKeep.has(s.id))
      .map(s => s.id);

    if (conversationsToDelete.length === 0) {
      return 0;
    }

    // Delete inactive conversations
    const { error: deleteError } = await supabase
      .from('chat_conversations')
      .delete()
      .in('id', conversationsToDelete);

    if (deleteError) throw deleteError;

    // Delete associated messages
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .in('conversation_id', conversationsToDelete);

    if (messagesError) {
      logger.warn('Failed to delete some associated messages', { error: messagesError });
    }

    // Clear Zustand persistence for deleted conversations
    conversationsToDelete.forEach(conversationId => {
      localStorage.removeItem(`chat-conversation-${conversationId}`);
    });

    logger.info('Cleaned up inactive conversations', { count: conversationsToDelete.length });
    return conversationsToDelete.length;
  } catch (error) {
    logger.error('Failed to clean up conversations', { error });
    throw error;
  }
}

/**
 * Clears all conversations for the current user except the specified one
 */
export async function clearAllConversations(currentConversationId: string | null = null): Promise<ConversationOperationResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Start a transaction to ensure both operations succeed or fail together
    let query = supabase
      .from('chat_conversations')
      .delete();
    
    // If currentConversationId is provided and not null, exclude it from deletion
    if (currentConversationId) {
      query = query.neq('id', currentConversationId);
      
      // Delete messages for all conversations except the current one
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', user.id)
        .neq('conversation_id', currentConversationId);
      
      if (messagesError) {
        logger.warn('Failed to delete some associated messages', { error: messagesError });
      }
      
      // Now delete the conversations (except current)
      const { error, count } = await query.eq('user_id', user.id);
      
      if (error) throw error;
      
      // Clear Zustand persistence for all conversations except current
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat-conversation-') && !key.includes(currentConversationId)) {
          localStorage.removeItem(key);
        }
      });
      
      logger.info('Cleared conversations except current', { 
        count, 
        preservedConversationId: currentConversationId 
      });
    } else {
      // Delete all messages for the user
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', user.id);
      
      if (messagesError) {
        logger.warn('Failed to delete associated messages', { error: messagesError });
      }
      
      // Delete all conversations for the user
      const { error } = await query.eq('user_id', user.id);
      
      if (error) throw error;
      
      // Clear all Zustand persistence
      clearMiddlewareStorage();
      
      logger.info('Cleared all conversations');
    }
    
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear conversations', { error });
    return { success: false, error };
  }
}
