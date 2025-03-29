
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/chat/conversation';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';
import { logger } from './LoggingService';

/**
 * Fetch all conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('last_accessed', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert database mode to ChatMode enum
    const conversations = data.map((item: any) => ({
      ...item,
      mode: EnumUtils.databaseStringToChatMode(item.mode)
    })) as Conversation[];
    
    return conversations;
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return [];
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (params: Partial<Conversation> = {}): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const now = new Date().toISOString();
    
    // Convert ChatMode enum to database string if needed
    const dbMode = params.mode ? 
      EnumUtils.chatModeForDatabase(
        typeof params.mode === 'string' ? 
          EnumUtils.stringToChatMode(params.mode) : 
          params.mode
      ) : 'chat';
    
    const conversationData = {
      id: params.id || crypto.randomUUID(),
      title: params.title || 'New Conversation',
      user_id: userData.user.id,
      created_at: now,
      last_accessed: now,
      updated_at: now,
      message_count: 0,
      archived: false,
      metadata: params.metadata || {},
      project_id: params.project_id || null,
      mode: dbMode,
      provider_id: params.provider_id || null,
      context: params.context || {}
    };
    
    const { error } = await supabase
      .from('chat_conversations')
      .insert(conversationData);
    
    if (error) {
      throw error;
    }
    
    return conversationData.id;
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return null;
  }
};

/**
 * Update a conversation
 */
export const updateConversation = async (
  id: string, 
  updates: Partial<Conversation>
): Promise<boolean> => {
  try {
    // Convert ChatMode enum to database string if needed
    const dbUpdates: any = { ...updates };
    
    if (updates.mode) {
      dbUpdates.mode = typeof updates.mode === 'string' ? 
        updates.mode : 
        EnumUtils.chatModeForDatabase(updates.mode);
    }
    
    const { error } = await supabase
      .from('chat_conversations')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to update conversation', { error, id });
    return false;
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (id: string): Promise<boolean> => {
  try {
    // First delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('conversation_id', id);
    
    if (messagesError) {
      logger.warn('Failed to delete conversation messages', { error: messagesError });
    }
    
    // Then delete the conversation
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to delete conversation', { error, id });
    return false;
  }
};

/**
 * Archive a conversation
 */
export const archiveConversation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_conversations')
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to archive conversation', { error, id });
    return false;
  }
};

// Export all functions as a service object
export const ConversationService = {
  fetchConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  archiveConversation
};
