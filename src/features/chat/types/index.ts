export type ChatMode = 'chat' | 'editor' | 'project';

export interface Session {
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
  metadata: Record<string, any>;
  context?: Record<string, any>;
}

export interface DBSession {
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
  metadata: string | Record<string, any>;
  context?: string | Record<string, any>;
}
