
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole, MessageStatus, MessageType } from '../types';
import { Json } from '@/integrations/supabase/types';

interface MessageState {
  messages: Message[];
  currentSessionId: string | null;
  isProcessing: boolean;
  error: string | null;
}

interface MessageStore extends MessageState {
  clearMessages: () => void;
  addMessage: (message: { 
    content: string; 
    role: MessageRole; 
    sessionId: string;
    status?: MessageStatus;
    metadata?: Json;
    type?: MessageType;
  }) => Promise<string | null>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
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
    get().fetchSessionMessages(sessionId);
  },

  fetchSessionMessages: async (sessionId: string) => {
    try {
      set({ isProcessing: true, error: null });
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as MessageRole,
        user_id: msg.user_id,
        chat_session_id: msg.chat_session_id,
        message_status: msg.message_status as MessageStatus,
        type: (msg.type || msg.message_type) as MessageType,
        metadata: msg.metadata || {},
        timestamp: msg.created_at,
        is_minimized: msg.is_minimized
      }));

      set({ messages: formattedMessages, currentSessionId: sessionId, isProcessing: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ 
        isProcessing: false, 
        error: 'Failed to load messages' 
      });
      toast.error('Failed to load messages');
    }
  },

  addMessage: async ({ content, role, sessionId, status = 'pending', metadata = {}, type }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      const messageType = type || (role === 'system' ? 'system' : 'text');
      
      const newMessage: Message = {
        id: messageId,
        content,
        user_id: user.id,
        chat_session_id: sessionId,
        message_status: status,
        type: messageType,
        metadata,
        role,
        timestamp
      };

      set((state) => ({
        messages: [...state.messages, newMessage],
        isProcessing: role === 'user', // Only set processing if user message
        error: null
      }));

      const { error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          content,
          user_id: user.id,
          chat_session_id: sessionId,
          type: messageType,
          message_type: messageType,
          metadata,
          message_status: 'sent',
          role
        });

      if (error) throw error;

      set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, message_status: 'sent' }
            : msg
        )
      }));

      return messageId;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to send message');
      set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === msg.id && msg.message_status === 'pending'
            ? { ...msg, message_status: 'failed' }
            : msg
        ),
        isProcessing: false,
        error: 'Failed to send message'
      }));
      return null;
    }
  },

  updateMessage: async (messageId, updates) => {
    try {
      set({ error: null });

      // Convert the updates to match the database column names
      const dbUpdates: any = { ...updates };
      if (updates.type) {
        dbUpdates.message_type = updates.type;
      }

      const { error } = await supabase
        .from('messages')
        .update(dbUpdates)
        .eq('id', messageId);

      if (error) throw error;

      set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, ...updates }
            : msg
        )
      }));
    } catch (error) {
      console.error('Error updating message:', error);
      set({ error: 'Failed to update message' });
      toast.error('Failed to update message');
    }
  },

  deleteMessage: async (messageId) => {
    try {
      set({ error: null });

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }));
    } catch (error) {
      console.error('Error deleting message:', error);
      set({ error: 'Failed to delete message' });
      toast.error('Failed to delete message');
    }
  }
}));
