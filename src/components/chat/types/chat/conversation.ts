
import { ChatMode } from '@/types/enums';

/**
 * Conversation interface
 */
export interface Conversation {
  id: string;
  userId: string;
  mode: ChatMode;
  providerId?: string;
  createdAt: string;
  lastAccessed: string;
  tokensUsed: number;
  projectId?: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived: boolean;
  updatedAt: string;
  messageCount?: number;
  title?: string;
}

/**
 * Create conversation parameters
 */
export interface CreateConversationParams {
  userId: string;
  mode: ChatMode;
  providerId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
  title?: string;
}

/**
 * Update conversation parameters
 */
export interface UpdateConversationParams {
  title?: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
  lastAccessed?: string;
  tokensUsed?: number;
  messageCount?: number;
}

/**
 * Conversation operation result
 */
export interface ConversationOperationResult {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

/**
 * Conversation metadata
 */
export interface ConversationMetadata {
  title?: string;
  project?: {
    id: string;
    name: string;
  };
  githubRepo?: string;
  customData?: Record<string, any>;
}
