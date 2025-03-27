
import { Json } from '@/integrations/supabase/types';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'image' | 'code' | 'file';
export type MessageStatus = 'pending' | 'sent' | 'received' | 'failed' | 'error' | 'cached';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  user_id: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
  retry_count: number;
  message_status?: MessageStatus;
}
