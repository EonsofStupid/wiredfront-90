
import { Json } from '@/integrations/supabase/types';
import { MessageRole, MessageType, MessageStatus } from './chat-modes';

/**
 * Core message interface
 */
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
  parent_message_id?: string;
}

/**
 * Message creation parameters
 */
export interface MessageCreateParams {
  content: string;
  role: MessageRole;
  type?: MessageType;
  metadata?: Record<string, any>;
  conversation_id: string;
  parent_message_id?: string;
}

/**
 * Message update parameters
 */
export interface MessageUpdateParams {
  content?: string;
  type?: MessageType;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
}

/**
 * Message display properties
 */
export interface MessageDisplayProps {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  status?: MessageStatus;
  isLoading?: boolean;
  timestamp?: string;
  metadata?: Record<string, any>;
  isEditable?: boolean;
  isExpandable?: boolean;
}
