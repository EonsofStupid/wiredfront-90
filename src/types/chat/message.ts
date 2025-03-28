
import { MessageRole, MessageStatus, MessageType } from './enums';
import { Json } from '@/integrations/supabase/types';

export interface Message {
  id: string;
  role: MessageRole | string;
  content: string;
  user_id: string | null;
  type: MessageType | string;
  metadata: Json;
  created_at: string;
  updated_at: string;
  chat_session_id?: string | null;
  conversation_id?: string | null; 
  is_minimized?: boolean | null;
  position?: Json;
  window_state?: Json;
  last_accessed?: string | null;
  retry_count?: number;
  last_retry?: string | null;
  parent_message_id?: string | null;
  position_order?: number;
  message_status?: MessageStatus | string;
}

export interface MessageCreateParams {
  role: MessageRole | string;
  content: string;
  type?: MessageType | string;
  metadata?: Json;
  conversation_id: string;
  parent_message_id?: string;
}

export interface MessageUpdateParams {
  content?: string;
  metadata?: Json;
  is_minimized?: boolean;
  position?: Json;
  window_state?: Json;
  retry_count?: number;
  message_status?: MessageStatus | string;
}
