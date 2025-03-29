
import { ChatMode } from '@/types/chat/enums';

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
 * Conversation store state
 */
export interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // Required actions
  fetchConversations: () => Promise<void>;
  createConversation: (params?: CreateConversationParams) => string;
  updateConversation: (id: string, updates: UpdateConversationParams) => Promise<boolean>;
  archiveConversation: (id: string) => boolean;
  deleteConversation: (id: string) => boolean;
  setCurrentConversationId: (id: string | null) => void;
}

/**
 * Function to convert database mode to chat mode enum
 */
export function dbModeToChatMode(mode: string): ChatMode {
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
 * Function to convert chat mode enum to database string
 */
export function chatModeToDbString(mode: ChatMode): string {
  switch (mode) {
    case ChatMode.Chat: return 'chat';
    case ChatMode.Dev: return 'dev';
    case ChatMode.Editor: return 'editor';
    case ChatMode.Image: return 'image';
    case ChatMode.Training: return 'training';
    case ChatMode.Planning: return 'planning';
    case ChatMode.Code: return 'code';
    case ChatMode.Document: return 'document';
    case ChatMode.Audio: return 'audio';
    default: return 'chat';
  }
}
