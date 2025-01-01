import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  metadata?: Record<string, any>;
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: async (message) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...message,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      isLoading: true,
    }));

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          content: message.content,
          type: message.role === 'user' ? 'text' : 'system',
          metadata: message.metadata || {},
        }]);

      if (error) throw error;

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, status: 'sent' } : m
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to save message');
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, status: 'error' } : m
        ),
        isLoading: false,
        error: 'Failed to save message',
      }));
    }
  },

  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [], error: null }),
}));