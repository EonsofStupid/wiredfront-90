
import { create } from 'zustand';
import { Message } from '@/types/chat/message';
import { MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { stringToMessageType, messageTypeToString } from '../types/enums-mapper';

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

      const now = new Date().toISOString();
      const messageId = uuidv4();
      
      // Convert types for database
      const dbMessageType = messageTypeToString(type);
      
      // Create message to insert into database
      const messageData = {
        id: messageId,
        role,
        content,
        type: dbMessageType,
        user_id: userData.user.id,
        conversation_id: conversationId,
        chat_session_id: conversationId,
        metadata,
        created_at: now,
        updated_at: now,
        last_accessed: now,
        parent_message_id: parentMessageId,
        status: 'sent',
        retry_count: 0
      };
      
      // Insert message into database
      const { error } = await supabase
        .from('chat_messages')
        .insert(messageData);
      
      if (error) {
        throw error;
      }
      
      // Create message for local state
      const newMessage: Message = {
        id: messageId,
        role,
        content,
        type,
        user_id: userData.user.id,
        conversation_id: conversationId,
        chat_session_id: conversationId,
        metadata,
        created_at: now,
        updated_at: now,
        last_accessed: now,
        parent_message_id: parentMessageId,
        message_status: MessageStatus.Sent,
        is_minimized: false,
        position: {},
        window_state: {},
        retry_count: 0
      };
      
      // Add message to local state
      get().addMessage(newMessage);
      
      return messageId;
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
      
      // Transform to our Message type with proper conversions
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
      
      logger.info('Fetched messages', { count: messages.length });
      set({ messages });
    } catch (error) {
      logger.error('Failed to fetch conversation messages', { error, conversationId });
      // Set an error message for the user
      const errorMessage: Message = {
        id: uuidv4(),
        role: MessageRole.System,
        content: 'Failed to load messages. Please try again.',
        type: MessageType.System,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: conversationId,
        conversation_id: conversationId,
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: MessageStatus.Error,
        user_id: ''
      };
      
      set({ messages: [errorMessage] });
    }
  }
}));
