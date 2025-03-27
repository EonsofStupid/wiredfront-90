
import { TokenEnforcementMode } from '@/types/chat/enums';

export interface TokenState {
  balance: number;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  
  // Actions
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (balance: number) => Promise<boolean>;
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  resetTokens: () => void;
}
