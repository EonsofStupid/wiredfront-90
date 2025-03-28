
import { TokenEnforcementMode } from './enums';
import { Json } from '@/integrations/supabase/types';

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
  id?: string;
  balance: number;
  used: number;
  limit: number;
  resetDate: string | null;
  enforcementMode: TokenEnforcementMode;
  isLoading: boolean;
  error: string | null;
  usagePercent: number;
  isLowBalance: boolean;
}

/**
 * Token store interface with all actions
 */
export interface TokenStore extends TokenState {
  initializeTokens: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  updateUsed: (amount: number) => Promise<void>;
  updateEnforcementMode: (mode: TokenEnforcementMode) => Promise<void>;
  resetTokens: () => Promise<void>;
}

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
