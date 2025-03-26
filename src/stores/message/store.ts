
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  Message, 
  MessageMetadata, 
  MessageRole, 
  MessageStatus
} from '@/schemas/messages';
import { supabase } from '@/integrations/supabase/client';
import { mapMessageToDbMessage, mapDbMessageToMessage } from '@/services/messages/mappers';
import { logger } from '@/services/chat/LoggingService';
import { SafeJson } from '@/types/json';

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
  addMessage: (message: Partial<Message> & { id: string; content: string; role: MessageRole }) => void;
}

export type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>()(
  devtools(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      fetchSessionMessages: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_session_id', sessionId)
            .order('created_at', { ascending: true });
            
          if (error) throw error;
          
          const messages = data ? data.map((dbMsg) => mapDbMessageToMessage(dbMsg)) : [];
          
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
          user_id: null,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: now.toISOString(),
          retry_count: 0,
          message_status: 'sent',
          metadata: { ...metadata }
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
        
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
          metadata: { ...metadata }
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
        
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
          metadata: { ...metadata }
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
        
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
        
        set(state => ({
          messages: [...state.messages, message]
        }));
        
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
        set(state => {
          const message = state.messages.find(m => m.id === messageId);
          if (!message) {
            logger.warn('Tried to update non-existent message', { messageId });
            return state;
          }

          // Update metadata as a merge, not a replacement
          const updatedMetadata = updates.metadata
            ? { ...message.metadata, ...updates.metadata }
            : message.metadata;
            
          const updatedMessage: Message = { 
            ...message,
            ...updates,
            metadata: updatedMetadata,
            updated_at: new Date().toISOString()
          } as Message;
          
          try {
            supabase
              .from('messages')
              .update(mapMessageToDbMessage(updatedMessage))
              .eq('id', messageId)
              .then(({ error }) => {
                if (error) {
                  logger.error('Failed to update message in DB', { error, messageId });
                }
              });
          } catch (error) {
            logger.error('Error updating message in DB', { error, messageId });
          }
          
          return {
            messages: state.messages.map(m => 
              m.id === messageId ? updatedMessage : m
            )
          };
        });
      },

      deleteMessage: async (messageId) => {
        try {
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);
            
          if (error) throw error;
          
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
        const now = new Date().toISOString();
        
        const fullMessage: Message = {
          id: message.id,
          content: message.content,
          role: message.role,
          type: message.type || 'text',
          metadata: message.metadata || {},
          created_at: message.created_at || now,
          updated_at: message.updated_at || now,
          chat_session_id: message.chat_session_id || '',
          user_id: message.user_id || null,
          is_minimized: message.is_minimized || false,
          position: message.position || {},
          window_state: message.window_state || {},
          last_accessed: message.last_accessed || now,
          retry_count: message.retry_count || 0,
          message_status: message.message_status || 'sent',
          source_type: message.source_type,
          provider: message.provider,
          processing_status: message.processing_status,
          last_retry: message.last_retry,
          rate_limit_window: message.rate_limit_window
        };
        
        set(state => ({
          messages: [...state.messages, fullMessage]
        }));
      }
    }),
    { name: 'MessageStore' }
  )
);
