import { Json } from '@/integrations/supabase/types';

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'error' | 'cached';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training' | 'standard' | 'developer';

export const isChatMode = (value: any): value is ChatMode => {
  return ['chat', 'chat-only', 'dev', 'image', 'training', 'standard', 'developer'].includes(value);
};

export interface Message {
  id: string;
  content: string;
  user_id?: string | null;
  type?: 'text' | 'command' | 'system';
  metadata?: Json;
  created_at?: string;
  updated_at?: string;
  chat_session_id?: string;
  sessionId?: string; // Added for compatibility
  is_minimized?: boolean;
  position?: Json;
  window_state?: Json;
  last_accessed?: string;
  retry_count?: number;
  message_status?: MessageStatus;
  role: MessageRole;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
  timestamp?: string; // Added for compatibility
}
