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
  is_active?: boolean; // Add this property to fix the error
}

export interface SessionOperationResult {
  success: boolean;
  data?: Session | null;
  error?: Error | null;
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
