
// Define a more specific type for conversation metadata to break the recursive Json type chain
export interface ConversationMetadata {
  mode?: string;
  context?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  lastPosition?: { x: number; y: number };
  providerId?: string;
  [key: string]: unknown; // Allow other properties while keeping type safety
}

// Core conversation interface
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active?: boolean; // Derived from !archived for backward compatibility
  archived?: boolean;  // The actual DB field
  metadata?: ConversationMetadata;  // Using a specific type instead of Json
  user_id?: string;
}

// Conversation status for UI representation
export type ConversationStatus = 'active' | 'archived' | 'pending';

// Conversation operation result interface
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: Error | unknown;
}

// Conversation creation parameters
export interface CreateConversationParams {
  title?: string;
  metadata?: Partial<ConversationMetadata>;
}

// Conversation update parameters
export interface UpdateConversationParams {
  title?: string;
  archived?: boolean; // Use archived instead of is_active
  metadata?: Partial<ConversationMetadata>;
}
