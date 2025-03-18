
import { Json } from '@/integrations/supabase/types';

export interface Session {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  message_count?: number;
  metadata?: Json;
}

export interface CreateSessionParams {
  title?: string;
  metadata?: Json;
}

export interface UpdateSessionParams {
  title?: string;
  is_active?: boolean;
  metadata?: Json;
}

export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  error?: any;
  count?: number;
}
