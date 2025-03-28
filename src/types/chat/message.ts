
import { MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  user_id: string | null;
  type: MessageType;
  metadata: Json;
  created_at: string;
  updated_at: string;
  chat_session_id?: string | null;
  conversation_id: string;
  is_minimized?: boolean;
  position?: Json;
  window_state?: Json;
  last_accessed?: string;
  retry_count?: number;
  last_retry?: string | null;
  parent_message_id?: string | null;
  position_order?: number;
  message_status?: MessageStatus;
}

export interface MessageCreateParams {
  role: MessageRole;
  content: string;
  type?: MessageType;
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
  message_status?: MessageStatus;
}
