
/**
 * Token enforcement modes
 */
export enum TokenEnforcementMode {
  None = 'none',     // No enforcement
  Warn = 'warn',     // Warn user but allow operations
  Soft = 'soft',     // Degrade functionality but allow some operations
  Hard = 'hard'      // Strictly enforce limits and block operations
}

/**
 * Token usage entry
 */
export interface TokenUsage {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  timestamp: string;
  sessionId?: string;
  featureId?: string;
}

/**
 * Token rule definition
 */
export interface TokenRule {
  id: string;
  name: string;
  description: string;
  condition: {
    type: 'balance' | 'usage' | 'feature';
    threshold: number;
    operator: 'less_than' | 'greater_than' | 'equal' | 'not_equal';
  };
  action: {
    type: 'block' | 'warn' | 'degrade' | 'limit';
    message?: string;
    limitTo?: number;
  };
  isActive: boolean;
  priority: number;
}

/**
 * Token quota definition
 */
export interface TokenQuota {
  id: string;
  userId: string;
  plan: string;
  limit: number;
  used: number;
  resetInterval: 'daily' | 'weekly' | 'monthly' | 'never';
  nextReset: string | null;
  lastUpdated: string;
}
