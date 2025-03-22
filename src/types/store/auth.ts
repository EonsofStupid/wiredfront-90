
import type { User, LoginCredentials, BaseAction } from './common/types';
import type { AsyncState } from './core/types';

export interface AuthState extends AsyncState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly token: string | null;
}

export interface AuthActions {
  readonly login: (credentials: LoginCredentials) => Promise<void>;
  readonly logout: () => void;
  readonly refreshToken: () => Promise<void>;
}

export type AuthStore = Readonly<AuthState & AuthActions>;

export type AuthActionType =
  | 'LOGIN_SUCCESS'
  | 'LOGOUT'
  | 'REFRESH_TOKEN';

export type AuthAction = 
  | BaseAction<'LOGIN_SUCCESS', User>
  | BaseAction<'LOGOUT'>
  | BaseAction<'REFRESH_TOKEN', string>;
