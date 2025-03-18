import { Json } from '@/integrations/supabase/types';

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active?: boolean;
  metadata?: Record<string, any>;
  user_id?: string;
  mode?: string;
  provider_id?: string;
  project_id?: string;
  tokens_used?: number;
  context?: Record<string, any>;
}

// Session status for UI representation
export type SessionStatus = 'active' | 'archived' | 'pending';

// Session operation result interface
export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  error?: Error | unknown;
  count?: number;
}

// Session creation parameters
export interface CreateSessionParams {
  title?: string;
  metadata?: Record<string, any>;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
}
