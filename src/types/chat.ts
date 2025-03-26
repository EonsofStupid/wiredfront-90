
import { SafeJson } from '@/types/json';
import { 
  MessageRole, 
  MessageType, 
  MessageStatus, 
  MessageMetadata as SchemaMessageMetadata
} from '@/schemas/messages';

// Re-export schema types to avoid duplication
export type { 
  MessageRole, 
  MessageType, 
  MessageStatus 
} from '@/schemas/messages';

// Use the same MessageMetadata type as in the schemas
export type { 
  MessageMetadata 
} from '@/schemas/messages';

// Define a Message interface that matches our schema
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_minimized: boolean;
  position: Record<string, unknown>;
  window_state: Record<string, unknown>;
  last_accessed: string;
  chat_session_id: string;
  retry_count: number;
  message_status: MessageStatus;
  metadata: SchemaMessageMetadata;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
  // Support for database format fields
  status?: MessageStatus;
  tokens?: number;
  session_id?: string;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  userInput: string;
  isLoading: boolean;
  error: string | null;
}
