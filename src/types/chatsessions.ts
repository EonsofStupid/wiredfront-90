
export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  user_id: string;
  archived: boolean;
  message_count: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
  mode: string;
  is_active?: boolean;
  tokens_used?: number;
  provider_id?: string;
}

export interface SessionOperationResult {
  success: boolean;
  data?: Session | null;
  error?: Error | null;
  sessionId?: string;
}

export interface CreateSessionParams {
  title?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSessionParams {
  title?: string;
  metadata?: Record<string, any>;
  archived?: boolean;
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
  archived: boolean;
  mode: string;
  provider_id?: string;
  updated_at?: string;
}
