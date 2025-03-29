
import { ChatMode } from './enums';

/**
 * Core conversation type
 */
export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  mode: ChatMode | string;
  provider_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
  project_id?: string | null;
  message_count?: number;
  tokens_used?: number | null;
}

/**
 * Parameters for creating a new conversation
 */
export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode | string;
  provider_id?: string | null;
  project_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  id?: string;
}

/**
 * Parameters for updating an existing conversation
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode | string;
  provider_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
  message_count?: number;
  tokens_used?: number | null;
}

/**
 * Convert ChatMode to database string format
 * @param mode ChatMode enum value
 * @returns string representation for database
 */
export function chatModeToDbString(mode: ChatMode): string {
  return mode.toString();
}

/**
 * Convert database string to ChatMode enum
 * @param dbMode string from database
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
