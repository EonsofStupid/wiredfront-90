
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Token store state
 */
export interface TokenState {
  id?: string;
  balance: number;
  limit?: number;
  used?: number;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean;
  warningThreshold?: number;
  resetDate?: string | null;
  isLoading?: boolean;
  error?: Error | null;
  
  // Actions (added as part of the store)
  addTokens: (amount: number, reason?: string) => Promise<boolean>;
  spendTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  initialize: () => Promise<void>;
  fetchTokenData: () => Promise<void>;
  resetTokens: () => Promise<boolean>;
  resetQueriesUsed: () => void;
  updateTokenSettings: (settings: Partial<TokenState>) => void;
  setWarningThreshold: (percent: number) => void;
  setResetDate: (date: string | null) => void;
  setBalance: (amount: number) => void;
}

/**
 * Token store actions
 */
export interface TokenActions {
  addTokens: (amount: number, reason?: string) => Promise<boolean>;
  spendTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  initialize: () => Promise<void>;
  fetchTokenData: () => Promise<void>;
  resetTokens: () => Promise<boolean>;
  resetQueriesUsed: () => void;
  updateTokenSettings: (settings: Partial<TokenState>) => void;
  setWarningThreshold: (percent: number) => void;
  setResetDate: (date: string | null) => void;
  setBalance: (amount: number) => void;
}

/**
 * Combined token store interface
 */
export type TokenStore = TokenState & TokenActions;
