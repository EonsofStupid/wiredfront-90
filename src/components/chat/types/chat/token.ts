
import { TokenEnforcementMode } from './enums';

/**
 * Token balance information
 */
export interface TokenBalance {
  id: string;
  userId: string;
  balance: number;
  used: number;
  limit: number;
  resetDate: Date | null;
  enforcementMode: TokenEnforcementMode;
  resetPeriod: 'daily' | 'weekly' | 'monthly' | 'never';
  lastUpdated: Date;
  costPerToken: number;
  dailyLimit: number;
  freeQueries: number;
  freeQueriesUsed: number;
  isEnforced: boolean;
  isLimited: boolean;
}

/**
 * Token usage record
 */
export interface TokenUsage {
  id: string;
  userId: string;
  timestamp: Date;
  amount: number;
  model: string;
  provider: string;
  chatMode?: string;
  feature?: string;
  cost?: number;
  inputTokens?: number;
  outputTokens?: number;
  isCached?: boolean;
  isFreeQuery?: boolean;
}

/**
 * Token usage statistics
 */
export interface TokenUsageStats {
  totalUsed: number;
  totalLimit: number;
  percentUsed: number;
  remainingTokens: number;
  dailyAverage?: number;
  weeklyUsage?: number[];
  lastReset?: Date;
  nextReset?: Date;
  usageByModel?: Record<string, number>;
  usageByProvider?: Record<string, number>;
  usageByFeature?: Record<string, number>;
}

/**
 * Token settings
 */
export interface TokenSettings {
  enforcementMode: TokenEnforcementMode;
  costPerToken: number;
  dailyLimit: number;
  freeQueryLimit: number;
  resetPeriod: 'daily' | 'weekly' | 'monthly' | 'never';
  enforcementSettings: Record<string, any>;
  thresholds: {
    warning: number;
    critical: number;
  };
}

/**
 * Token operations result
 */
export interface TokenOperationResult {
  success: boolean;
  balance?: number;
  error?: string;
  message?: string;
  tokens?: TokenBalance;
}
