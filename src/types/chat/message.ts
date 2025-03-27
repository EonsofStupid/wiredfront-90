
import { MessageRole, MessageType, MessageStatus } from './enums';
import { Json } from '@/integrations/supabase/types';

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
  
  // For new code - primary reference
  conversation_id: string;
  
  // For backward compatibility
  chat_session_id: string;
  
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
  retry_count: number;
  message_status?: MessageStatus;
  
  // Optional fields
  parent_message_id?: string;
  tokens?: number;
  last_edited?: string;
  status?: string; // Legacy status field
}

/**
 * Message creation parameters
 */
export interface MessageCreateParams {
  role: MessageRole;
  content: string;
  type?: MessageType;
  metadata?: Record<string, any>;
  conversation_id: string;
  parent_message_id?: string;
}
