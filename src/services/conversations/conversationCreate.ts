
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { 
  Conversation,
  CreateConversationParams,
  chatModeToDbString,
  createParamsToDbParams,
  dbConversationToConversation
} from '@/components/chat/types/chat/conversation';
import { ChatMode } from '@/components/chat/types/chat/enums';

/**
 * Create a new conversation
 */
export const createConversation = async (params: CreateConversationParams = {}): Promise<string> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const now = new Date().toISOString();
    const conversationId = uuidv4();
    
    // Ensure mode is properly converted to string format for the database
    const mode = params.mode ? chatModeToDbString(params.mode) : 'chat';
    
    // Create the conversation object
    const conversation = {
      id: conversationId,
      title: params.title || 'New Conversation',
      user_id: userData.user.id,
      created_at: now,
      updated_at: now,
      last_accessed: now,
      message_count: 0,
      archived: false,
      metadata: params.metadata || {},
      project_id: params.project_id || null,
      mode,
      provider_id: params.provider_id || null,
      context: params.context || {}
    };
    
    const { error } = await supabase
      .from('chat_conversations')
      .insert(conversation);
    
    if (error) {
      throw error;
    }
    
    return conversationId;
  } catch (error: any) {
    console.error('Failed to create conversation:', error.message || error);
    throw error;
  }
};
