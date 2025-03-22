
// Chat modes
export type ChatMode = 'chat' | 'code' | 'assistant';

// Message roles
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning' | 'info';

// Message status for tracking delivery and read state
export type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed' 
  | 'pending'
  | 'error'
  | 'cached';

// Basic Message interface
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  status?: MessageStatus;
  message_status?: MessageStatus; // For backward compatibility
  created_at?: string; // For backward compatibility
  metadata?: Record<string, any>;
  sessionId?: string;
  session_id?: string; // For backward compatibility
  user_id?: string | null;
  retry_count?: number;
  last_retry?: string;
  updated_at?: string;
  position_order?: number;
}

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  isMinimized?: boolean;
  position?: { x: number; y: number };
  isTacked?: boolean;
  lastAccessed?: Date;
}

// Connection state for realtime features
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';
