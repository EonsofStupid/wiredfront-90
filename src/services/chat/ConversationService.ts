
import { supabase } from '@/integrations/supabase/client';
import { CreateConversationParams, UpdateConversationParams, Conversation } from '@/types/chat/conversation';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './LoggingService';
import { EnumUtils } from '@/lib/enums';

/**
 * Create a new conversation in the database
 */
export const createConversation = async (params: CreateConversationParams): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const now = new Date().toISOString();
    const conversationId = uuidv4();
    
    // Convert ChatMode enum to string for database
    const dbMode = params.mode ? EnumUtils.chatModeToString(params.mode) : 'chat';
    
    const conversation = {
      id: conversationId,
      title: params.title || 'New Conversation',
      user_id: userData.user.id,
      created_at: now,
      last_accessed: now,
      updated_at: now,
      message_count: 0,
      archived: false,
      metadata: params.metadata || {},
      project_id: params.project_id,
      mode: dbMode,
      provider_id: params.provider_id,
      context: params.context || {}
    };
    
    // Insert into the chat_conversations table
    const { error } = await supabase
      .from('chat_conversations')
      .insert(conversation);
    
    if (error) {
      throw error;
    }
    
    logger.info('Conversation created', { conversationId });
    
    return conversationId;
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return null;
  }
};

/**
 * Update an existing conversation
 */
export const updateConversation = async (conversationId: string, updates: UpdateConversationParams): Promise<boolean> => {
  try {
    // Convert ChatMode enum to string for database if it exists
    const dbUpdates: any = { ...updates };
    if (updates.mode) {
      dbUpdates.mode = EnumUtils.chatModeToString(updates.mode);
    }
    
    const { error } = await supabase
      .from('chat_conversations')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Conversation updated', { conversationId });
    
    return true;
  } catch (error) {
    logger.error('Failed to update conversation', { error, conversationId });
    return false;
  }
};

/**
 * Archive a conversation
 */
export const archiveConversation = async (conversationId: string): Promise<boolean> => {
  try {
    return await updateConversation(conversationId, { archived: true });
  } catch (error) {
    logger.error('Failed to archive conversation', { error, conversationId });
    return false;
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    logger.info('Conversation deleted', { conversationId });
    
    return true;
  } catch (error) {
    logger.error('Failed to delete conversation', { error, conversationId });
    return false;
  }
};

/**
 * Fetch all conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
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
    
    logger.info('Fetched conversations', { count: data.length });
    
    // Convert string modes from DB to ChatMode enum
    const conversations = data.map(conv => ({
      ...conv,
      mode: EnumUtils.stringToChatMode(conv.mode as string)
    })) as Conversation[];
    
    return conversations;
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return [];
  }
};

/**
 * Fetch a single conversation by ID
 */
export const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info('Fetched conversation', { conversationId });
    
    // Convert string mode from DB to ChatMode enum
    const conversation = {
      ...data,
      mode: EnumUtils.stringToChatMode(data.mode as string)
    } as Conversation;
    
    return conversation;
  } catch (error) {
    logger.error('Failed to fetch conversation', { error, conversationId });
    return null;
  }
};
