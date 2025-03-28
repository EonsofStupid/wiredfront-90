
import { ConversationState } from './types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';
import { 
  createConversation as apiCreateConversation,
  updateConversation as apiUpdateConversation,
  archiveConversation as apiArchiveConversation,
  deleteConversation as apiDeleteConversation,
  fetchConversations as apiFetchConversations
} from '@/services/conversations';
import { CreateConversationParams, UpdateConversationParams } from '@/types/chat/conversation';

/**
 * Create conversation actions for the store
 */
export const createConversationActions = (
  set: any,
  get: any
) => {
  return {
    // Fetch all conversations for the current user
    fetchConversations: async () => {
      try {
        set({ isLoading: true, error: null });
        const conversations = await apiFetchConversations();
        set({ conversations, isLoading: false });
        return conversations;
      } catch (error) {
        logger.error('Failed to fetch conversations', error);
        set({ 
          error: error instanceof Error ? error : new Error('Failed to fetch conversations'),
          isLoading: false
        });
        return [];
      }
    },

    // Create a new conversation
    createConversation: (params: CreateConversationParams = {}) => {
      try {
        // Generate a UUID for the conversation
        const conversationId = uuidv4();
        
        // Create conversation in the database (async)
        apiCreateConversation({
          ...params,
          id: conversationId
        }).catch(error => {
          logger.error('Failed to create conversation in database', error);
        });
        
        // Create conversation in local state immediately
        const now = new Date().toISOString();
        const newConversation = {
          id: conversationId,
          title: params.title || 'New Conversation',
          user_id: 'current-user', // Will be replaced with actual user ID
          mode: params.mode || 'chat',
          provider_id: params.provider_id || null,
          created_at: now,
          updated_at: now,
          last_accessed: now,
          tokens_used: 0,
          project_id: params.project_id || null,
          metadata: params.metadata || {},
          context: params.context || {},
          archived: false,
          message_count: 0
        };
        
        set(state => ({
          conversations: [newConversation, ...state.conversations]
        }));
        
        logger.info('Created new conversation', { conversationId });
        return conversationId;
      } catch (error) {
        logger.error('Failed to create conversation', error);
        return '';
      }
    },

    // Update an existing conversation
    updateConversation: async (id: string, params: UpdateConversationParams) => {
      try {
        // Update conversation in the database
        const success = await apiUpdateConversation(id, params);
        
        if (success) {
          // Update conversation in local state
          set(state => ({
            conversations: state.conversations.map(conv => 
              conv.id === id 
                ? { ...conv, ...params, updated_at: new Date().toISOString() } 
                : conv
            )
          }));
        }
        
        return success;
      } catch (error) {
        logger.error('Failed to update conversation', error);
        return false;
      }
    },

    // Archive a conversation
    archiveConversation: (id: string) => {
      try {
        // Archive conversation in the database (async)
        apiArchiveConversation(id).catch(error => {
          logger.error('Failed to archive conversation in database', error);
        });
        
        // Update local state immediately
        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === id 
              ? { ...conv, archived: true, updated_at: new Date().toISOString() } 
              : conv
          )
        }));
        
        // If this was the current conversation, clear it
        if (get().currentConversationId === id) {
          set({ currentConversationId: null });
        }
        
        return true;
      } catch (error) {
        logger.error('Failed to archive conversation', error);
        return false;
      }
    },

    // Delete a conversation
    deleteConversation: (id: string) => {
      try {
        // Delete conversation in the database (async)
        apiDeleteConversation(id).catch(error => {
          logger.error('Failed to delete conversation from database', error);
        });
        
        // Update local state immediately
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== id)
        }));
        
        // If this was the current conversation, clear it
        if (get().currentConversationId === id) {
          set({ currentConversationId: null });
        }
        
        return true;
      } catch (error) {
        logger.error('Failed to delete conversation', error);
        return false;
      }
    },

    // Set the current conversation ID
    setCurrentConversationId: (id: string | null) => {
      set({ currentConversationId: id });
    }
  };
};
