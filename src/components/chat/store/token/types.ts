
import { UIEnforcementMode } from '@/types/chat/enums';

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
  
  // Token management actions
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (balance: number) => Promise<boolean>;
  setEnforcementMode: (mode: UIEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  resetTokens: () => void;
}
