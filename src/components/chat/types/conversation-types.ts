
import { ChatMode } from './chat/enums';
import { Conversation, CreateConversationParams, UpdateConversationParams, ConversationMetadata } from './chat/conversation';

// Re-export main conversation types
export type { Conversation, CreateConversationParams, UpdateConversationParams, ConversationMetadata };

/**
 * Result of a conversation operation
 */
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: Error | string;
  data?: any;
}

/**
 * Convert database string to ChatMode enum value
 * @param dbMode String mode from database
 * @returns ChatMode enum value
 */
export function dbStringToChatMode(dbMode: string): ChatMode {
  switch (dbMode.toLowerCase()) {
    case 'chat': return ChatMode.Chat;
    case 'dev': 
    case 'editor': return ChatMode.Dev;
    case 'image': return ChatMode.Image;
    case 'training': return ChatMode.Training;
    case 'planning': return ChatMode.Planning;
    case 'code': return ChatMode.Code;
    case 'document': return ChatMode.Document;
    case 'audio': return ChatMode.Audio;
    default: return ChatMode.Chat;
  }
}

/**
 * Convert ChatMode enum to database string format
 * @param mode ChatMode enum value
 * @returns String representation for database
 */
export function chatModeToDbString(mode: ChatMode): string {
  return mode.toString();
}

/**
 * Convert a database conversation to app Conversation type
 * @param dbConversation Conversation from database
 * @returns Conversation with proper types
 */
export function dbConversationToConversation(dbConversation: any): Conversation {
  return {
    ...dbConversation,
    mode: dbStringToChatMode(dbConversation.mode)
  };
}

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
