
import { MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Core message interface - matches the database schema
 */
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

/**
 * Parameters for creating a new message
 */
export interface MessageCreateParams {
  role: MessageRole;
  content: string;
  type?: MessageType;
  metadata?: Json;
  conversation_id: string;
  parent_message_id?: string;
}

/**
 * Parameters for updating an existing message
 */
export interface MessageUpdateParams {
  content?: string;
  metadata?: Json;
  is_minimized?: boolean;
  position?: Json;
  window_state?: Json;
  retry_count?: number;
  message_status?: MessageStatus;
}

/**
 * Message display properties for UI components
 */
export interface MessageDisplayProps {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  status?: MessageStatus;
  timestamp?: string;
  metadata?: Json;
  isEditable?: boolean;
  isExpandable?: boolean;
  onRetry?: (messageId: string) => void;
}
