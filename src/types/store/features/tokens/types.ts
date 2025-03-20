
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

/**
 * Token state for tracking token usage and enforcement
 */
export interface TokenState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Token actions for managing token usage
 */
export interface TokenActions {
  setBalance: (balance: number) => void;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  resetUsage: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Complete token store
 */
export type TokenStore = TokenState & TokenActions;
