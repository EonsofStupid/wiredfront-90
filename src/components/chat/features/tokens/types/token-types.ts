
import { TokenEnforcementMode } from '@/types/chat/enums';

export interface TokenControlState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface TokenTransaction {
  id: string;
  amount: number;
  transactionType: 'add' | 'spend' | 'set';
  description?: string;
  timestamp: string;
}

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

export interface TokenEnforcementConfig {
  mode: TokenEnforcementMode;
  warningThreshold: number; // Percentage (0-100) at which to show warnings
  limitAction: 'block' | 'warn' | 'degrade'; // What to do when limit is reached
}
