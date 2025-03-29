
import { z } from 'zod';
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Base schema for token record from the database
 */
export const tokenDbSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  balance: z.number().nonnegative().default(0),
  used: z.number().nonnegative().default(0),
  total_earned: z.number().nonnegative().optional(),
  total_spent: z.number().nonnegative().optional(),
  limit: z.number().nonnegative().optional(),
  reset_date: z.string().nullable().optional(),
  enforcement_mode: z.nativeEnum(TokenEnforcementMode).default(TokenEnforcementMode.Never),
  enforcement_settings: z.record(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  last_updated: z.string().optional(),
  queries_used: z.number().nonnegative().optional(),
  free_query_limit: z.number().nonnegative().optional(),
  tokens_per_query: z.number().nonnegative().optional(),
  cost_per_token: z.number().nonnegative().optional(),
  daily_limit: z.number().nonnegative().optional(),
  monthly_limit: z.number().nonnegative().optional(),
  next_reset_date: z.string().nullable().optional(),
  usage_by_provider: z.record(z.any()).optional(),
  usage_by_feature: z.record(z.any()).optional(),
  tier: z.string().optional(),
  reset_frequency: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Schema for token state in the token store
 */
export const tokenStateSchema = z.object({
  id: z.string().uuid().optional(),
  balance: z.number().nonnegative(),
  used: z.number().nonnegative().optional(),
  limit: z.number().nonnegative().optional(),
  resetDate: z.string().nullable().optional(),
  lastUpdated: z.string(),
  tokensPerQuery: z.number().nonnegative(),
  queriesUsed: z.number().nonnegative(),
  freeQueryLimit: z.number().nonnegative(),
  enforcementMode: z.nativeEnum(TokenEnforcementMode),
  enforcementEnabled: z.boolean(),
  isEnforcementEnabled: z.boolean(),
  warningThreshold: z.number().min(0).max(100).optional(),
  error: z.instanceof(Error).nullable().optional(),
  isLoading: z.boolean().optional(),
  usageByProvider: z.record(z.number()).optional(),
  usageByFeature: z.record(z.number()).optional(),
  costPerToken: z.number().nonnegative().optional(),
  totalEarned: z.number().nonnegative().optional(),
  totalSpent: z.number().nonnegative().optional(),
  dailyLimit: z.number().nonnegative().optional(),
  monthlyLimit: z.number().nonnegative().optional(),
  nextResetDate: z.string().nullable().optional(),
  tier: z.string().optional(),
  resetFrequency: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
});

/**
 * Schema for token transaction records
 */
export const tokenTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  amount: z.number(),
  transaction_type: z.enum(['add', 'spend', 'set', 'admin_update', 'reset', 'reward']),
  description: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  cost: z.number().optional(),
  provider: z.string().optional(),
  feature: z.string().optional(),
});

/**
 * Schema for token usage records
 */
export const tokenUsageSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  session_id: z.string().uuid().optional(),
  input_tokens: z.number().nonnegative().default(0),
  output_tokens: z.number().nonnegative().default(0),
  total_tokens: z.number().nonnegative().default(0),
  cost: z.number().nonnegative().default(0),
  timestamp: z.string(),
  context: z.record(z.any()).optional(),
  is_free_query: z.boolean().optional(),
  is_cached: z.boolean().optional(),
  latency_ms: z.number().optional(),
  provider: z.string(),
  model: z.string(),
  feature_key: z.string().optional(),
  chat_mode: z.string().optional(),
  task_type: z.string().optional(),
});

/**
 * Schema for token update parameters
 */
export const tokenUpdateSchema = z.object({
  balance: z.number().nonnegative().optional(),
  used: z.number().nonnegative().optional(),
  limit: z.number().nonnegative().optional(),
  reset_date: z.string().nullable().optional(),
  enforcement_mode: z.nativeEnum(TokenEnforcementMode).optional(),
  metadata: z.record(z.any()).optional(),
  queries_used: z.number().nonnegative().optional(),
  free_query_limit: z.number().nonnegative().optional(),
  tokens_per_query: z.number().nonnegative().optional(),
  cost_per_token: z.number().nonnegative().optional(),
  daily_limit: z.number().nonnegative().optional(),
  monthly_limit: z.number().nonnegative().optional(),
  next_reset_date: z.string().nullable().optional(),
  usage_by_provider: z.record(z.any()).optional(),
  usage_by_feature: z.record(z.any()).optional(),
  tier: z.string().optional(),
  reset_frequency: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
});

/**
 * Schema for token enforcement configuration
 */
export const tokenEnforcementConfigSchema = z.object({
  mode: z.nativeEnum(TokenEnforcementMode),
  warningThreshold: z.number().min(0).max(100),
  limitAction: z.enum(['block', 'warn', 'degrade']),
});

/**
 * Schema for token analytics
 */
export const tokenAnalyticsSchema = z.object({
  totalUsed: z.number().nonnegative(),
  totalEarned: z.number().nonnegative(),
  totalSpent: z.number().nonnegative(),
  usageByProvider: z.record(z.number().nonnegative()),
  usageByFeature: z.record(z.number().nonnegative()),
  queriesUsed: z.number().nonnegative(),
  costAnalysis: z.object({
    totalCost: z.number().nonnegative(),
    averageCostPerQuery: z.number().nonnegative(),
    costByProvider: z.record(z.number().nonnegative()),
    costByFeature: z.record(z.number().nonnegative()),
  }),
  usageTrends: z.array(
    z.object({
      date: z.string(),
      tokens: z.number().nonnegative(),
      cost: z.number().nonnegative(),
    })
  ).optional(),
});

/**
 * Schema for token reset configuration
 */
export const tokenResetConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'never']),
  amount: z.number().nonnegative(),
  nextResetDate: z.string().nullable(),
  autoReset: z.boolean(),
  resetDay: z.number().min(1).max(31).optional(), // For monthly resets
  resetDayOfWeek: z.number().min(0).max(6).optional(), // For weekly resets (0 = Sunday)
});

// Export the types generated from the schemas
export type TokenDb = z.infer<typeof tokenDbSchema>;
export type TokenState = z.infer<typeof tokenStateSchema>;
export type TokenTransaction = z.infer<typeof tokenTransactionSchema>;
export type TokenUsage = z.infer<typeof tokenUsageSchema>;
export type TokenUpdate = z.infer<typeof tokenUpdateSchema>;
export type TokenEnforcementConfig = z.infer<typeof tokenEnforcementConfigSchema>;
export type TokenAnalytics = z.infer<typeof tokenAnalyticsSchema>;
export type TokenResetConfig = z.infer<typeof tokenResetConfigSchema>;
