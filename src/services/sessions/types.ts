
import { Session as SessionType } from '@/types/sessions';

export interface SessionState {
  sessions: SessionType[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionActions {
  createSession: (title?: string, metadata?: any) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<SessionType>) => Promise<void>;
  archiveSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  findSessionById: (id: string) => SessionType | null;
  getCurrentSession: () => SessionType | null;
}

export type SessionManager = SessionState & SessionActions;

export interface SessionPreference {
  defaultProvider: string | null;
  defaultMode: string;
  rememberLastSession: boolean;
  autoCleanupInactiveSessions: boolean;
  sessionLifetimeDays: number;
}

export interface SessionAnalytics {
  sessionStartTime: string;
  messageCount: number;
  lastActivityTime: string;
  totalSessionTime: number;
  sessionStatus: 'active' | 'inactive' | 'archived';
}

export interface SessionMetadata {
  title?: string;
  description?: string;
  provider?: string;
  mode?: string;
  tags?: string[];
  source?: string;
  [key: string]: any;
}
