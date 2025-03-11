
import { User } from '@supabase/supabase-js';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'failed';
export type MessageType = 'text' | 'system' | 'command';
export type ChatPosition = 'bottom-right' | 'bottom-left';
export type ChatMode = 'standard' | 'editor' | 'chat-only';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  user_id: string;
  chat_session_id: string | null;
  message_status: MessageStatus;
  type: MessageType;
  metadata: Record<string, any>;
  timestamp: string;
  is_minimized?: boolean;
}

export interface ChatSession {
  id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  last_accessed: string;
  title?: string;
  metadata?: Record<string, any>;
}

export interface ChatFeatures {
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  notifications: boolean;
  voiceInput: boolean;
  voiceOutput: boolean;
}

export interface ChatUIState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
}

export interface ChatProviderInfo {
  id: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama';
  name: string;
  isEnabled: boolean;
  isDefault?: boolean;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}
