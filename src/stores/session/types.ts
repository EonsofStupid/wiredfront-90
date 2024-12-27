import { User } from '@supabase/supabase-js';

export interface SessionAuditLog {
  timestamp: Date;
  action: 'login' | 'logout' | 'session_refresh' | 'token_refresh' | 'setup_complete' | 'error' | 'session_initialized';
  userId?: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  lastActivity: Date | null;
  setupComplete: boolean;
  auditLog: SessionAuditLog[];
}

export interface SessionActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSetupComplete: (complete: boolean) => void;
  logActivity: (log: Omit<SessionAuditLog, 'timestamp'>) => void;
  clearSession: () => void;
  refreshSession: () => Promise<void>;
}

export type SessionStore = SessionState & SessionActions;

export interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  preferences?: {
    role?: string;
    theme?: string;
    [key: string]: any;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}