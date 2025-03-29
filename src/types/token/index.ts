
import { TokenEnforcementMode } from '../chat/enums';

/**
 * Token record in the database
 */
export interface Token {
  id: string;
  user_id: string;
  balance: number;
  used: number;
  limit: number;
  reset_date: string | null;
  enforcement_mode: TokenEnforcementMode;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  last_updated?: string;
  queries_used?: number;
  free_query_limit?: number;
  tokens_per_query?: number;
  tier?: string;
}

/**
 * Parameter for updating a token
 */
export interface TokenUpdateParams {
  balance?: number;
  used?: number;
  limit?: number;
  reset_date?: string | null;
  enforcement_mode?: TokenEnforcementMode;
  metadata?: Record<string, any>;
  queries_used?: number;
  free_query_limit?: number;
  tokens_per_query?: number;
}

/**
 * State interface for the token store
 */
export interface TokenState {
  id?: string;
  balance: number;
  used?: number;
  limit?: number;
  resetDate?: string | null;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean;
  warningThreshold?: number;
  error?: Error | null;
  isLoading?: boolean;
}

/**
 * Token store actions interface
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

/**
 * Token transaction record
 */
export interface TokenTransaction {
  id: string;
  amount: number;
  transactionType: 'add' | 'spend' | 'set';
  description?: string;
  timestamp: string;
}

/**
 * Token usage record
 */
export interface TokenUsage {
  id: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  provider: string;
  model: string;
  timestamp: string;
  feature_key?: string;
}

/**
 * Token enforcement configuration
 */
export interface TokenEnforcementConfig {
  mode: TokenEnforcementMode;
  warningThreshold: number; // Percentage (0-100) at which to show warnings
  limitAction: 'block' | 'warn' | 'degrade'; // What to do when limit is reached
}
