
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ConversationStore, 
  Conversation, 
  CreateConversationParams, 
  UpdateConversationParams 
} from './types';
import { 
  fetchConversationsService, 
  createConversationService, 
  updateConversationService,
  archiveConversationService,
  deleteConversationService
} from '@/services/conversations';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

// Initial state
const initialState = {
  conversations: {},
  currentConversationId: null,
  isLoading: false,
  error: null,
  initialized: false
};

export const useConversationStore = create<ConversationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Core actions
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });
          await get().fetchConversations();
          set({ initialized: true, isLoading: false });
        } catch (error) {
          logger.error('Failed to initialize conversation store', { error });
          set({ 
            error: error instanceof Error ? error : new Error('Failed to initialize'), 
            isLoading: false 
          });
        }
      },

      reset: () => {
        set(initialState);
      },

      setError: (error) => {
        set({ error });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Conversation CRUD
      fetchConversations: async () => {
        try {
          set({ isLoading: true, error: null });
          const conversations = await fetchConversationsService();
          
          // Convert array to record with conversation id as key
          const conversationsRecord: Record<string, Conversation> = {};
          conversations.forEach(conversation => {
            conversationsRecord[conversation.id] = conversation;
          });
          
          set({ conversations: conversationsRecord, isLoading: false });
          
          // If no current conversation is set but we have conversations, set the first active one
          const currentId = get().currentConversationId;
          if (!currentId && Object.keys(conversationsRecord).length > 0) {
            // Find the first non-archived conversation
            const firstActiveId = Object.values(conversationsRecord)
              .filter(conv => !conv.archived)
              .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
              .map(conv => conv.id)[0];
            
            if (firstActiveId) {
              get().setCurrentConversationId(firstActiveId);
            }
          }
        } catch (error) {
          logger.error('Failed to fetch conversations', { error });
          set({ 
            error: error instanceof Error ? error : new Error('Failed to fetch conversations'), 
            isLoading: false 
          });
        }
      },

      createConversation: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const result = await createConversationService(params);
          
          if (!result.success || !result.conversationId) {
            throw new Error('Failed to create conversation');
          }
          
          await get().fetchConversations();
          get().setCurrentConversationId(result.conversationId);
          set({ isLoading: false });
          
          return result.conversationId;
        } catch (error) {
          logger.error('Failed to create conversation', { error });
          set({ 
            error: error instanceof Error ? error : new Error('Failed to create conversation'), 
            isLoading: false 
          });
          return null;
        }
      },

      updateConversation: async (id, updates) => {
        try {
          const result = await updateConversationService(id, updates);
          
          if (!result.success) {
            throw result.error || new Error('Failed to update conversation');
          }
          
          // Update the conversation in the store directly without refetching all
          const updatedConversation = {
            ...get().conversations[id],
            ...updates,
            // Update last_accessed if it's not part of the explicit updates
            last_accessed: updates.last_accessed || new Date().toISOString()
          };
          
          set(state => ({
            conversations: {
              ...state.conversations,
              [id]: updatedConversation
            }
          }));
          
          return true;
        } catch (error) {
          logger.error('Failed to update conversation', { error, conversationId: id });
          toast.error('Failed to update conversation');
          return false;
        }
      },

      archiveConversation: async (id) => {
        try {
          const result = await archiveConversationService(id);
          
          if (!result.success) {
            throw result.error || new Error('Failed to archive conversation');
          }
          
          // Update the conversation in the store
          const updatedConversation = {
            ...get().conversations[id],
            archived: true
          };
          
          set(state => ({
            conversations: {
              ...state.conversations,
              [id]: updatedConversation
            }
          }));
          
          // If this was the current conversation, select another active one
          if (get().currentConversationId === id) {
            const activeConversations = Object.values(get().conversations)
              .filter(conv => !conv.archived && conv.id !== id);
              
            if (activeConversations.length > 0) {
              // Sort by last accessed and get most recent
              const nextConversationId = activeConversations
                .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())[0].id;
              get().setCurrentConversationId(nextConversationId);
            } else {
              get().setCurrentConversationId(null);
            }
          }
          
          return true;
        } catch (error) {
          logger.error('Failed to archive conversation', { error, conversationId: id });
          toast.error('Failed to archive conversation');
          return false;
        }
      },

      deleteConversation: async (id) => {
        try {
          const result = await deleteConversationService(id);
          
          if (!result.success) {
            throw result.error || new Error('Failed to delete conversation');
          }
          
          // Remove the conversation from the store
          set(state => {
            const { [id]: removedConversation, ...remainingConversations } = state.conversations;
            return { conversations: remainingConversations };
          });
          
          // If this was the current conversation, select another one
          if (get().currentConversationId === id) {
            const activeConversations = Object.values(get().conversations)
              .filter(conv => !conv.archived);
              
            if (activeConversations.length > 0) {
              // Sort by last accessed and get most recent
              const nextConversationId = activeConversations
                .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())[0].id;
              get().setCurrentConversationId(nextConversationId);
            } else {
              get().setCurrentConversationId(null);
            }
          }
          
          return true;
        } catch (error) {
          logger.error('Failed to delete conversation', { error, conversationId: id });
          toast.error('Failed to delete conversation');
          return false;
        }
      },

      // Current conversation
      setCurrentConversationId: (id) => {
        set({ currentConversationId: id });
        
        // If we have a valid ID, update the last_accessed time
        if (id && get().conversations[id]) {
          get().updateConversation(id, { last_accessed: new Date().toISOString() });
        }
      },

      getCurrentConversation: () => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return null;
        return conversations[currentConversationId] || null;
      }
    }),
    {
      name: 'conversation-store',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);
