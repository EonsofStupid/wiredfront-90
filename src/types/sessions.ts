
import { Json } from '@/integrations/supabase/types';
import { ChatMode } from '@/components/chat/chatbridge/types';

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
  providerId?: string;  // Added providerId property
  mode?: ChatMode;      // Added mode property
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
  mode?: ChatMode;
  providerId?: string;
}

// Session update parameters
export interface UpdateSessionParams {
  title?: string;
  is_active?: boolean;
  metadata?: Json;
}
