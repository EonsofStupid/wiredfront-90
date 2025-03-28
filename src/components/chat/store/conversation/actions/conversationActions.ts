
import { SetState, GetState } from '../types';
import { ConversationState } from '../types';
import { Conversation, CreateConversationParams } from '../../../types/conversation-types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode } from '@/types/chat/enums';

/**
 * Creates conversation actions for the conversation store
 */
export const createConversationActions = (
  set: SetState<ConversationState>,
  get: GetState<ConversationState>
): Pick<ConversationState, 'fetchConversations' | 'createConversation' | 'updateConversation' | 'archiveConversation' | 'deleteConversation' | 'setCurrentConversationId'> => {
  return {
    /**
     * Fetch all conversations for the current user
     */
    fetchConversations: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // Get authenticated user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        // Fetch conversations from database
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('last_accessed', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const conversations = data as Conversation[];
        
        set({ isLoading: false, conversations });
        logger.info('Fetched conversations', { count: conversations.length });
        return conversations;
      } catch (error) {
        logger.error('Failed to fetch conversations', { error });
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error : new Error(String(error))
        });
        return [];
      }
    },
    
    /**
     * Create a new conversation
     */
    createConversation: (params: CreateConversationParams = {}) => {
      try {
        const { conversations } = get();
        const now = new Date().toISOString();
        const id = uuidv4();
        
        const newConversation: Conversation = {
          id,
          title: params.title || 'New Conversation',
          created_at: now,
          updated_at: now,
          last_accessed: now,
          message_count: 0,
          archived: false,
          user_id: '', // Will be set by the server
          mode: params.mode || ChatMode.Chat,
          metadata: params.metadata || {},
        };
        
        // Add the conversation to the local state immediately
        set({
          conversations: [newConversation, ...conversations],
          currentConversationId: id
        });
        
        // Create the conversation in the database asynchronously
        (async () => {
          try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) {
              throw new Error('User not authenticated');
            }
            
            const { error } = await supabase
              .from('chat_conversations')
              .insert({
                ...newConversation,
                user_id: userData.user.id
              });
            
            if (error) {
              throw error;
            }
            
            logger.info('Created new conversation', { id });
          } catch (error) {
            logger.error('Failed to create conversation in database', { error, id });
          }
        })();
        
        return id;
      } catch (error) {
        logger.error('Failed to create conversation', { error });
        return '';
      }
    },
    
    /**
     * Update an existing conversation
     */
    updateConversation: async (id: string, updates: any) => {
      try {
        const { conversations } = get();
        
        // Update the conversation in the local state
        const updatedConversations = conversations.map(conv => 
          conv.id === id ? { ...conv, ...updates, updated_at: new Date().toISOString() } : conv
        );
        
        set({ conversations: updatedConversations });
        
        // Update the conversation in the database
        const { error } = await supabase
          .from('chat_conversations')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        logger.info('Updated conversation', { id });
        return true;
      } catch (error) {
        logger.error('Failed to update conversation', { error, id });
        return false;
      }
    },
    
    /**
     * Archive a conversation
     */
    archiveConversation: (id: string) => {
      try {
        const { conversations, currentConversationId } = get();
        
        // Update the conversation in the local state
        const updatedConversations = conversations.map(conv => 
          conv.id === id ? { ...conv, archived: true, updated_at: new Date().toISOString() } : conv
        );
        
        const newState: Partial<ConversationState> = { conversations: updatedConversations };
        
        // If the archived conversation is the current one, unset it
        if (currentConversationId === id) {
          newState.currentConversationId = null;
        }
        
        set(newState);
        
        // Update the conversation in the database asynchronously
        (async () => {
          try {
            const { error } = await supabase
              .from('chat_conversations')
              .update({
                archived: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', id);
            
            if (error) {
              throw error;
            }
            
            logger.info('Archived conversation', { id });
          } catch (error) {
            logger.error('Failed to archive conversation in database', { error, id });
          }
        })();
        
        return true;
      } catch (error) {
        logger.error('Failed to archive conversation', { error, id });
        return false;
      }
    },
    
    /**
     * Delete a conversation
     */
    deleteConversation: (id: string) => {
      try {
        const { conversations, currentConversationId } = get();
        
        // Remove the conversation from the local state
        const updatedConversations = conversations.filter(conv => conv.id !== id);
        
        const newState: Partial<ConversationState> = { conversations: updatedConversations };
        
        // If the deleted conversation is the current one, unset it
        if (currentConversationId === id) {
          newState.currentConversationId = null;
        }
        
        set(newState);
        
        // Delete the conversation from the database asynchronously
        (async () => {
          try {
            // First delete the messages
            const { error: messagesError } = await supabase
              .from('chat_messages')
              .delete()
              .eq('conversation_id', id);
            
            if (messagesError) {
              logger.error('Failed to delete conversation messages', { error: messagesError, id });
              // Continue with deletion anyway
            }
            
            // Then delete the conversation
            const { error } = await supabase
              .from('chat_conversations')
              .delete()
              .eq('id', id);
            
            if (error) {
              throw error;
            }
            
            logger.info('Deleted conversation', { id });
          } catch (error) {
            logger.error('Failed to delete conversation from database', { error, id });
          }
        })();
        
        return true;
      } catch (error) {
        logger.error('Failed to delete conversation', { error, id });
        return false;
      }
    },
    
    /**
     * Set the current conversation ID
     */
    setCurrentConversationId: (id: string | null) => {
      set({ currentConversationId: id });
      
      // Update the last accessed time in the database if an ID is provided
      if (id) {
        (async () => {
          try {
            const { error } = await supabase
              .from('chat_conversations')
              .update({
                last_accessed: new Date().toISOString()
              })
              .eq('id', id);
            
            if (error) {
              logger.error('Failed to update conversation last accessed time', { error, id });
            }
          } catch (error) {
            logger.error('Error updating conversation last accessed time', { error, id });
          }
        })();
      }
    }
  };
};
