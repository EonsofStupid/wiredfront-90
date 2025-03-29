
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
  lastUpdated: string;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean;
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
  setEnforcementEnabled: (enabled: boolean) => void;
  setResetDate: (date: string | null) => void;
  setWarningThreshold: (percent: number) => void;
  resetTokens: () => Promise<boolean>;
  resetQueriesUsed: () => void;
  updateTokenSettings: (settings: Partial<TokenState>) => void;
  setTokenBalance: (amount: number) => Promise<boolean>;
}

export interface TokenStore extends TokenState, TokenActions {}
