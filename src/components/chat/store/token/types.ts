
import { UIEnforcementMode } from '@/types/chat/enums';

export interface TokenState {
  balance: number;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  enforcementMode: UIEnforcementMode;
  enforcementEnabled: boolean;
  
  // Actions
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (balance: number) => Promise<boolean>;
  setEnforcementMode: (mode: UIEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  resetTokens: () => void;
}
