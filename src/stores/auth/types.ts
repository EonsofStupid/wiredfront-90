import type { AsyncState } from '../core/types';
import type { User } from '@/types/store/common';

export interface AuthState extends AsyncState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;