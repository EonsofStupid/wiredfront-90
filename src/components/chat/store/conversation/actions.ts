
import {
  fetchConversations as fetchConversationsService,
  createConversation as createConversationService,
  archiveConversation as archiveConversationService,
  updateConversation as updateConversationService,
  deleteConversation as deleteConversationService
} from '@/services/conversations';

import { logger } from '@/services/chat/LoggingService';
import { Conversation, CreateConversationParams } from '@/components/chat/types/chat/conversation';

// Re-export conversation services
export { 
  fetchConversationsService,
  createConversationService,
  archiveConversationService,
  updateConversationService,
  deleteConversationService
};

// Create a new conversation
export const createConversation = async (params: CreateConversationParams): Promise<string | null> => {
  try {
    const conversationId = await createConversationService(params);
    return conversationId;
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return null;
  }
};

// Update an existing conversation
export const updateConversation = async (
  id: string, 
  updates: Partial<Conversation>
): Promise<boolean> => {
  try {
    // Note: Conversation type needs to be mapped to database-friendly values
    await updateConversationService(id, updates as any);
    return true;
  } catch (error) {
    logger.error('Failed to update conversation', { error, id });
    return false;
  }
};

// Archive a conversation (mark as archived)
export const archiveConversation = async (id: string): Promise<boolean> => {
  try {
    await archiveConversationService(id);
    return true;
  } catch (error) {
    logger.error('Failed to archive conversation', { error, id });
    return false;
  }
};

// Delete a conversation completely
export const deleteConversation = async (id: string): Promise<boolean> => {
  try {
    await deleteConversationService(id);
    return true;
  } catch (error) {
    logger.error('Failed to delete conversation', { error, id });
    return false;
  }
};

// Fetch all conversations
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const conversations = await fetchConversationsService();
    return conversations;
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return [];
  }
};
