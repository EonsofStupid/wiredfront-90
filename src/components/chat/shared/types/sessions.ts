
// Define chat session types that were previously imported from @/types/sessions
export interface Session {
  id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at?: string;
  last_accessed: string;
  tokens_used?: number;
  message_count: number;
  metadata: Record<string, any>;
  archived?: boolean;
  mode?: string;
  provider_id?: string;
  is_active?: boolean;
  context?: Record<string, any>;
}

export interface DBSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  last_accessed: string;
  tokens_used?: number;
  message_count?: number;
  metadata?: Record<string, any>;
  archived?: boolean;
  mode?: string;
  provider_id?: string;
}

export interface CreateSessionParams {
  title?: string;
  mode?: string;
  provider_id?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSessionParams {
  title?: string;
  archived?: boolean;
  metadata?: Record<string, any>;
}

export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  error?: Error | unknown;
}
