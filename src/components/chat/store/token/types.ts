
import { TokenEnforcementMode } from '@/types/chat/tokens';

export interface TokenState {
  balance: number;
  limit: number;
  used: number;
  usagePercent: number;
  isLowBalance: boolean;
  isTokensExhausted: boolean;
  enforcementMode: TokenEnforcementMode;
  resetDate: string | null;
  warningThreshold: number;
  isLoading: boolean;
  error: Error | null;
}

export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export type GetState<T> = () => T;

export interface TokenActions {
  initialize: () => Promise<void>;
  fetchTokenData: () => Promise<void>;
  setBalance: (amount: number) => void;
  addTokens: (amount: number, reason?: string) => Promise<boolean>;
  spendTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokens: (amount: number, reason?: string) => Promise<boolean>;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setResetDate: (date: string | null) => void;
  setWarningThreshold: (percent: number) => void;
  resetTokens: () => Promise<boolean>;
}

export interface TokenStore extends TokenState, TokenActions {}
