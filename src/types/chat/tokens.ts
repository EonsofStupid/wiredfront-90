
import { TokenEnforcementMode } from './enums';

/**
 * Token record in the database
 */
export interface Token {
  id: string;
  user_id: string;
  balance: number;
  used: number;
  limit: number;
  reset_date: string;
  enforcement_mode: TokenEnforcementMode;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

/**
 * State interface for the token store
 */
export interface TokenState {
  // Core token data
  id?: string;
  balance: number;
  used?: number;
  limit?: number;
  resetDate: string | null;
  enforcementMode: TokenEnforcementMode;
  
  // UI and status indicators
  isLoading: boolean;
  error: string | null;
  usagePercent: number;
  isLowBalance: boolean;
  isTokensExhausted?: boolean;
  lastUpdated: string;
  warningThreshold?: number;
  
  // Query tracking
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
  
  // Enforcement settings
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean;
}

/**
 * Token actions interface
 */
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

/**
 * Token store interface with all actions
 */
export interface TokenStore extends TokenState, TokenActions {}

/**
 * Parameter for updating a token
 */
export interface TokenUpdateParams {
  balance?: number;
  used?: number;
  limit?: number;
  reset_date?: string;
  enforcement_mode?: TokenEnforcementMode;
  metadata?: Record<string, any>;
}
