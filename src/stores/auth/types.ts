import type { User } from '@supabase/supabase-js';

export interface AuthState {
  version: string;
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  lastUpdated: string | null;
}

export interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateSession: (session: any) => void;
}

export type AuthStore = AuthState & AuthActions;