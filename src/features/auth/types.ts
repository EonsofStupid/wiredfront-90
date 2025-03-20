import { User } from '@supabase/supabase-js';

export interface AuthState {
  version: string;
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  lastUpdated: number | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface AuthStore extends AuthState {
  // State setters
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  // Auth actions
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initializeAuth: () => Promise<() => void>;
}

// Event types for auth state changes
export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED';
