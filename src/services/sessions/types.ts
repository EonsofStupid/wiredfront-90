
export interface Session {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  mode: string;
  archived: boolean; // Changed from is_active to archived
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  last_accessed?: string;
  message_count?: number;
}

export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionContextProps {
  sessionState: SessionState;
  createSession: (title: string, mode: string) => Promise<Session | null>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  setCurrentSession: (session: Session | null) => void;
  refreshSessions: () => Promise<void>;
}
