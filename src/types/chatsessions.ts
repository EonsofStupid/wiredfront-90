import { z } from 'zod';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';
export type MessageStatus = 'pending' | 'sent' | 'failed' | 'error' | 'cached' | 'received';
export type MessageType = 'text' | 'command' | 'system' | 'image';
export type ChatMode = 'chat' | 'code' | 'image' | 'dev' | 'training' | 'planning';

export interface MessageMetadata {
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  processing?: {
    startTime: string;
    endTime: string;
    duration: number;
  };
  [key: string]: unknown;
}

export const messageMetadataSchema = z.object({
  model: z.string().optional(),
  tokens: z.object({
    prompt: z.number(),
    completion: z.number(),
    total: z.number()
  }).optional(),
  processing: z.object({
    startTime: z.string(),
    endTime: z.string(),
    duration: z.number()
  }).optional()
}).catchall(z.unknown());

export interface Session {
  id: string;
  content: string;
  user_id: string;
  type: MessageType;
  metadata: MessageMetadata;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Record<string, unknown>;
  window_state: Record<string, unknown>;
  last_accessed: string;
  retry_count: number;
  message_status: MessageStatus;
  role: MessageRole;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
  tokens?: number;
  title: string;
  message_count: number;
  is_active: boolean;
  archived: boolean;
  context: Record<string, unknown>;
  mode: ChatMode;
}

export interface SessionOperationResult {
  success: boolean;
  data?: Session | null;
  error?: Error | null;
  sessionId?: string;
}

export interface CreateSessionParams {
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSessionParams {
  title?: string;
  metadata?: Record<string, unknown>;
  archived?: boolean;
}

export const validateMessage = (message: unknown): Message => {
  // TODO: Implement message validation
  return message as Message;
};
