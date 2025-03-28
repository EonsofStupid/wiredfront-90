
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageCreateParams, MessageUpdateParams } from '@/types/chat/message';
import { MessageType, MessageStatus, MessageRole } from '@/types/chat/enums';
import { logger } from './LoggingService';
import { EnumUtils } from '@/lib/enums';
import { 
  createMessage, 
  createMessageFromDatabase, 
  prepareMessageForDatabase 
} from './MessageFactory';

/**
 * Create a new message in the database
 */
export const createMessageInDb = async (params: MessageCreateParams): Promise<Message | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    // Create message with consistent structure using factory
    const message = createMessage({
      ...params,
      user_id: userData.user.id
    });
    
    // Prepare for database insertion
    const dbMessage = prepareMessageForDatabase(message);
    
    // Insert into the chat_messages table
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(dbMessage)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info('Message created', { messageId: message.id });
    
    // Convert database record to Message type
    return createMessageFromDatabase(data);
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
      dbUpdates.type = EnumUtils.messageTypeToString(updates.type);
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
    
    // Convert database records to Message type using factory
    const messages: Message[] = data.map(msg => createMessageFromDatabase(msg));
    
    return messages;
  } catch (error) {
    logger.error('Failed to fetch conversation messages', { error, conversationId });
    return [];
  }
};

// Export everything as a single MessageService object
export const MessageService = {
  createMessage: createMessageInDb,
  updateMessage,
  deleteMessage,
  fetchConversationMessages
};
