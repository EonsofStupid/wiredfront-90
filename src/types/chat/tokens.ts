
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

// Re-export the TokenEnforcementMode from the central enums file
export { TokenEnforcementMode } from './enums';
