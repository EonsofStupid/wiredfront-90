
import { Json } from '@/integrations/supabase/types';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { Session as BaseSession } from '@/types/sessions';

// Service-specific session interface that extends the base Session type
export interface Session extends BaseSession {
  // Add any service-specific fields or overrides here
}

export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionContextProps {
  sessionState: SessionState;
  createSession: (title: string, mode: ChatMode) => Promise<Session | null>; // Update to use ChatMode
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  setCurrentSession: (session: Session | null) => void;
  refreshSessions: () => Promise<void>;
}
