
import { Json } from '@/integrations/supabase/types';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'command' | 'system' | 'image';
export type MessageStatus = 'pending' | 'sent' | 'received' | 'error' | 'failed' | 'cached';

export interface MessageTokens {
  prompt: number;
  completion: number;
  total: number;
}

export interface MessageProcessing {
  startTime: string;
  endTime: string;
  duration: number;
}

export interface MessageMetadata {
  model?: string;
  tokens?: MessageTokens;
  processing?: MessageProcessing;
  [key: string]: any;
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
  chat_session_id: string;
  retry_count: number;
  message_status: MessageStatus;
  metadata: MessageMetadata;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  userInput: string;
  isLoading: boolean;
  error: string | null;
}
