
import { User } from '@supabase/supabase-js';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'failed';
export type MessageType = 'text' | 'system' | 'command';
export type ChatPosition = 'bottom-right' | 'bottom-left';
export type ChatMode = 'standard' | 'editor' | 'chat-only';
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type FileType = 'image' | 'document' | 'code' | 'other';

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

export interface ChatSessionFile {
  id: string;
  session_id: string;
  name: string;
  type: FileType;
  url: string;
  size: number;
  status: FileStatus;
  uploaded_at: string;
  metadata?: Record<string, any>;
}

export interface ChatSessionMetadata {
  context?: string;
  summary?: string;
  tags?: string[];
  references?: string[];
  codebase_context?: Record<string, any>;
  github_context?: Record<string, any>;
  custom_data?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  last_accessed: string;
  title?: string;
  files?: ChatSessionFile[];
  metadata?: ChatSessionMetadata;
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

export interface SessionState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}
