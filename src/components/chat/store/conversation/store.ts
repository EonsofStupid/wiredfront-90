
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { useChatStore } from '@/components/chat/store/chatStore';
import { ConversationStore } from './types';
import * as conversationService from '@/services/conversations';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

/**
 * Zustand store for managing all conversation state and actions
 */
export const useConversationStore = create<ConversationStore>()(
  immer((set, get) => ({
    // Initial state
    conversations: [],
    currentConversationId: null,
    isLoading: false,
    isError: false,
    error: null,
    
    // Core actions
    setCurrentConversationId: (id) => {
      set(state => {
        state.currentConversationId = id;
      });
    },
    
    setLoading: (isLoading) => {
      set(state => {
        state.isLoading = isLoading;
      });
    },
    
    refreshConversations: async () => {
      set(state => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      });
      
      try {
        const conversations = await conversationService.fetchUserConversations();
        set(state => {
          state.conversations = conversations;
          state.isLoading = false;
        });
      } catch (error) {
        logger.error('Failed to fetch conversations', { error });
        set(state => {
          state.isError = true;
          state.error = error instanceof Error ? error : new Error(String(error));
          state.isLoading = false;
        });
        toast.error('Failed to load chat conversations');
      }
    },
    
    // CRUD operations
    createConversation: async (params) => {
      const clearMessages = useMessageStore.getState().clearMessages;
      
      try {
        const result = await conversationService.createNewConversation(params);
        if (result.success && result.conversationId) {
          const conversationId = result.conversationId;
          set(state => {
            state.currentConversationId = conversationId;
          });
          
          clearMessages();
          await get().refreshConversations();
          
          toast.success('New chat conversation created');
          return conversationId;
        }
        
        throw new Error('Failed to create conversation');
      } catch (error) {
        logger.error('Error creating conversation', { error });
        toast.error('Failed to create new conversation');
        return '';
      }
    },
    
    switchConversation: async (conversationId) => {
      const { setSessionLoading } = useChatStore.getState();
      const { fetchSessionMessages } = useMessageStore.getState();
      const currentConversationId = get().currentConversationId;
      
      try {
        setSessionLoading(true);
        
        // If already on this conversation, just refresh messages
        if (conversationId === currentConversationId) {
          setSessionLoading(false);
          return;
        }
        
        set(state => {
          state.currentConversationId = conversationId;
        });
        
        await fetchSessionMessages(conversationId);
        await conversationService.switchToConversation(conversationId);
        await get().refreshConversations();
        
      } catch (error) {
        logger.error('Error switching conversation', { error, conversationId });
        toast.error('Failed to switch conversation');
      } finally {
        setSessionLoading(false);
      }
    },
    
    updateConversation: async ({ conversationId, params }) => {
      try {
        const result = await conversationService.updateConversation(conversationId, params);
        if (result.success) {
          await get().refreshConversations();
        } else {
          throw new Error('Failed to update conversation');
        }
      } catch (error) {
        logger.error('Error updating conversation', { error, conversationId });
        toast.error('Failed to update conversation');
      }
    },
    
    archiveConversation: async (conversationId) => {
      try {
        const result = await conversationService.archiveConversation(conversationId);
        if (result.success) {
          await get().refreshConversations();
          toast.success('Conversation archived');
        } else {
          throw new Error('Failed to archive conversation');
        }
      } catch (error) {
        logger.error('Error archiving conversation', { error, conversationId });
        toast.error('Failed to archive conversation');
      }
    },
    
    // Cleanup operations
    clearConversations: async (preserveCurrentConversation = false) => {
      try {
        const currentId = get().currentConversationId;
        const { clearMessages } = useMessageStore.getState();
        const { resetChatState, clearMiddlewareStorage } = useChatStore.getState();
        
        // Clear DB conversations
        const preserveId = preserveCurrentConversation ? currentId : null;
        await conversationService.clearAllConversations(preserveId);
        
        // Clear local state
        clearMessages();
        resetChatState();
        clearMiddlewareStorage();
        
        // If we're not preserving conversations, create a new one
        if (!preserveCurrentConversation) {
          const newConversationId = await get().createConversation();
          logger.info('New conversation created after clearing all', { newConversationId });
        }
        
        // Refresh conversations list
        await get().refreshConversations();
        
        toast.success(
          preserveCurrentConversation 
            ? 'All conversations except current cleared' 
            : 'All conversations cleared, new conversation created'
        );
      } catch (error) {
        logger.error('Error clearing conversations', { error });
        toast.error('Error clearing conversations');
      }
    },
    
    cleanupInactiveConversations: async () => {
      try {
        const currentId = get().currentConversationId;
        if (!currentId) {
          toast.error('No active conversation');
          return;
        }
        
        const result = await conversationService.clearAllConversations(currentId);
        if (result.success) {
          toast.success('Inactive conversations cleared');
          logger.info('Inactive conversations cleared', { preservedConversation: currentId });
          
          // Also clear local storage for inactive conversations
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('chat-conversation-') && !key.includes(currentId)) {
              localStorage.removeItem(key);
            }
          });
          
          await get().refreshConversations();
        } else {
          toast.error('Failed to clear inactive conversations');
          logger.error('Failed to clear inactive conversations', result.error);
        }
      } catch (error) {
        toast.error('Error cleaning up conversations');
        logger.error('Error in cleanupInactiveConversations', error);
      }
    },
  }))
);
