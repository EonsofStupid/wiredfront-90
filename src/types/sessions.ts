
import { Json } from '@/integrations/supabase/types';

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

export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  error?: Error | unknown;
}
