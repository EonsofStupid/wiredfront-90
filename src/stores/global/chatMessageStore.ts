
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole, MessageStatus } from '@/types/chat/messages';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

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
            message_status: message.message_status || 'sent',
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
            
            // Transform and add messages
            const parsedMessages = (data || []).map(msg => ({
              id: msg.id,
              session_id: msg.session_id,
              user_id: msg.user_id,
              role: msg.role,
              content: msg.content,
              metadata: typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata,
              message_status: msg.status || 'sent',
              retry_count: msg.retry_count,
              last_retry: msg.last_retry,
              created_at: msg.created_at,
              updated_at: msg.updated_at,
              timestamp: msg.created_at,
              position_order: msg.position_order
            }));
            
            parsedMessages.forEach(msg => {
              get().addMessage(msg);
            });
            
            set({ isLoading: false });
            logger.info('Messages fetched successfully', { sessionId, count: parsedMessages.length });
          } catch (error) {
            set({ error: error as Error, isLoading: false });
            logger.error('Failed to fetch messages', { error, sessionId });
          }
        },

        clearMessages: () => {
          set({ messages: [] });
        },

        sendMessage: async (content, sessionId, role = 'user') => {
          try {
            // Create a new message locally first
            const message: Message = {
              id: uuidv4(),
              session_id: sessionId,
              role,
              content,
              message_status: 'pending',
              created_at: new Date().toISOString(),
              timestamp: new Date().toISOString()
            };
            
            const messageId = get().addMessage(message);
            
            // Get current user information
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');
            
            // Save to the database
            const { data, error } = await supabase
              .from('chat_messages')
              .insert({
                id: messageId,
                session_id: sessionId,
                user_id: user.id,
                role,
                content,
                status: 'sent',
                created_at: message.created_at,
                updated_at: message.created_at,
                metadata: {},
                position_order: get().messages.length
              })
              .select()
              .single();
              
            if (error) throw error;
            
            // Update local message status
            get().updateMessage(messageId, { 
              message_status: 'sent',
              user_id: user.id
            });
            
            // Update message count for the session
            try {
              await supabase.rpc('increment_count', {
                table_name: 'chat_sessions',
                id_value: sessionId,
                column_name: 'message_count',
                increment_by: 1
              });
            } catch (countError) {
              logger.warn('Failed to increment message count', { countError, sessionId });
            }
            
            return messageId;
          } catch (error) {
            logger.error('Failed to send message', { error, sessionId });
            toast.error('Failed to send message');
            throw error;
          }
        }
      }),
      {
        name: 'chat-message-storage',
        partialize: (state) => ({
          messages: state.messages.slice(-20), // Only persist the last 20 messages
        })
      }
    ),
    {
      name: 'ChatMessageStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks for more granular access
export const useMessages = () => useChatMessageStore(state => state.messages);
export const useMessageActions = () => ({
  addMessage: useChatMessageStore(state => state.addMessage),
  updateMessage: useChatMessageStore(state => state.updateMessage),
  removeMessage: useChatMessageStore(state => state.removeMessage),
  fetchMessages: useChatMessageStore(state => state.fetchMessages),
  clearMessages: useChatMessageStore(state => state.clearMessages),
  sendMessage: useChatMessageStore(state => state.sendMessage),
});
