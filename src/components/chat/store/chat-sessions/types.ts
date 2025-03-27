
import { User } from '@supabase/supabase-js';
import { Session, CreateSessionParams, UpdateSessionParams } from '@/components/chat/chat-structure/chatsidebar/types/chatsessions';

export type ChatSessionStore = {
  sessions: Session[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  user: User | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (params?: CreateSessionParams) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, params: UpdateSessionParams) => Promise<boolean>;
  archiveSession: (sessionId: string) => Promise<boolean>;
  clearSessions: (preserveCurrentSession?: boolean) => Promise<void>;
  cleanupInactiveSessions: () => Promise<void>;
};
