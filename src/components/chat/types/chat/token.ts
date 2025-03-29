
import { TokenEnforcementMode, UIEnforcementMode } from './enums';

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

/**
 * Token analytics data
 */
export interface TokenAnalytics {
  totalUsed: number;
  totalLimit: number;
  percentUsed: number;
  usageTrends?: Array<{
    date: string;
    tokens: number;
    cost: number;
  }>;
  modelBreakdown?: Record<string, number>;
  featureBreakdown?: Record<string, number>;
  lastUpdated: Date;
}

/**
 * Database token model mapping
 */
export interface DbTokenRecord {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  last_reset: string | null;
  created_at: string;
  updated_at: string;
  last_updated: string;
  queries_used: number;
  free_query_limit: number;
  tokens_per_query: number;
  enforcement_settings: Record<string, any>;
  cost_per_token: number;
  daily_limit: number | null;
  monthly_limit: number | null;
  next_reset_date: string | null;
  usage_by_provider: Record<string, number>;
  usage_by_feature: Record<string, number>;
  tier: string;
  enforcement_mode: string;
  reset_frequency: string;
}

/**
 * Map database token record to TokenBalance
 */
export function mapDbRecordToTokenBalance(dbRecord: DbTokenRecord): TokenBalance {
  return {
    id: dbRecord.id,
    userId: dbRecord.user_id,
    balance: dbRecord.balance,
    used: dbRecord.total_spent,
    limit: dbRecord.monthly_limit || 0,
    resetDate: dbRecord.next_reset_date ? new Date(dbRecord.next_reset_date) : null,
    enforcementMode: TokenEnforcementMode[dbRecord.enforcement_mode as keyof typeof TokenEnforcementMode] || TokenEnforcementMode.Soft,
    resetPeriod: (dbRecord.reset_frequency as 'daily' | 'weekly' | 'monthly' | 'never') || 'monthly',
    lastUpdated: new Date(dbRecord.last_updated),
    costPerToken: dbRecord.cost_per_token,
    dailyLimit: dbRecord.daily_limit || 0,
    freeQueries: dbRecord.free_query_limit,
    freeQueriesUsed: dbRecord.queries_used,
    isEnforced: dbRecord.enforcement_mode !== 'none' && dbRecord.enforcement_mode !== 'never',
    isLimited: !!dbRecord.monthly_limit || !!dbRecord.daily_limit
  };
}
