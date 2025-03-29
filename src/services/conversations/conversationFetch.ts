
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationOperationResult } from '@/components/chat/types/chat/conversation';
import { logger } from '@/services/chat/LoggingService';

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
    
    return data as Conversation[];
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return [];
  }
};

/**
 * Fetch a specific conversation by ID
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
    
    return data as Conversation;
  } catch (error) {
    logger.error('Failed to fetch conversation', { error, conversationId });
    return null;
  }
};

/**
 * Check if a conversation exists
 */
export const conversationExists = async (conversationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (error) {
    return false;
  }
};
