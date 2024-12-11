import type { User, LoginCredentials } from './common';

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: string };