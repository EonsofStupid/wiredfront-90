
import { ChatMode } from './chat/enums';
import { 
  Conversation, 
  CreateConversationParams, 
  UpdateConversationParams, 
  ConversationMetadata,
  chatModeToDbString,
  dbStringToChatMode,
  dbConversationToConversation
} from './chat/conversation';

// Re-export main conversation types
export type { 
  Conversation, 
  CreateConversationParams, 
  UpdateConversationParams, 
  ConversationMetadata 
};

/**
 * Result of a conversation operation
 */
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: Error | string;
  data?: any;
}

// Re-export utility functions
export { 
  chatModeToDbString, 
  dbStringToChatMode,
  dbConversationToConversation
};

/**
 * Convert creation parameters to database format
 * @param params Creation parameters
 * @returns Database-ready parameters
 */
export function createParamsToDbParams(params: CreateConversationParams): any {
  return {
    ...params,
    mode: params.mode ? chatModeToDbString(params.mode as ChatMode) : 'chat'
  };
}

/**
 * Convert update parameters to database format
 * @param params Update parameters
 * @returns Database-ready parameters
 */
export function updateParamsToDbParams(params: UpdateConversationParams): any {
  const dbParams = { ...params };
  if (params.mode) {
    dbParams.mode = chatModeToDbString(params.mode as ChatMode);
  }
  return dbParams;
}
