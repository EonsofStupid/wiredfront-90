
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageCreateParams } from '@/types/chat/message';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './LoggingService';

/**
 * Create a new message in the database
 */
export const createMessage = async (params: MessageCreateParams): Promise<Message | null> => {
  try {
    const now = new Date().toISOString();
    const messageId = uuidv4();
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const message: Partial<Message> = {
      id: messageId,
      role: params.role,
      content: params.content,
      type: params.type || 'text',
      user_id: userData.user.id,
      conversation_id: params.conversation_id, // Primary reference
      chat_session_id: params.conversation_id, // For backward compatibility
      metadata: params.metadata || {},
      created_at: now,
      updated_at: now,
      last_accessed: now,
      is_minimized: false,
      position: {},
      window_state: {},
      retry_count: 0,
      parent_message_id: params.parent_message_id,
    };
    
    // Insert into the new table name: chat_messages
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info('Message created', { messageId });
    
    return data as Message;
  } catch (error) {
    logger.error('Failed to create message', { error });
    return null;
  }
};

/**
 * Update an existing message
 */
export const updateMessage = async (messageId: string, updates: Partial<Message>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Message updated', { messageId });
    
    return true;
  } catch (error) {
    logger.error('Failed to update message', { error, messageId });
    return false;
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Message deleted', { messageId });
    
    return true;
  } catch (error) {
    logger.error('Failed to delete message', { error, messageId });
    return false;
  }
};

/**
 * Fetch messages for a conversation
 */
export const fetchConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    logger.info('Fetched conversation messages', { conversationId, count: data.length });
    
    return data as Message[];
  } catch (error) {
    logger.error('Failed to fetch conversation messages', { error, conversationId });
    return [];
  }
};
