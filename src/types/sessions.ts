
export interface Session {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  tokens_used: number;
  message_count: number;
  metadata: Record<string, any>;
  archived: boolean;
  mode?: string;
  provider_id?: string;
}

export interface CreateSessionParams {
  title?: string;
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
  error?: any;
}

export interface DBSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  tokens_used?: number;
  message_count?: number;
  metadata?: Record<string, any>;
  mode?: string;
  archived: boolean;
  provider_id?: string;
  updated_at: string;
}
