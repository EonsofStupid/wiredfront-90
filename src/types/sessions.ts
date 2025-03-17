
import { Json } from '@/integrations/supabase/types';
import { IdOperationResult } from './core/operation-results';

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active?: boolean;
  metadata?: Json;
  user_id?: string;
}

// Session status for UI representation
export type SessionStatus = 'active' | 'archived' | 'pending';

// Session operation result interface - now extends IdOperationResult
export interface SessionOperationResult extends IdOperationResult<string> {
  sessionId?: string;
}

// Session creation parameters
export interface CreateSessionParams {
  title?: string;
  metadata?: Json;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  is_active?: boolean;
  metadata?: Json;
}
