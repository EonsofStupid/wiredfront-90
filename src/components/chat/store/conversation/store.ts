import { create } from 'zustand';
import { 
  fetchConversations,
  createConversation,
  updateConversation,
  archiveConversation,
  deleteConversation
} from '@/services/chat/ConversationService';
import { 
  Conversation, 
  CreateConversationParams, 
  UpdateConversationParams 
} from '@/types/chat/conversation';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  setCurrentConversationId: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  createConversation: (params: CreateConversationParams) => string;
  updateConversation: (id: string, params: UpdateConversationParams) => Promise<boolean>;
  archiveConversation: (id: string) => boolean;
  deleteConversation: (id: string) => boolean;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  
  setCurrentConversationId: (id: string | null) => {
    set({ currentConversationId: id });
    
    if (id) {
      // Update the last_accessed time in the database
      updateConversation(id, { updated_at: new Date().toISOString() })
        .catch(error => {
          logger.error('Failed to update conversation last_accessed', { error, conversationId: id });
        });
    }
  },
  
  loadConversations: async () => {
    set({ isLoading: true });
    
    try {
      const conversations = await fetchConversations();
      set({ conversations });
      
      logger.info('Loaded conversations', { count: conversations.length });
      
      // If we have no current conversation but have conversations, set the first one
      const { currentConversationId } = get();
      if (!currentConversationId && conversations.length > 0) {
        set({ currentConversationId: conversations[0].id });
      }
    } catch (error) {
      logger.error('Failed to load conversations', { error });
      toast.error('Failed to load conversations');
    } finally {
      set({ isLoading: false });
    }
  },
  
  createConversation: (params: CreateConversationParams) => {
    try {
      // Create the conversation in the database
      const conversationId = createConversation(params);
      
      // If we already have conversations loaded, add this one to the list
      // Otherwise, load all conversations
      if (conversationId) {
        const { conversations } = get();
        
        if (conversations.length > 0) {
          // Create a basic conversation object to add to the store
          const newConversation: Conversation = {
            id: conversationId,
            title: params.title || 'New Conversation',
            created_at: new Date().toISOString(),
            last_accessed: new Date().toISOString(),
            message_count: 0,
            archived: false,
            metadata: params.metadata || {},
            updated_at: new Date().toISOString(),
            project_id: params.project_id
          };
          
          set({ 
            conversations: [newConversation, ...conversations],
            currentConversationId: conversationId
          });
        } else {
          // Load all conversations
          get().loadConversations();
        }
        
        logger.info('Created conversation', { conversationId });
      }
      
      return conversationId || '';
    } catch (error) {
      logger.error('Failed to create conversation', { error });
      toast.error('Failed to create conversation');
      return '';
    }
  },
  
  updateConversation: async (id: string, params: UpdateConversationParams) => {
    try {
      // Update the conversation in the database
      const success = await updateConversation(id, params);
      
      if (success) {
        // Update the conversation in the store
        set(state => ({
          conversations: state.conversations.map(conversation => {
            if (conversation.id === id) {
              return {
                ...conversation,
                ...params,
                // Always update the last_accessed time
                updated_at: new Date().toISOString()
              };
            }
            return conversation;
          })
        }));
        
        logger.info('Updated conversation', { conversationId: id });
      }
      
      return success;
    } catch (error) {
      logger.error('Failed to update conversation', { error, conversationId: id });
      toast.error('Failed to update conversation');
      return false;
    }
  },
  
  archiveConversation: (id: string) => {
    try {
      // Archive the conversation in the database
      const success = archiveConversation(id);
      
      if (success) {
        // Archive the conversation in the store
        set(state => ({
          conversations: state.conversations.map(conversation => {
            if (conversation.id === id) {
              return {
                ...conversation,
                archived: true
              };
            }
            return conversation;
          })
        }));
        
        // If this was the current conversation, set the current conversation to null
        if (get().currentConversationId === id) {
          set({ currentConversationId: null });
        }
        
        logger.info('Archived conversation', { conversationId: id });
      }
      
      return success;
    } catch (error) {
      logger.error('Failed to archive conversation', { error, conversationId: id });
      toast.error('Failed to archive conversation');
      return false;
    }
  },
  
  deleteConversation: (id: string) => {
    try {
      // Delete the conversation from the database
      const success = deleteConversation(id);
      
      if (success) {
        // Remove the conversation from the store
        set(state => ({
          conversations: state.conversations.filter(conversation => conversation.id !== id)
        }));
        
        // If this was the current conversation, set the current conversation to null
        if (get().currentConversationId === id) {
          set({ currentConversationId: null });
        }
        
        logger.info('Deleted conversation', { conversationId: id });
      }
      
      return success;
    } catch (error) {
      logger.error('Failed to delete conversation', { error, conversationId: id });
      toast.error('Failed to delete conversation');
      return false;
    }
  }
}));

// Convenience hooks for working with conversations
export const useCurrentConversationId = () => useConversationStore(state => state.currentConversationId);

export const useCurrentConversation = () => {
  const { conversations, currentConversationId } = useConversationStore();
  return conversations.find(conversation => conversation.id === currentConversationId) || null;
};
