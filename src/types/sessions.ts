
// Define a more specific type for session metadata to break the recursive Json type chain
export interface SessionMetadata {
  mode?: string;
  context?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  lastPosition?: { x: number; y: number };
  providerId?: string;
  [key: string]: unknown; // Allow other properties while keeping type safety
}

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active?: boolean; // Derived from !archived for backward compatibility
  archived?: boolean;  // The actual DB field
  metadata?: SessionMetadata;  // Using a specific type instead of Json
  user_id?: string;
}

// Session status for UI representation
export type SessionStatus = 'active' | 'archived' | 'pending';

// Session operation result interface
export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  error?: Error | unknown;
}

// Session creation parameters
export interface CreateSessionParams {
  title?: string;
  metadata?: Partial<SessionMetadata>;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  archived?: boolean; // Use archived instead of is_active
  metadata?: Partial<SessionMetadata>;
}
