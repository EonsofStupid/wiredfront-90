
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';
import { Conversation, CreateConversationParams, UpdateConversationParams } from '@/types/conversations';

const CONVERSATIONS_TABLE = 'chat_conversations';

/**
 * Creates a new conversation
 */
export const createConversation = async (params: CreateConversationParams): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const now = new Date().toISOString();
    const conversationId = uuidv4();
    
    const conversation: Partial<Conversation> = {
      id: conversationId,
      title: params.title || 'New Conversation',
      user_id: userData.user.id,
      mode: params.mode || 'chat',
      provider_id: params.provider_id,
      created_at: now,
      updated_at: now,
      last_accessed: now,
      metadata: params.metadata || {},
      context: params.context || {},
      archived: false,
      project_id: params.project_id,
      message_count: 0
    };
    
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .insert(conversation);
    
    if (error) {
      throw error;
    }
    
    logger.info('Created new conversation', { conversationId });
    return conversationId;
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return null;
  }
};

/**
 * Updates an existing conversation
 */
export const updateConversation = async (conversationId: string, updates: UpdateConversationParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Updated conversation', { conversationId, updates });
    return true;
  } catch (error) {
    logger.error('Failed to update conversation', { error, conversationId });
    return false;
  }
};

/**
 * Archives a conversation
 */
export const archiveConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .update({
        archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Archived conversation', { conversationId });
    return true;
  } catch (error) {
    logger.error('Failed to archive conversation', { error, conversationId });
    return false;
  }
};

/**
 * Deletes a conversation permanently
 */
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    // First, delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('conversation_id', conversationId);
    
    if (messagesError) {
      logger.error('Failed to delete conversation messages', { error: messagesError, conversationId });
      // Continue with deletion anyway
    }
    
    // Then delete the conversation itself
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .delete()
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Deleted conversation', { conversationId });
    return true;
  } catch (error) {
    logger.error('Failed to delete conversation', { error, conversationId });
    return false;
  }
};

/**
 * Fetches all conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .select('*')
      .eq('user_id', userData.user.id)
      .order('last_accessed', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Conversation[];
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return [];
  }
};

/**
 * Fetches a specific conversation by ID
 */
export const fetchConversationById = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Conversation;
  } catch (error) {
    logger.error('Failed to fetch conversation', { error, conversationId });
    return null;
  }
};

/**
 * Touch a conversation to update its last_accessed time
 */
export const touchConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .update({
        last_accessed: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to touch conversation', { error, conversationId });
    return false;
  }
};
