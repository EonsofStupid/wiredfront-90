
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

interface Message {
  id: string;
  content: string;
  user_id: string;
  chat_session_id: string | null;
  message_status: 'pending' | 'sent' | 'failed';
  type: 'text' | 'system' | 'command';
  metadata: Json;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  is_minimized?: boolean;
  window_state?: Json;
  last_accessed?: string;
  last_retry?: string;
  retry_count?: number;
}

interface MessageState {
  messages: Message[];
  currentSessionId: string | null;
  isProcessing: boolean;
  error: string | null;
}

interface MessageStore extends MessageState {
  clearMessages: () => void;
  addMessage: (message: { content: string; role: 'user' | 'assistant' | 'system'; sessionId: string }) => Promise<void>;
  setCurrentSessionId: (sessionId: string) => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
}

const validateRole = (role: string): 'user' | 'assistant' | 'system' => {
  if (role === 'user' || role === 'assistant' || role === 'system') {
    return role;
  }
  return 'user'; // Default fallback
};

// Create the message store with a properly exposed clearMessages method
export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  currentSessionId: null,
  isProcessing: false,
  error: null,

  clearMessages: () => {
    set({ messages: [] });
  },

  setCurrentSessionId: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  fetchSessionMessages: async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        user_id: msg.user_id,
        chat_session_id: msg.chat_session_id,
        message_status: msg.message_status as Message['message_status'],
        type: msg.type as Message['type'],
        metadata: msg.metadata,
        role: validateRole(msg.role),
        timestamp: msg.created_at,
        is_minimized: msg.is_minimized,
        window_state: msg.window_state,
        last_accessed: msg.last_accessed,
        last_retry: msg.last_retry,
        retry_count: msg.retry_count
      }));

      set({ messages: formattedMessages, currentSessionId: sessionId });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  },

  addMessage: async (message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      const newMessage: Message = {
        id: messageId,
        content: message.content,
        user_id: user.id,
        chat_session_id: message.sessionId,
        message_status: 'pending',
        type: message.role === 'system' ? 'system' : 'text',
        metadata: {},
        role: message.role,
        timestamp
      };

      set((state: MessageState) => ({
        messages: [...state.messages, newMessage],
        isProcessing: true,
        error: null
      }));

      const { error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          content: message.content,
          user_id: user.id,
          chat_session_id: message.sessionId,
          type: message.role === 'system' ? 'system' : 'text',
          metadata: {},
          message_status: 'sent',
          role: message.role
        });

      if (error) throw error;

      set((state: MessageState) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, message_status: 'sent' }
            : msg
        ),
        isProcessing: false
      }));

    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      set((state: MessageState) => ({
        messages: state.messages.map(msg => 
          msg.id === msg.id 
            ? { ...msg, message_status: 'failed' }
            : msg
        ),
        isProcessing: false,
        error: 'Failed to send message'
      }));
    }
  }
}));

// Explicitly export clearMessages to ensure it's available
export const clearMessages = () => useMessageStore.getState().clearMessages();
