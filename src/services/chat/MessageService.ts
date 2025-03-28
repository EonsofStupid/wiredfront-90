
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageCreateParams } from '@/types/chat/message';
import { MessageType, MessageStatus, MessageRole } from '@/types/chat/enums';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './LoggingService';
import { messageTypeToString, stringToMessageType } from '@/components/chat/types/enums-mapper';

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
    
    // Convert MessageType enum to string for database
    const dbMessageType = params.type ? messageTypeToString(params.type) : 'text';
    const dbMessageStatus = 'sent'; // Default status
    
    const message = {
      id: messageId,
      role: params.role,
      content: params.content,
      type: dbMessageType,
      user_id: userData.user.id,
      conversation_id: params.conversation_id, // Primary reference
      chat_session_id: params.conversation_id, // For backward compatibility
      metadata: params.metadata || {},
      created_at: now,
      updated_at: now,
      last_accessed: now,
      parent_message_id: params.parent_message_id,
      status: dbMessageStatus,
      retry_count: 0
    };
    
    // Insert into the chat_messages table
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info('Message created', { messageId });
    
    // Convert database record to Message type
    const resultMessage: Message = {
      id: data.id,
      role: data.role as MessageRole,
      content: data.content,
      type: stringToMessageType(data.type),
      user_id: data.user_id,
      conversation_id: data.conversation_id || data.chat_session_id,
      chat_session_id: data.chat_session_id,
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_accessed: data.last_accessed || now,
      parent_message_id: data.parent_message_id,
      message_status: data.status as MessageStatus || MessageStatus.Sent,
      is_minimized: false,
      position: {},
      window_state: {},
      retry_count: data.retry_count || 0
    };
    
    return resultMessage;
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
    // Convert types for database if needed
    const dbUpdates: any = { ...updates };
    if (updates.type) {
      dbUpdates.type = messageTypeToString(updates.type);
    }
    if (updates.message_status) {
      dbUpdates.status = updates.message_status;
      delete dbUpdates.message_status;
    }
    
    const { error } = await supabase
      .from('chat_messages')
      .update({
        ...dbUpdates,
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
    
    // Convert database records to Message type
    const messages: Message[] = data.map(msg => ({
      id: msg.id,
      role: msg.role as MessageRole,
      content: msg.content,
      type: stringToMessageType(msg.type),
      user_id: msg.user_id,
      conversation_id: msg.conversation_id || msg.chat_session_id,
      chat_session_id: msg.chat_session_id,
      metadata: msg.metadata || {},
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      last_accessed: msg.last_accessed || msg.created_at,
      parent_message_id: msg.parent_message_id,
      message_status: msg.status as MessageStatus || MessageStatus.Received,
      is_minimized: false,
      position: {},
      window_state: {},
      retry_count: msg.retry_count || 0
    }));
    
    return messages;
  } catch (error) {
    logger.error('Failed to fetch conversation messages', { error, conversationId });
    return [];
  }
};
