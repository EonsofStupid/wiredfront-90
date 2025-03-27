import { 
  MessageType, 
  MessageStatus 
} from '@/components/chat/shared/schemas/messages';

// Re-export schema types to avoid duplication
export type { 
  MessageType, 
  MessageStatus 
};

// Use the same MessageMetadata type as in the schemas
export type { 
  MessageMetadata 
} from '@/components/chat/shared/schemas/messages';

// Define a Message interface that matches our schema
export interface Message {
  id: string;
  content: string;
  user_id: string | null;
  type: MessageType;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Record<string, unknown>;
  window_state: Record<string, unknown>;
  last_accessed: string;
  retry_count: number;
  message_status: MessageStatus;
  role: 'user' | 'assistant' | 'system' | 'tool';
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
  tokens?: number;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  userInput: string;
  isLoading: boolean;
  error: string | null;
}
