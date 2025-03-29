
import { ChatMode } from './enums';

/**
 * Conversation interface representing a chat conversation
 */
export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  mode: ChatMode;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  metadata: Record<string, any>;
  context: Record<string, any>;
  archived: boolean;
  project_id: string | null;
  message_count: number;
  tokens_used: number | null;
}

/**
 * Database representation of a conversation (with string mode)
 */
export interface DbConversation {
  id: string;
  title: string;
  user_id: string;
  mode: string;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  metadata: Record<string, any>;
  context: Record<string, any>;
  archived: boolean;
  project_id: string | null;
  message_count: number;
  tokens_used: number | null;
}

/**
 * Parameters for creating a new conversation
 */
export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string | null;
  project_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
}

/**
 * Database parameters for creating a new conversation
 */
export interface DbCreateConversationParams {
  id: string;
  title: string;
  user_id: string;
  mode: string;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  metadata: Record<string, any>;
  context: Record<string, any>;
  archived: boolean;
  project_id: string | null;
  message_count: number;
}

/**
 * Parameters for updating an existing conversation
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string | null;
  project_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
}

/**
 * Database parameters for updating an existing conversation
 */
export interface DbUpdateConversationParams {
  title?: string;
  mode?: string;
  provider_id?: string | null;
  project_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
  updated_at: string;
}

/**
 * Metadata associated with a conversation
 */
export interface ConversationMetadata {
  projectContext?: {
    repository?: string;
    branch?: string;
    files?: string[];
    commit?: string;
  };
  userContext?: {
    preferences?: Record<string, any>;
    history?: string[];
  };
  sessionData?: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    tokensUsed?: number;
  };
  tags?: string[];
  custom?: Record<string, any>;
}

/**
 * Conversation operation result
 */
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: string;
  message?: string;
}

/**
 * Convert ChatMode to database string
 */
export function chatModeToDbString(mode: ChatMode): string {
  return mode.toString();
}

/**
 * Convert database mode string to ChatMode
 */
export function dbStringToChatMode(mode: string): ChatMode {
  switch (mode) {
    case 'chat': return ChatMode.Chat;
    case 'dev': return ChatMode.Dev;
    case 'editor': return ChatMode.Editor;
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
 * Convert a Conversation to DbConversation for database operations
 */
export function conversationToDbConversation(conversation: Partial<Conversation>): Partial<DbConversation> {
  if (!conversation) return {};
  
  return {
    ...conversation,
    mode: conversation.mode ? chatModeToDbString(conversation.mode) : undefined
  };
}

/**
 * Convert a DbConversation from database to Conversation
 */
export function dbConversationToConversation(dbConversation: DbConversation): Conversation {
  return {
    ...dbConversation,
    mode: dbStringToChatMode(dbConversation.mode)
  };
}

/**
 * Convert CreateConversationParams to DbCreateConversationParams
 */
export function createParamsToDbParams(params: CreateConversationParams, userId: string, id: string): DbCreateConversationParams {
  const now = new Date().toISOString();
  
  return {
    id,
    title: params.title || 'New Conversation',
    user_id: userId,
    mode: params.mode ? chatModeToDbString(params.mode) : 'chat',
    provider_id: params.provider_id || null,
    created_at: now,
    updated_at: now,
    last_accessed: now,
    metadata: params.metadata || {},
    context: params.context || {},
    archived: false,
    project_id: params.project_id || null,
    message_count: 0
  };
}

/**
 * Convert UpdateConversationParams to DbUpdateConversationParams
 */
export function updateParamsToDbParams(params: UpdateConversationParams): DbUpdateConversationParams {
  const result: DbUpdateConversationParams = {
    updated_at: new Date().toISOString()
  };
  
  if (params.title !== undefined) result.title = params.title;
  if (params.mode !== undefined) result.mode = chatModeToDbString(params.mode);
  if (params.provider_id !== undefined) result.provider_id = params.provider_id;
  if (params.project_id !== undefined) result.project_id = params.project_id;
  if (params.metadata !== undefined) result.metadata = params.metadata;
  if (params.context !== undefined) result.context = params.context;
  if (params.archived !== undefined) result.archived = params.archived;
  
  return result;
}
