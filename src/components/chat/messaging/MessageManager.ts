
import { create } from 'zustand';
import { Message } from '@/components/chat/types/chat/message';
import { MessageRole, MessageStatus, MessageType } from '@/components/chat/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { EnumUtils } from '@/lib/enums';
import { 
  createMessage, 
  createUserMessage, 
  createAssistantMessage, 
  createSystemMessage, 
  createErrorMessage, 
  createMessageFromDatabase 
} from '@/services/chat/MessageFactory';

interface MessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  sendMessage: (
    content: string, 
    conversationId: string, 
    role?: MessageRole, 
    type?: MessageType, 
    metadata?: Record<string, any>, 
    parentMessageId?: string
  ) => Promise<string>;
  updateMessage: (messageId: string, content: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  fetchMessages: (conversationId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message: Message) => {
    logger.info('Adding message', { messageId: message.id, role: message.role });
    
    set(state => ({
      messages: [...state.messages, message]
    }));
  },
  
  removeMessage: (id: string) => {
    logger.info('Removing message', { messageId: id });
    
    set(state => ({
      messages: state.messages.filter(m => m.id !== id)
    }));
  },
  
  clearMessages: () => {
    logger.info('Clearing all messages');
    
    set({ messages: [] });
  },
  
  sendMessage: async (
    content: string, 
    conversationId: string, 
    role: MessageRole = MessageRole.User, 
    type: MessageType = MessageType.Text, 
    metadata: Record<string, any> = {}, 
    parentMessageId?: string
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }

      // Create message using factory function
      const message = createMessage({
        role,
        content,
        conversation_id: conversationId,
        type,
        metadata,
        parent_message_id: parentMessageId,
        user_id: userData.user.id
      });
      
      // Insert message into database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          role: message.role,
          content: message.content,
          type: EnumUtils.messageTypeToString(message.type),
          user_id: message.user_id,
          conversation_id: message.conversation_id,
          chat_session_id: message.chat_session_id,
          metadata: message.metadata,
          created_at: message.created_at,
          updated_at: message.updated_at,
          last_accessed: message.last_accessed,
          parent_message_id: message.parent_message_id,
          status: message.message_status,
          retry_count: message.retry_count
        });
      
      if (error) {
        throw error;
      }
      
      // Add message to local state
      get().addMessage(message);
      
      return message.id;
    } catch (error) {
      logger.error('Failed to send message', { error });
      throw error;
    }
  },
  
  updateMessage: async (messageId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      set(state => ({
        messages: state.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content, updated_at: new Date().toISOString() } 
            : msg
        )
      }));
      
      return true;
    } catch (error) {
      logger.error('Failed to update message', { error });
      return false;
    }
  },
  
  deleteMessage: async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        throw error;
      }
      
      // Remove from local state
      get().removeMessage(messageId);
      
      return true;
    } catch (error) {
      logger.error('Failed to delete message', { error });
      return false;
    }
  },
  
  fetchMessages: async (conversationId: string) => {
    try {
      logger.info('Fetching messages for conversation', { conversationId });
      
      // Query using the conversation_id field for consistency
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        set({ messages: [] });
        return;
      }
      
      // Transform to our Message type with proper conversions using factory
      const messages: Message[] = data.map(msg => createMessageFromDatabase(msg));
      
      logger.info('Fetched messages', { count: messages.length });
      set({ messages });
    } catch (error) {
      logger.error('Failed to fetch conversation messages', { error, conversationId });
      // Set an error message for the user
      const errorMessage = createSystemMessage(
        'Failed to load messages. Please try again.',
        conversationId,
        { error: true }
      );
      
      set({ messages: [errorMessage] });
    }
  }
}));
