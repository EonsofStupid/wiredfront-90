import type { ChatMode } from './chat-mode';

export interface BaseSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  mode: ChatMode;
  provider_id: string;
  project_id: string;
  tokens_used: number;
  message_count: number;
}

export interface Session extends BaseSession {
  metadata: Record<string, any>;
  context?: Record<string, any>;
}

export interface DBSession extends BaseSession {
  metadata: string | Record<string, any>;
  context?: string | Record<string, any>;
}
