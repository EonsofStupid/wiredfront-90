
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  status: 'pending' | 'sent' | 'failed';
  metadata?: Record<string, any>;
  sessionId: string;
}

interface MessageStore {
  messages: Message[];
  currentSessionId: string | null;
  isProcessing: boolean;
  error: string | null;
  clearMessages: () => void;
  addMessage: (message: Omit<Message, 'timestamp'>) => Promise<void>;
  setCurrentSessionId: (sessionId: string) => void;
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

  addMessage: async (message) => {
    try {
      const timestamp = new Date().toISOString();
      const newMessage = {
        ...message,
        timestamp,
        status: 'pending' as const
      };

      set(state => ({
        messages: [...state.messages, newMessage],
        isProcessing: true,
        error: null
      }));

      const { error } = await supabase
        .from('messages')
        .insert([{
          content: message.content,
          chat_session_id: message.sessionId,
          type: message.role === 'system' ? 'system' : 'text',
          metadata: message.metadata || {},
          message_status: 'sent'
        }]);

      if (error) throw error;

      set(state => ({
        messages: state.messages.map(msg => 
          msg.timestamp === timestamp 
            ? { ...msg, status: 'sent' as const }
            : msg
        ),
        isProcessing: false
      }));

    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      set(state => ({
        messages: state.messages.map(msg => 
          msg.timestamp === message.timestamp 
            ? { ...msg, status: 'failed' as const }
            : msg
        ),
        isProcessing: false,
        error: 'Failed to send message'
      }));
    }
  }
}));
