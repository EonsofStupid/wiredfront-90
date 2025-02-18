
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id?: string;
  content: string;
  user_id: string;
  chat_session_id: string | null;
  message_status: string;
  type: 'text' | 'system' | 'command';
  metadata: Record<string, any>;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
}

interface MessageStore {
  messages: Message[];
  currentSessionId: string | null;
  isProcessing: boolean;
  error: string | null;
  clearMessages: () => void;
  addMessage: (message: { content: string; role: 'user' | 'assistant' | 'system'; sessionId: string }) => Promise<void>;
  setCurrentSessionId: (sessionId: string) => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
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

      const formattedMessages = data.map(msg => ({
        ...msg,
        role: msg.type === 'system' ? 'system' : 'user',
        timestamp: msg.created_at
      }));

      set({ messages: formattedMessages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  },

  addMessage: async (message) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data?.user) {
        throw new Error('No authenticated user');
      }

      const timestamp = new Date().toISOString();
      const messageId = uuidv4();

      const newMessage = {
        id: messageId,
        content: message.content,
        user_id: user.data.user.id,
        chat_session_id: message.sessionId,
        message_status: 'pending',
        type: message.role === 'system' ? 'system' : 'text',
        metadata: {},
        timestamp,
        role: message.role
      };

      set(state => ({
        messages: [...state.messages, newMessage],
        isProcessing: true,
        error: null
      }));

      const { error } = await supabase
        .from('messages')
        .insert([{
          id: messageId,
          content: message.content,
          user_id: user.data.user.id,
          chat_session_id: message.sessionId,
          type: message.role === 'system' ? 'system' : 'text',
          metadata: {},
          message_status: 'sent'
        }]);

      if (error) throw error;

      set(state => ({
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
      set(state => ({
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
