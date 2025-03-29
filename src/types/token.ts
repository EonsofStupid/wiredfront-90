
import { TokenEnforcementMode } from './enums';

/**
 * Token state interface for the token store
 */
export interface TokenState {
  // Token balance and limits
  balance: number;
  limit: number;
  used: number;
  usagePercent: number;
  
  // Enforcement settings
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  enforcementSettings: Record<string, any>;
  
  // Usage tracking
  usageHistory: TokenUsageHistoryItem[];
  queriesUsed: number;
  freeQueryLimit: number;
  tokensPerQuery: number;
  costPerToken: number;
  lastUpdated: string;
  lastReset: string;
  nextResetDate: string | null;
  
  // Reset configuration
  resetFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  warningThreshold: number;
  
  // Usage statistics
  totalEarned: number;
  totalSpent: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  
  // Provider and feature usage
  usageByProvider: Record<string, number>;
  usageByFeature: Record<string, number>;
  
  // User tier
  tier: string;
  
  // State management
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Token usage history item
 */
export interface TokenUsageHistoryItem {
  id?: string;
  date: string;
  usage: number;
  provider?: string;
  feature?: string;
  details?: string;
}

/**
 * Token transaction type
 */
export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'credit' | 'debit' | 'adjustment' | 'reset';
  provider?: string;
  feature?: string;
  description?: string;
  cost?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

/**
 * Token usage tracking for sessions
 */
export interface TokenUsage {
  id?: string;
  userId: string;
  sessionId?: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: string;
  featureKey?: string;
  chatMode?: string;
  taskType?: string;
  context?: Record<string, any>;
  isCached?: boolean;
  isFreeQuery?: boolean;
  latencyMs?: number;
}

/**
 * Token settings interface
 */
export interface TokenSettings {
  enforcementMode: TokenEnforcementMode;
  enforcementEnabled: boolean;
  warningThreshold: number;
  resetFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  tokensPerQuery: number;
  freeQueryLimit: number;
  costPerToken: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}
