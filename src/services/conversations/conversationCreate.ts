
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, CreateConversationParams, ConversationOperationResult } from '@/types/chat/conversation';
import { logger } from '@/services/chat/LoggingService';

/**
 * Create a new conversation
 */
export const createConversation = async (
  params: CreateConversationParams = {}
): Promise<ConversationOperationResult> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return {
        success: false,
        error: new Error('User not authenticated')
      };
    }
    
    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    const conversationData: Partial<Conversation> = {
      id: conversationId,
      title: params.title || 'New Conversation',
      user_id: userData.user.id,
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
    
    const { error } = await supabase
      .from('chat_conversations')
      .insert(conversationData);
    
    if (error) {
      logger.error('Failed to create conversation', { error, params });
      return {
        success: false,
        error
      };
    }
    
    logger.info('Created new conversation', { 
      conversationId, 
      title: conversationData.title,
      mode: conversationData.mode
    });
    
    return {
      success: true,
      conversationId
    };
  } catch (error) {
    logger.error('Error in createConversation', { error, params });
    return {
      success: false,
      error
    };
  }
};
