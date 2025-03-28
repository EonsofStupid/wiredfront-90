
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, CreateConversationParams, UpdateConversationParams } from '@/types/chat/conversation';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { ChatMode } from '@/types/chat/enums';
import { toast } from 'sonner';

/**
 * Primary hook for managing conversations in the chat system
 */
export function useConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { clearMessages, fetchMessages } = useMessageStore();

  // Get the current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

  // Fetch conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when current conversation changes
  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    } else {
      clearMessages();
    }
  }, [currentConversationId, fetchMessages, clearMessages]);

  // Refresh conversations from the database
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('last_accessed', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setConversations(data as Conversation[]);
      logger.info(`Loaded ${data.length} conversations`);
      
      return data as Conversation[];
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error('Failed to fetch conversations', { error: err });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (params: CreateConversationParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const now = new Date().toISOString();
      const conversationId = uuidv4();
      
      const conversation: Conversation = {
        id: conversationId,
        title: params.title || 'New Conversation',
        user_id: userData.user.id,
        mode: params.mode || ChatMode.Chat,
        provider_id: params.provider_id || null,
        created_at: now,
        updated_at: now,
        last_accessed: now,
        metadata: params.metadata || {},
        context: params.context || {},
        archived: false,
        project_id: params.project_id || null,
        message_count: 0,
        tokens_used: null
      };
      
      const { error } = await supabase
        .from('chat_conversations')
        .insert(conversation);
      
      if (error) {
        throw error;
      }
      
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversationId(conversationId);
      
      logger.info('Created new conversation', { conversationId });
      toast.success('New conversation created');
      
      return conversationId;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error('Failed to create conversation', { error: err });
      toast.error('Failed to create conversation');
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to a different conversation
  const switchConversation = useCallback((conversationId: string) => {
    // Update last_accessed time in the database
    supabase
      .from('chat_conversations')
      .update({
        last_accessed: new Date().toISOString()
      })
      .eq('id', conversationId)
      .then(() => {
        setCurrentConversationId(conversationId);
        logger.info('Switched to conversation', { conversationId });
        
        // Update the conversation in our local state as well
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, last_accessed: new Date().toISOString() } 
              : conv
          )
        );
        
        // Load messages for this conversation
        fetchMessages(conversationId);
      })
      .catch(err => {
        logger.error('Failed to update conversation last_accessed time', { error: err });
      });
      
      return true;
  }, [fetchMessages]);

  // Update a conversation
  const updateConversation = useCallback(async (conversationId: string, updates: UpdateConversationParams) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
      
      if (error) {
        throw error;
      }
      
      // Update in local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, ...updates, updated_at: new Date().toISOString() } 
            : conv
        )
      );
      
      logger.info('Updated conversation', { conversationId, updates });
      return true;
    } catch (err) {
      logger.error('Failed to update conversation', { error: err, conversationId });
      return false;
    }
  }, []);

  // Archive a conversation
  const archiveConversation = useCallback((conversationId: string) => {
    try {
      // Update in local state first for immediate feedback
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, archived: true, updated_at: new Date().toISOString() } 
            : conv
        )
      );

      // If this was the current conversation, switch away from it
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        clearMessages();
      }

      // Then update in the database
      supabase
        .from('chat_conversations')
        .update({
          archived: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .then(() => {
          logger.info('Archived conversation', { conversationId });
          toast.success('Conversation archived');
        })
        .catch(err => {
          logger.error('Failed to archive conversation', { error: err });
          toast.error('Failed to archive conversation');
        });
      
      return true;
    } catch (err) {
      logger.error('Failed to archive conversation', { error: err });
      return false;
    }
  }, [currentConversationId, clearMessages]);

  // Delete a conversation permanently
  const deleteConversation = useCallback((conversationId: string) => {
    try {
      // Remove from local state first for immediate feedback
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If this was the current conversation, switch away from it
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        clearMessages();
      }
      
      // Then delete from the database
      (async () => {
        try {
          // First, delete all messages in the conversation
          const { error: messagesError } = await supabase
            .from('chat_messages')
            .delete()
            .eq('conversation_id', conversationId);
          
          if (messagesError) {
            logger.warn('Failed to delete conversation messages', { error: messagesError });
            // Continue with deletion anyway
          }
          
          // Then delete the conversation itself
          const { error } = await supabase
            .from('chat_conversations')
            .delete()
            .eq('id', conversationId);
          
          if (error) {
            throw error;
          }
          
          logger.info('Deleted conversation', { conversationId });
          toast.success('Conversation deleted');
        } catch (err) {
          logger.error('Failed to delete conversation from database', { error: err });
          toast.error('Failed to delete conversation');
        }
      })();
      
      return true;
    } catch (err) {
      logger.error('Failed to delete conversation', { error: err });
      return false;
    }
  }, [currentConversationId, clearMessages]);

  // Clear all conversations
  const clearConversations = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('user_id', userData.user.id);
      
      if (error) {
        throw error;
      }
      
      setConversations([]);
      setCurrentConversationId(null);
      clearMessages();
      
      logger.info('Cleared all conversations');
      toast.success('All conversations cleared');
      return true;
    } catch (err) {
      logger.error('Failed to clear conversations', { error: err });
      toast.error('Failed to clear conversations');
      return false;
    }
  }, [clearMessages]);

  // Cleanup inactive conversations (older than 30 days)
  const cleanupInactiveConversations = useCallback(async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .lt('last_accessed', thirtyDaysAgo.toISOString());
      
      if (error) {
        throw error;
      }
      
      // Refresh conversations to get updated list
      await loadConversations();
      
      logger.info('Cleaned up inactive conversations');
      toast.success('Inactive conversations cleaned up');
      return true;
    } catch (err) {
      logger.error('Failed to cleanup inactive conversations', { error: err });
      toast.error('Failed to cleanup inactive conversations');
      return false;
    }
  }, [loadConversations]);

  return {
    conversations,
    currentConversationId,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    createConversation,
    switchConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    setCurrentConversationId,
    clearConversations,
    cleanupInactiveConversations
  };
}
