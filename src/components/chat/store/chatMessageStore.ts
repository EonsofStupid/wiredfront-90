
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole, MessageStatus } from '@/types/chat/messages';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { messageToDbMessage } from '@/utils/messageConversion';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

interface MessageActions {
  addMessage: (message: Message) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  fetchMessages: (sessionId: string) => Promise<void>;
  clearMessages: () => void;
  sendMessage: (content: string, sessionId: string, role?: MessageRole) => Promise<string>;
}

export type MessageStore = MessageState & MessageActions;

export const useChatMessageStore = create<MessageStore>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        isLoading: false,
        error: null,

        addMessage: (message) => {
          const id = message.id || uuidv4();
          const timestamp = message.timestamp || message.created_at || new Date().toISOString();
          
          const newMessage: Message = {
            ...message,
            id,
            timestamp,
            message_status: message.message_status || message.status || 'sent',
          };
          
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
          
          return id;
        },

        updateMessage: (id, updates) => {
          set((state) => ({
            messages: state.messages.map((message) => 
              message.id === id ? { ...message, ...updates } : message
            ),
          }));
        },

        removeMessage: (id) => {
          set((state) => ({
            messages: state.messages.filter((message) => message.id !== id),
          }));
        },

        fetchMessages: async (sessionId) => {
          try {
            set({ isLoading: true, error: null });
            
            const { data, error } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('session_id', sessionId)
              .order('created_at', { ascending: true });
            
            if (error) throw error;
            
            // Clear existing messages before adding new ones
            set({ messages: [] });
            
            // Add each message to the store
            data.forEach((msg) => {
              get().addMessage({
                id: msg.id,
                session_id: msg.session_id,
                user_id: msg.user_id,
                role: msg.role as MessageRole,
                content: msg.content,
                message_status: msg.status as MessageStatus,
                metadata: msg.metadata || {},
                created_at: msg.created_at,
                updated_at: msg.updated_at,
                timestamp: msg.created_at,
                position_order: msg.position_order,
                retry_count: msg.retry_count,
                last_retry: msg.last_retry,
              });
            });
            
            logger.info(`Fetched ${data.length} messages for session ${sessionId}`);
            set({ isLoading: false });
          } catch (error) {
            logger.error('Error fetching messages:', error);
            set({ error: error as Error, isLoading: false });
          }
        },

        clearMessages: () => {
          set({ messages: [] });
        },

        sendMessage: async (content, sessionId, role = 'user') => {
          try {
            if (!content.trim() || !sessionId) {
              throw new Error('Cannot send empty message or missing session ID');
            }
            
            // Create a temporary message ID
            const tempId = uuidv4();
            const timestamp = new Date().toISOString();
            
            // Add pending message to store
            get().addMessage({
              id: tempId,
              session_id: sessionId,
              role,
              content,
              message_status: 'pending',
              timestamp,
            });
            
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            
            // Send to database
            const { data, error } = await supabase
              .from('chat_messages')
              .insert({
                session_id: sessionId,
                user_id: user.id,
                role,
                content,
                status: 'sent',
                created_at: timestamp,
                type: 'text'
              })
              .select()
              .single();
            
            if (error) throw error;
            
            // Update message in store with DB id and status
            get().updateMessage(tempId, {
              id: data.id,
              message_status: 'sent',
              user_id: user.id,
            });
            
            // Update session last_accessed timestamp using a parameterized RPC call
            await supabase.rpc('increment_count', { 
              table_name: 'chat_sessions',
              id_value: sessionId,
              column_name: 'message_count' 
            });
            
            // Also update the last accessed time
            await supabase
              .from('chat_sessions')
              .update({ last_accessed: timestamp })
              .eq('id', sessionId);
            
            return data.id;
          } catch (error) {
            logger.error('Error sending message:', error);
            set((state) => ({
              error: error as Error,
              messages: state.messages.map(msg => 
                msg.content === content && msg.message_status === 'pending'
                  ? { ...msg, message_status: 'failed' }
                  : msg
              )
            }));
            throw error;
          }
        }
      }),
      {
        name: 'chat-messages',
        partialize: (state) => ({
          messages: state.messages.slice(-50), // Only persist last 50 messages
        }),
      }
    ),
    {
      name: 'ChatMessageStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

// Selector hooks
export const useMessages = () => useChatMessageStore(state => state.messages);
export const useMessageActions = () => ({
  addMessage: useChatMessageStore(state => state.addMessage),
  updateMessage: useChatMessageStore(state => state.updateMessage),
  removeMessage: useChatMessageStore(state => state.removeMessage),
  sendMessage: useChatMessageStore(state => state.sendMessage),
  fetchMessages: useChatMessageStore(state => state.fetchMessages),
  clearMessages: useChatMessageStore(state => state.clearMessages),
});
