
/**
 * Message types without recursive dependencies
 */

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'error' | 'cached' | 'received';
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'command' | 'system' | 'image';

export type MessageMetadata = {
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  processing?: {
    startTime?: string;
    endTime?: string;
    duration?: number;
  };
  [key: string]: any;
};

export interface Message {
  id: string;
  content: string;
  user_id: string | null;
  type: MessageType;
  metadata: MessageMetadata;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: any; // Will be typed properly in future phases
  window_state: any; // Will be typed properly in future phases
  last_accessed: string;
  retry_count: number;
  message_status: MessageStatus;
  role: MessageRole;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
}

export interface MessageRequest {
  content: string;
  sessionId?: string;
  mode?: string;
  metadata?: MessageMetadata;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: Error | unknown;
}
