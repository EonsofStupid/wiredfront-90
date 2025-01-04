import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message, MessageStatus } from '@/types/chat';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Partial<Message>) => Promise<void>;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      addMessage: async (message) => {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          content: message.content || '',
          user_id: message.user_id || null,
          type: message.type || 'text',
          metadata: message.metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          chat_session_id: message.chat_session_id || crypto.randomUUID(),
          is_minimized: false,
          position: { x: null, y: null },
          window_state: { width: 350, height: 500 },
          last_accessed: new Date().toISOString(),
          retry_count: 0,
          message_status: 'pending',
          role: message.user_id ? 'user' : 'assistant',
          provider: message.provider || 'openai',
          processing_status: 'pending'
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
              type: message.type || 'text',
              metadata: message.metadata || {},
              chat_session_id: message.chat_session_id,
              user_id: message.user_id
            }]);

          if (error) throw error;

          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === newMessage.id ? { ...m, message_status: 'sent' as MessageStatus } : m
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error saving message:', error);
          toast.error('Failed to save message');
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === newMessage.id ? { ...m, message_status: 'error' as MessageStatus } : m
            ),
            isLoading: false,
            error: 'Failed to save message',
          }));
        }
      },

      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [], error: null }),
    }),
    {
      name: 'chat-messages',
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);

// Export a singleton instance for global access
export const messageCache = {
  addMessage: useMessageStore.getState().addMessage,
  clearMessages: useMessageStore.getState().clearMessages,
  getMessages: () => useMessageStore.getState().messages,
  getError: () => useMessageStore.getState().error,
};