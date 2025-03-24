
import { Json } from '@/integrations/supabase/types';

// Core session interface
export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string; // Make optional to match service type
  last_accessed: string;
  message_count: number;
  archived: boolean; // Changed from is_active to archived
  metadata?: Json;
  user_id?: string;
  mode?: string; // Add mode to align with service type
  context?: Json; // Add context to align with service type
  project_id?: string; // Add project_id for completeness
  provider_id?: string; // Add provider_id for completeness
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
  mode?: string;
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
