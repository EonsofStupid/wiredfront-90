
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
  enforcement_mode: string;
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
  enforcement_mode?: string;
  metadata?: Record<string, any>;
}

// Re-export the TokenEnforcementMode from the central enums file
export { TokenEnforcementMode } from './enums';
