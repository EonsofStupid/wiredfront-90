
import { TokenEnforcementMode } from '../chat/enums';

/**
 * Token record in the database
 */
export interface Token {
  id: string;
  user_id: string;
  balance: number;
  used: number;
  total_earned?: number;
  total_spent?: number;
  limit: number;
  reset_date: string | null;
  enforcement_mode: TokenEnforcementMode;
  enforcement_settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_updated?: string;
  queries_used?: number;
  free_query_limit?: number;
  tokens_per_query?: number;
  cost_per_token?: number;
  daily_limit?: number;
  monthly_limit?: number;
  next_reset_date?: string | null;
  usage_by_provider?: Record<string, any>;
  usage_by_feature?: Record<string, any>;
  tier?: string;
  reset_frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  metadata?: Record<string, any>;
}

/**
 * Parameter for updating a token
 */
export interface TokenUpdateParams {
  balance?: number;
  used?: number;
  limit?: number;
  reset_date?: string | null;
  enforcement_mode?: TokenEnforcementMode;
  metadata?: Record<string, any>;
  queries_used?: number;
  free_query_limit?: number;
  tokens_per_query?: number;
  cost_per_token?: number;
  daily_limit?: number;
  monthly_limit?: number;
  next_reset_date?: string | null;
  usage_by_provider?: Record<string, any>;
  usage_by_feature?: Record<string, any>;
  tier?: string;
  reset_frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
}

/**
 * State interface for the token store
 */
export interface TokenState {
  id?: string;
  balance: number;
  used?: number;
  limit?: number;
  resetDate?: string | null;
  lastUpdated: string;
  tokensPerQuery: number;
  queriesUsed: number;
  freeQueryLimit: number;
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  isEnforcementEnabled: boolean;
  warningThreshold?: number;
  error?: Error | null;
  isLoading?: boolean;
  usageByProvider?: Record<string, number>;
  usageByFeature?: Record<string, number>;
  costPerToken?: number;
  totalEarned?: number;
  totalSpent?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  nextResetDate?: string | null;
  tier?: string;
  resetFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
}

/**
 * Token analytics interface
 */
export interface TokenAnalytics {
  totalUsed: number;
  totalEarned: number;
  totalSpent: number;
  usageByProvider: Record<string, number>;
  usageByFeature: Record<string, number>;
  queriesUsed: number;
  costAnalysis: {
    totalCost: number;
    averageCostPerQuery: number;
    costByProvider: Record<string, number>;
    costByFeature: Record<string, number>;
  };
  usageTrends?: Array<{
    date: string;
    tokens: number;
    cost: number;
  }>;
}

/**
 * Reset configuration interface
 */
export interface TokenResetConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  amount: number;
  nextResetDate: string | null;
  autoReset: boolean;
  resetDay?: number; // For monthly resets
  resetDayOfWeek?: number; // For weekly resets (0 = Sunday)
}

/**
 * Token store actions interface
 */
export interface TokenActions {
  // Core token operations
  addTokens: (amount: number, reason?: string) => Promise<boolean>;
  spendTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokens: (amount: number, reason?: string) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
  
  // Enforcement settings
  setEnforcementMode: (mode: TokenEnforcementMode) => void;
  setEnforcementEnabled: (enabled: boolean) => void;
  setWarningThreshold: (percent: number) => void;
  
  // Data management
  initialize: () => Promise<void>;
  fetchTokenData: () => Promise<void>;
  resetTokens: () => Promise<boolean>;
  resetQueriesUsed: () => void;
  updateTokenSettings: (settings: Partial<TokenState>) => void;
  setResetDate: (date: string | null) => void;
  setBalance: (amount: number) => void;
  
  // Reset scheduling
  configureReset: (config: TokenResetConfig) => Promise<boolean>;
  scheduleNextReset: (frequency: 'daily' | 'weekly' | 'monthly') => Promise<string | null>;
  
  // Analytics functions
  getUsageAnalytics: () => Promise<TokenAnalytics>;
  getUsageByProvider: () => Record<string, number>;
  getUsageByFeature: () => Record<string, number>;
  getUsageTrends: (days?: number) => Promise<Array<{date: string; tokens: number; cost: number}>>;
  getCostBreakdown: () => Promise<{
    totalCost: number;
    averageCostPerQuery: number;
    costByProvider: Record<string, number>;
    costByFeature: Record<string, number>;
  }>;
  forecastUsage: (days: number) => Promise<{
    projectedTokens: number;
    projectedCost: number;
    depletion: boolean;
    depletionDate?: string;
  }>;
}

/**
 * Combined token store interface
 */
export type TokenStore = TokenState & TokenActions;

/**
 * Token transaction record
 */
export interface TokenTransaction {
  id: string;
  amount: number;
  transactionType: 'add' | 'spend' | 'set' | 'admin_update' | 'reset' | 'reward';
  description?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  cost?: number;
  provider?: string;
  feature?: string;
}

/**
 * Token usage record
 */
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
  chat_mode?: string;
  task_type?: string;
  is_free_query?: boolean;
  is_cached?: boolean;
  latency_ms?: number;
}

/**
 * Token enforcement configuration
 */
export interface TokenEnforcementConfig {
  mode: TokenEnforcementMode;
  warningThreshold: number; // Percentage (0-100) at which to show warnings
  limitAction: 'block' | 'warn' | 'degrade'; // What to do when limit is reached
}
