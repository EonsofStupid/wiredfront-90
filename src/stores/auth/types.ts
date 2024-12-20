import type { AsyncState } from '@/types/store/state';
import type { User, LoginCredentials } from '@/types/store/common';

export interface AuthState extends AsyncState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;