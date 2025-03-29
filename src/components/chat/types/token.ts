import { TokenEnforcementMode, UIEnforcementMode } from './enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Token balance information
 */
export interface TokenBalance {
  balance: number;
  used: number;
  limit: number;
  resetDate: string;
  enforcementMode: TokenEnforcementMode;
}

/**
 * Token usage information
 */
export interface TokenUsage {
  id: string;
  userId: string;
  tokenCount: number;
  cost: number;
  timestamp: string;
  operation: string;
  model: string;
  provider: string;
  metadata?: Record<string, any>;
}

/**
 * Token usage statistics
 */
export interface TokenUsageStats {
  totalUsed: number;
  dailyUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
  averagePerDay: number;
  averagePerQuery: number;
}

/**
 * Token settings configuration
 */
export interface TokenSettings {
  enforcementMode: TokenEnforcementMode;
  isEnforcementEnabled: boolean;
  tokensPerQuery: number;
  freeQueryLimit: number;
  dailyLimit: number;
  costPerToken: number;
  resetFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  notifyAt: number; // Percentage at which to notify user (e.g., 80)
  restrictAt: number; // Percentage at which to restrict usage (e.g., 95)
}

/**
 * Result of a token operation
 */
export interface TokenOperationResult {
  success: boolean;
  newBalance?: number;
  error?: string;
  enforcementApplied?: boolean;
  limitReached?: boolean;
}

/**
 * Token analytics data
 */
export interface TokenAnalytics {
  usageByDay: Array<{
    date: string;
    count: number;
    cost: number;
  }>;
  usageByModel: Array<{
    model: string;
    count: number;
    cost: number;
  }>;
  usageByOperation: Array<{
    operation: string;
    count: number;
    cost: number;
  }>;
}

/**
 * Database token record shape
 */
export interface DatabaseTokenRecord {
  id: string;
  user_id: string;
  balance: number;
  tokens_used: number;
  daily_limit: number;
  enforcement_mode: string;
  enforcement_settings: Json;
  cost_per_token: number;
  free_query_limit: number;
  last_reset: string;
  next_reset: string;
  reset_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  plan_id?: string;
  created_at: string;
  updated_at: string;
  queries_used: number;
  notify_at_percentage: number;
  restrict_at_percentage: number;
}

/**
 * Convert database token record to TokenBalance
 */
export function dbRecordToTokenBalance(record: DatabaseTokenRecord): TokenBalance {
  return {
    balance: record.balance,
    used: record.tokens_used,
    limit: record.daily_limit,
    resetDate: record.next_reset,
    enforcementMode: stringToTokenEnforcementMode(record.enforcement_mode)
  };
}

/**
 * Convert string to TokenEnforcementMode
 */
export function stringToTokenEnforcementMode(mode: string): TokenEnforcementMode {
  switch (mode?.toLowerCase()) {
    case 'none': return TokenEnforcementMode.None;
    case 'warn': return TokenEnforcementMode.Warn;
    case 'soft': return TokenEnforcementMode.Soft;
    case 'hard': return TokenEnforcementMode.Hard;
    case 'always': return TokenEnforcementMode.Always;
    case 'never': return TokenEnforcementMode.Never;
    case 'role_based': return TokenEnforcementMode.RoleBased;
    case 'mode_based': return TokenEnforcementMode.ModeBased;
    case 'strict': return TokenEnforcementMode.Strict;
    default: return TokenEnforcementMode.Soft;
  }
}

/**
 * Convert TokenEnforcementMode to string
 */
export function tokenEnforcementModeToString(mode: TokenEnforcementMode): string {
  return mode.toString();
}
