
import { UIEnforcementMode, TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Token state interface
 * Manages the user's token balance and enforcement settings
 */
export interface TokenState {
  // Token balance state
  balance: number;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  
  // Token enforcement settings
  enforcementMode: UIEnforcementMode;
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean; // Alias for enforcementEnabled for backward compatibility
  
  // Token management actions
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (balance: number) => Promise<boolean>;
  setEnforcementMode: (mode: UIEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  resetTokens: () => void;
  resetQueriesUsed: () => void;
  updateTokenSettings: (settings: Partial<TokenState>) => void;
}

/**
 * Type for token action parameters
 */
export interface TokenActionParams {
  amount: number;
  operation: 'add' | 'spend' | 'set';
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Types for state management functions
 */
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;
