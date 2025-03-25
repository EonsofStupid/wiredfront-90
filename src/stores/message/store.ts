
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { 
  Message, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  MessageMetadata 
} from '@/types/messages';
import { logger } from '@/services/chat/LoggingService';

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

export interface MessageActions {
  // Core actions
  addMessage: (message: Partial<Message>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getMessageById: (id: string) => Message | undefined;
  
  // Session-related actions
  fetchSessionMessages: (sessionId: string) => Promise<void>;
  clearMessages: () => void;
  
  // Message creation helpers
  createUserMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createAssistantMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createSystemMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
  createErrorMessage: (content: string, sessionId: string, metadata?: MessageMetadata) => Message;
}

export type MessageStore = MessageState & MessageActions;

export const useMessageStore = create<MessageStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      messages: [],
      isLoading: false,
      error: null,

      // Core actions
      addMessage: (message) => {
        // Create a complete message from partial data
        const completeMessage: Message = {
          id: message.id || uuidv4(),
          content: message.content || '',
          user_id: message.user_id || null,
          type: message.type || 'text',
          metadata: message.metadata || {},
          created_at: message.created_at || new Date().toISOString(),
          updated_at: message.updated_at || new Date().toISOString(),
          chat_session_id: message.chat_session_id || '',
          is_minimized: message.is_minimized || false,
          position: message.position || {},
          window_state: message.window_state || {},
          last_accessed: message.last_accessed || new Date().toISOString(),
          retry_count: message.retry_count || 0,
          message_status: message.message_status || 'sent',
          role: message.role || 'user',
          ...message
        } as Message;

        // Save to Supabase
        saveMessageToSupabase(completeMessage);
        
        // Update local state
        set((state) => ({
          messages: [...state.messages, completeMessage],
        }));
      },

      updateMessage: (id, updates) => {
        // Get current message
        const message = get().messages.find(m => m.id === id);
        if (!message) return;
        
        // Create updated message
        const updatedMessage = { ...message, ...updates };
        
        // Update in Supabase
        updateMessageInSupabase(id, updates);
        
        // Update local state
        set((state) => ({
          messages: state.messages.map((message) => 
            message.id === id ? updatedMessage : message
          ),
        }));
      },

      getMessageById: (id) => {
        return get().messages.find((message) => message.id === id);
      },

      // Session-related actions
      fetchSessionMessages: async (sessionId) => {
        try {
          set({ isLoading: true, messages: [] });
          
          // Fetch messages from Supabase
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_session_id', sessionId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (!data) {
            set({ messages: [], isLoading: false });
            return;
          }
          
          // Map to Message type
          const messages = data.map(m => ({
            ...m,
            metadata: m.metadata || {},
            position: m.position || {},
            window_state: m.window_state || {}
          })) as Message[];
          
          set({ messages, isLoading: false });
          logger.info(`Fetched ${messages.length} messages for session ${sessionId}`);
        } catch (error) {
          logger.error('Failed to fetch session messages', { error });
          set({ error: error as Error, isLoading: false });
        }
      },
      
      clearMessages: () => {
        set({ messages: [] });
        logger.info("Message store cleared");
      },
      
      // Message creation helpers
      createUserMessage: (content, sessionId, metadata = {}) => {
        const message: Message = {
          id: uuidv4(),
          content,
          user_id: null, // Will be set from auth
          type: 'text',
          metadata: metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: sessionId,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'sent',
          role: 'user'
        };
        get().addMessage(message);
        return message;
      },
      
      createAssistantMessage: (content, sessionId, metadata = {}) => {
        const message: Message = {
          id: uuidv4(),
          content,
          user_id: null,
          type: 'text',
          metadata: metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: sessionId,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'sent',
          role: 'assistant'
        };
        get().addMessage(message);
        return message;
      },
      
      createSystemMessage: (content, sessionId, metadata = {}) => {
        const message: Message = {
          id: uuidv4(),
          content,
          user_id: null,
          type: 'system',
          metadata: metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: sessionId,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'sent',
          role: 'system'
        };
        get().addMessage(message);
        return message;
      },
      
      createErrorMessage: (content, sessionId, metadata = {}) => {
        const message: Message = {
          id: uuidv4(),
          content,
          user_id: null,
          type: 'system',
          metadata: { ...metadata, isError: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: sessionId,
          is_minimized: false,
          position: {},
          window_state: {},
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'error',
          role: 'system'
        };
        get().addMessage(message);
        return message;
      }
    }),
    { name: 'MessageStore' }
  )
);

// Helper function to save message to Supabase
async function saveMessageToSupabase(message: Message) {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        content: message.content,
        user_id: message.user_id,
        type: message.type,
        metadata: message.metadata,
        created_at: message.created_at,
        updated_at: message.updated_at,
        chat_session_id: message.chat_session_id,
        is_minimized: message.is_minimized,
        position: message.position,
        window_state: message.window_state,
        last_accessed: message.last_accessed,
        retry_count: message.retry_count,
        message_status: message.message_status,
        role: message.role
      });
      
    if (error) {
      logger.error('Failed to save message to Supabase', { error, message });
    }
  } catch (error) {
    logger.error('Exception saving message to Supabase', { error, message });
  }
}

// Helper function to update message in Supabase
async function updateMessageInSupabase(id: string, updates: Partial<Message>) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      logger.error('Failed to update message in Supabase', { error, id, updates });
    }
  } catch (error) {
    logger.error('Exception updating message in Supabase', { error, id, updates });
  }
}
