
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Token state interface for the token store
 */
export interface TokenState {
  // Core token data
  id?: string;
  balance: number;
  used?: number;
  limit?: number;
  resetDate?: string | null;
  enforcementMode: TokenEnforcementMode;
  
  // UI and status indicators
  isLoading?: boolean;
  error?: Error | null;
  usagePercent?: number;
  isLowBalance?: boolean;
  isTokensExhausted?: boolean;
  lastUpdated: string;
  warningThreshold?: number;
  
  // Query tracking
  tokensPerQuery: number;
  freeQueryLimit?: number;
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
