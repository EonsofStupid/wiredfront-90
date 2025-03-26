import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageMetadata, MessageRole, MessageStatus } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { mapMessageToDbMessage, mapDbMessageToMessage } from '@/services/messages/mappers';
import { logger } from '@/services/chat/LoggingService';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

type MessageUpdates = Partial<Omit<Message, 'id' | 'metadata'>> & { 
  metadata?: Partial<MessageMetadata>; 
};

interface MessageActions {
  fetchSessionMessages: (sessionId: string) => Promise<void>;
  createUserMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createAssistantMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createSystemMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createErrorMessage: (content: string, sessionId: string) => Message;
  updateMessage: (messageId: string, updates: MessageUpdates) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: Message) => void;
}

export type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      messages: [],
      isLoading: false,
      error: null,

      // Actions
      fetchSessionMessages: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          // Fetch messages from Supabase
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_session_id', sessionId)
            .order('created_at', { ascending: true });
            
          if (error) throw error;
          
          // Map DB messages to application Message type
          const messages = data ? data.map(mapDbMessageToMessage) : [];
          
          set({ 
            messages, 
            isLoading: false 
          });
          
          logger.info('Messages fetched', { count: messages.length, sessionId });
        } catch (error) {
          logger.error('Failed to fetch messages', { error, sessionId });
          set({ error: error as Error, isLoading: false });
        }
      },

      createUserMessage: (content, sessionId, metadata = {}) => {
        const now = new Date();
        const messageId = uuidv4();
        
        const message: Message = {
          id: messageId,
          content,
          role: 'user',
          type: 'text',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          chat_session_id: sessionId,
          user_id: null, // Will be set by server
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now.toISOString(),
          retry_count: 0,
          message_status: 'sent',
          metadata: { ...metadata } // Create a fresh copy
        };
        
        // Add message to state
        set(state => ({
          messages: [...state.messages, message]
        }));
        
        // Save to database
        try {
          supabase
            .from('messages')
            .insert(mapMessageToDbMessage(message))
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to save user message', { error, messageId });
              }
            });
        } catch (error) {
          logger.error('Error saving user message', { error, messageId });
        }
        
        return message;
      },

      createAssistantMessage: (content, sessionId, metadata = {}) => {
        const now = new Date();
        const messageId = uuidv4();
        
        const message: Message = {
          id: messageId,
          content,
          role: 'assistant',
          type: 'text',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          chat_session_id: sessionId,
          user_id: null,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now.toISOString(),
          retry_count: 0,
          message_status: 'received',
          metadata: { ...metadata } // Create a fresh copy
        };
        
        // Add message to state
        set(state => ({
          messages: [...state.messages, message]
        }));
        
        // Save to database
        try {
          supabase
            .from('messages')
            .insert(mapMessageToDbMessage(message))
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to save assistant message', { error, messageId });
              }
            });
        } catch (error) {
          logger.error('Error saving assistant message', { error, messageId });
        }
        
        return message;
      },

      createSystemMessage: (content, sessionId, metadata = {}) => {
        const now = new Date();
        const messageId = uuidv4();
        
        const message: Message = {
          id: messageId,
          content,
          role: 'system',
          type: 'system',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          chat_session_id: sessionId,
          user_id: null,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now.toISOString(),
          retry_count: 0,
          message_status: 'sent',
          metadata: { ...metadata } // Create a fresh copy
        };
        
        // Add message to state
        set(state => ({
          messages: [...state.messages, message]
        }));
        
        // Save to database
        try {
          supabase
            .from('messages')
            .insert(mapMessageToDbMessage(message))
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to save system message', { error, messageId });
              }
            });
        } catch (error) {
          logger.error('Error saving system message', { error, messageId });
        }
        
        return message;
      },

      createErrorMessage: (content, sessionId) => {
        const now = new Date();
        const messageId = uuidv4();
        
        const message: Message = {
          id: messageId,
          content,
          role: 'system',
          type: 'system',
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          chat_session_id: sessionId,
          user_id: null,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now.toISOString(),
          retry_count: 0,
          message_status: 'error',
          metadata: {}
        };
        
        // Add message to state
        set(state => ({
          messages: [...state.messages, message]
        }));
        
        // Save to database
        try {
          supabase
            .from('messages')
            .insert(mapMessageToDbMessage(message))
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to save error message', { error, messageId });
              }
            });
        } catch (error) {
          logger.error('Error saving error message', { error, messageId });
        }
        
        return message;
      },

      updateMessage: (messageId, updates) => {
        // Find the message to update
        const message = get().messages.find(m => m.id === messageId);
        if (!message) return;

        // Create a new message object with updates
        const updatedMessage = { 
          ...message,
          ...updates,
          // Merge metadata objects safely
          metadata: updates.metadata 
            ? { ...message.metadata, ...updates.metadata }
            : message.metadata,
          updated_at: new Date().toISOString()
        };
        
        // Update state
        set(state => ({
          messages: state.messages.map(m => 
            m.id === messageId ? updatedMessage : m
          )
        }));
        
        // Update in database
        try {
          supabase
            .from('messages')
            .update(mapMessageToDbMessage(updatedMessage))
            .eq('id', messageId)
            .then(({ error }) => {
              if (error) {
                logger.error('Failed to update message', { error, messageId });
              }
            });
        } catch (error) {
          logger.error('Error updating message', { error, messageId });
        }
      },

      deleteMessage: async (messageId) => {
        try {
          // Delete from database
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);
            
          if (error) throw error;
          
          // Remove from state
          set(state => ({
            messages: state.messages.filter(message => message.id !== messageId)
          }));
          
          logger.info('Message deleted', { messageId });
        } catch (error) {
          logger.error('Failed to delete message', { error, messageId });
          throw error;
        }
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      addMessage: (message) => {
        set(state => ({
          messages: [...state.messages, message]
        }));
      }
    }),
    { name: 'MessageStore' }
  )
);
