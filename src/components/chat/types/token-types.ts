
import { TokenEnforcementMode } from './chat/enums';

/**
 * Token balance interface
 */
export interface TokenBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  resets?: boolean;
  nextResetDate?: string | null;
  resetAmount?: number | null;
  resetFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  enforcementMode: TokenEnforcementMode;
  warningThreshold?: number | null;
}

/**
 * Token transaction interface
 */
export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'add' | 'spend' | 'reset' | 'adjust' | 'refund';
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  balanceAfter?: number;
}

/**
 * Token analytics interface
 */
export interface TokenAnalytics {
  totalUsage: number;
  usageByPeriod: Record<string, number>;
  usageByMode: Record<string, number>;
  usageByProvider: Record<string, number>;
  costEstimate: number;
  burnRate: number;
  projectedUsage: number;
  daysRemaining?: number | null;
}

/**
 * Token usage metrics
 */
export interface TokenUsageMetrics {
  used: number;
  limit: number;
  reset_date?: string;
  percentage: number;
}

/**
 * Token enforcement settings
 */
export interface TokenEnforcementSettings {
  mode: TokenEnforcementMode;
  warningThreshold: number;
  resetFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  resetAmount?: number;
}
