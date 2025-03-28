
import { Json } from '@/integrations/supabase/types';
import { MessageRole, MessageType, MessageStatus } from './chat-modes';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  user_id: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  conversation_id: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
  retry_count: number;
  message_status: MessageStatus;
}

export interface MessageCreateParams {
  content: string;
  role: MessageRole;
  type?: MessageType;
  metadata?: Record<string, any>;
  conversation_id: string;
  parent_message_id?: string;
}
