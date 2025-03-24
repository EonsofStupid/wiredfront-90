
import { Json } from '@/integrations/supabase/types';
import { ChatMode } from '@/integrations/supabase/types/enums';

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  last_accessed: string;
  message_count: number;
  archived: boolean;
  metadata?: Json;
  user_id?: string;
  mode?: ChatMode; // Use the standard ChatMode type
  context?: Json;
  project_id?: string;
  provider_id?: string;
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
  mode?: ChatMode; // Use the standard ChatMode type
  project_id?: string;
  provider_id?: string;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  archived?: boolean;
  metadata?: Json;
  last_accessed?: string;
  context?: Json;
}
