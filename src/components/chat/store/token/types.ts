
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Token state interface
 */
export interface TokenState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
  isEnforcementEnabled: boolean;
}

/**
 * Token actions parameters
 */
export interface TokenActionParams {
  amount?: number;
  mode?: TokenEnforcementMode;
  enabled?: boolean;
}

/**
 * Set state function type
 */
export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

/**
 * Get state function type
 */
export type GetState<T> = () => T;
