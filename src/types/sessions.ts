
/**
 * Clean types for session management without recursive dependencies
 */

// Define our own metadata type instead of using Json to avoid recursive dependencies
export type SessionMetadata = {
  providerId?: string;
  mode?: string;
  models?: string[];
  tags?: string[];
  projectId?: string;
  [key: string]: any;
};

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active?: boolean; 
  archived?: boolean;  
  metadata?: SessionMetadata;
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
  metadata?: SessionMetadata;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  archived?: boolean;
  metadata?: SessionMetadata;
}
