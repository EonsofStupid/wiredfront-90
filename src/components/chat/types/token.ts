
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
  enforcementMode: 'none' | 'warn' | 'soft' | 'hard' | 'always' | 'never' | 'role_based' | 'mode_based' | 'strict';
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
