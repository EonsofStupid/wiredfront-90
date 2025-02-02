import type { User } from '@supabase/supabase-js';
import type { AsyncState } from '@/types/store/core/types';

export interface AuthState extends AsyncState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

export interface LoginResponse {
  success: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (credentials: { email: string; password: string }) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  initializeAuth: () => Promise<() => void>;
}

export type AuthStore = AuthState & AuthActions;