
import { ConversationState, SetState, GetState } from '../types';
import { Conversation, CreateConversationParams, UpdateConversationParams } from '../../../types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create actions for the conversation store
 */
export const createConversationActions = (
  set: SetState<ConversationState>,
  get: GetState<ConversationState>
) => {
  return {
    /**
     * Fetch conversations for the current user
     */
    fetchConversations: async (): Promise<Conversation[]> => {
      try {
        set({ isLoading: true, error: null });
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          throw new Error('User not authenticated');
        }
        
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('last_accessed', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const conversations = data as Conversation[];
        
        set({ 
          conversations,
          isLoading: false 
        });
        
        logger.info('Fetched conversations', { count: conversations.length });
        
        return conversations;
      } catch (error) {
        logger.error('Failed to fetch conversations', { error });
        
        set({ 
          error: error as Error,
          isLoading: false 
        });
        
        return [];
      }
    },
    
    /**
     * Create a new conversation
     */
    createConversation: (params?: CreateConversationParams): string => {
      try {
        const conversationId = uuidv4();
        const now = new Date().toISOString();
        
        // Create a new conversation in memory
        const newConversation: Conversation = {
          id: conversationId,
          title: params?.title || 'New Conversation',
          created_at: now,
          last_accessed: now,
          message_count: 0,
          archived: false,
          metadata: params?.metadata || {},
          project_id: params?.project_id
        };
        
        // Add to store immediately for UI responsiveness
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: conversationId
        }));
        
        // Then create in database asynchronously
        supabase.auth.getUser().then(({ data: userData }) => {
          if (!userData?.user) {
            throw new Error('User not authenticated');
          }
          
          supabase
            .from('conversations')
            .insert({
              ...newConversation,
              user_id: userData.user.id
            })
            .then(({ error }) => {
              if (error) {
                throw error;
              }
              
              logger.info('Created conversation', { conversationId });
            });
        });
        
        return conversationId;
      } catch (error) {
        logger.error('Failed to create conversation', { error });
        return '';
      }
    },
    
    /**
     * Update an existing conversation
     */
    updateConversation: async (id: string, params: UpdateConversationParams): Promise<boolean> => {
      try {
        // Update in memory first for UI responsiveness
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id ? { ...c, ...params } : c
          )
        }));
        
        // Then update in database
        const { error } = await supabase
          .from('conversations')
          .update({
            ...params,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        logger.info('Updated conversation', { conversationId: id, params });
        
        return true;
      } catch (error) {
        logger.error('Failed to update conversation', { error, conversationId: id });
        return false;
      }
    },
    
    /**
     * Archive a conversation
     */
    archiveConversation: (id: string): boolean => {
      try {
        // Update in memory first for UI responsiveness
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id ? { ...c, archived: true } : c
          )
        }));
        
        // Then update in database
        supabase
          .from('conversations')
          .update({
            archived: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              throw error;
            }
            
            logger.info('Archived conversation', { conversationId: id });
          });
        
        return true;
      } catch (error) {
        logger.error('Failed to archive conversation', { error, conversationId: id });
        return false;
      }
    },
    
    /**
     * Delete a conversation
     */
    deleteConversation: (id: string): boolean => {
      try {
        // Update in memory first for UI responsiveness
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          // Reset current conversation if it was the deleted one
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
        }));
        
        // Then delete from database
        supabase
          .from('conversations')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              throw error;
            }
            
            logger.info('Deleted conversation', { conversationId: id });
          });
        
        return true;
      } catch (error) {
        logger.error('Failed to delete conversation', { error, conversationId: id });
        return false;
      }
    },
    
    /**
     * Set the current conversation ID
     */
    setCurrentConversationId: (id: string | null) => {
      logger.info('Setting current conversation ID', { id });
      
      set({ currentConversationId: id });
      
      // Update last_accessed if we have a valid conversation ID
      if (id) {
        const now = new Date().toISOString();
        
        // Update in memory first for UI responsiveness
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === id ? { ...c, last_accessed: now } : c
          )
        }));
        
        // Then update in database
        supabase
          .from('conversations')
          .update({ last_accessed: now })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              logger.error('Failed to update conversation last_accessed', { error, conversationId: id });
            }
          });
      }
    }
  };
};
