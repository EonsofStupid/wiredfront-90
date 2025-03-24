
import { Json } from '@/integrations/supabase/types';

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  archived?: boolean; // Changed from is_active to archived
  metadata?: Json;
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
  metadata?: Json;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  archived?: boolean; // Changed from is_active to archived
  metadata?: Json;
}
