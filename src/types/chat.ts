import { Json } from '@/integrations/supabase/types';

export interface Message {
  id: string;
  content: string;
  user_id: string;
  type: 'text' | 'command' | 'system';
  metadata: Json;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
}