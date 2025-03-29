
import { TokenEnforcementMode } from "@/components/chat/types/chat/enums";
import { EnumUtils } from "@/lib/enums";
import { TokenAnalytics } from "@/types/token";

/**
 * Get the appropriate status color for a token balance
 * @param balance Current token balance
 * @param limit Optional token limit, if not provided only considers low balance
 * @param warningThreshold Optional warning threshold percentage (0-1), defaults to 0.1 (10%)
 * @returns Tailwind color class
 */
export function getTokenStatusColor(
  balance: number, 
  limit?: number, 
  warningThreshold = 0.1
): string {
  // If no limit, just check if balance is low
  if (!limit) {
    return balance <= 5 ? "text-destructive" : "text-primary";
  }
  
  // Calculate percentage of limit
  const percentage = balance / limit;
  
  if (percentage <= 0.05) {
    return "text-destructive"; // Critical (below 5%)
  } else if (percentage <= warningThreshold) {
    return "text-yellow-500"; // Warning (below threshold)
  } else if (percentage <= 0.25) {
    return "text-amber-500"; // Caution (below 25%)
  } else {
    return "text-primary"; // Good
  }
}

/**
 * Get the appropriate status color for a token enforcement mode
 * @param mode Token enforcement mode
 * @returns Tailwind color class
 */
export function getEnforcementModeColor(mode: TokenEnforcementMode): string {
  switch (mode) {
    case TokenEnforcementMode.None:
    case TokenEnforcementMode.Never:
      return "text-gray-500";
    case TokenEnforcementMode.Warn:
      return "text-yellow-500";
    case TokenEnforcementMode.Soft:
      return "text-orange-500";
    case TokenEnforcementMode.Hard:
    case TokenEnforcementMode.Always:
    case TokenEnforcementMode.Strict:
      return "text-red-500";
    case TokenEnforcementMode.RoleBased:
      return "text-blue-500";
    case TokenEnforcementMode.ModeBased:
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Get user-friendly label for token enforcement mode
 * Using EnumUtils for consistency
 * @param mode Token enforcement mode
 * @returns Human-readable label
 */
export function getEnforcementModeLabel(mode: TokenEnforcementMode): string {
  const infoMap = {
    [TokenEnforcementMode.None]: 'None',
    [TokenEnforcementMode.Warn]: 'Warning Only',
    [TokenEnforcementMode.Soft]: 'Soft Enforcement',
    [TokenEnforcementMode.Hard]: 'Hard Enforcement',
    [TokenEnforcementMode.Always]: 'Always Enforce',
    [TokenEnforcementMode.Never]: 'Never Enforce',
    [TokenEnforcementMode.RoleBased]: 'Role-Based',
    [TokenEnforcementMode.ModeBased]: 'Mode-Based',
    [TokenEnforcementMode.Strict]: 'Strict Enforcement'
  };
  
  return infoMap[mode] || 'Unknown';
}

/**
 * Mapping of enforcement modes to labels for use in components
 * Using the same values as getEnforcementModeLabel for consistency
 */
export const tokenEnforcementModeToLabel: Record<TokenEnforcementMode, string> = {
  [TokenEnforcementMode.None]: 'None',
  [TokenEnforcementMode.Warn]: 'Warning Only',
  [TokenEnforcementMode.Soft]: 'Soft Enforcement',
  [TokenEnforcementMode.Hard]: 'Hard Enforcement',
  [TokenEnforcementMode.Always]: 'Always Enforce',
  [TokenEnforcementMode.Never]: 'Never Enforce',
  [TokenEnforcementMode.RoleBased]: 'Role-Based',
  [TokenEnforcementMode.ModeBased]: 'Mode-Based',
  [TokenEnforcementMode.Strict]: 'Strict Enforcement'
};

/**
 * Format a cost value to a readable string with currency symbol
 * @param cost Cost value
 * @param currency Currency symbol (default: $)
 * @param decimals Number of decimal places (default: 4)
 * @returns Formatted cost string
 */
export function formatCost(cost: number, currency = '$', decimals = 4): string {
  return `${currency}${cost.toFixed(decimals)}`;
}

/**
 * Format a large number of tokens with appropriate unit (K, M, B)
 * @param tokens Number of tokens
 * @returns Formatted token string
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(1)}B`;
  } else if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  } else if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  } else {
    return tokens.toString();
  }
}

/**
 * Calculate usage percentage based on balance and limit
 * @param balance Current token balance
 * @param limit Token limit
 * @returns Percentage value (0-100)
 */
export function calculateUsagePercent(balance: number, limit?: number): number {
  if (!limit || limit <= 0) return 0;
  return Math.min(100, Math.round((balance / limit) * 100));
}

/**
 * Determine if token balance is considered low
 * @param balance Current token balance
 * @param limit Token limit (optional)
 * @param threshold Warning threshold (0-1, default: 0.1)
 * @returns Boolean indicating if balance is low
 */
export function isLowBalance(balance: number, limit?: number, threshold = 0.1): boolean {
  if (limit) {
    return (balance / limit) < threshold;
  } else {
    return balance < 10; // Default low threshold without limit
  }
}

/**
 * Generate a chart-ready dataset from token analytics
 * @param analytics TokenAnalytics object
 * @param days Number of days to include (default: 30)
 * @returns Chart-ready dataset
 */
export function generateTokenUsageDataset(analytics: TokenAnalytics, days = 30): Array<{date: string; tokens: number; cost: number}> {
  if (!analytics.usageTrends || analytics.usageTrends.length === 0) {
    // Generate empty dataset
    const dataset = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - i - 1));
      dataset.push({
        date: date.toISOString().split('T')[0],
        tokens: 0,
        cost: 0
      });
    }
    
    return dataset;
  }
  
  // Ensure we have data for all days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const allDates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    allDates.push(d.toISOString().split('T')[0]);
  }
  
  return allDates.map(date => {
    const existing = analytics.usageTrends?.find(t => t.date === date);
    return existing || { date, tokens: 0, cost: 0 };
  });
}

/**
 * Calculate reset schedule information
 * @param frequency Reset frequency ('daily', 'weekly', 'monthly', 'never')
 * @param nextResetDate Next scheduled reset date (ISO string or null)
 * @returns Object with formatted information
 */
export function getResetScheduleInfo(frequency: 'daily' | 'weekly' | 'monthly' | 'never', nextResetDate: string | null): {
  nextResetFormatted: string;
  daysUntilReset: number;
  frequencyDescription: string;
} {
  let nextResetFormatted = 'Not scheduled';
  let daysUntilReset = 0;
  
  if (nextResetDate) {
    const resetDate = new Date(nextResetDate);
    const now = new Date();
    
    // Format the date
    nextResetFormatted = resetDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Calculate days until reset
    const diffTime = resetDate.getTime() - now.getTime();
    daysUntilReset = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Get frequency description
  let frequencyDescription = 'No automatic reset';
  switch (frequency) {
    case 'daily':
      frequencyDescription = 'Resets daily at midnight';
      break;
    case 'weekly':
      frequencyDescription = 'Resets weekly on Sunday';
      break;
    case 'monthly':
      frequencyDescription = 'Resets monthly on the 1st';
      break;
  }
  
  return {
    nextResetFormatted,
    daysUntilReset,
    frequencyDescription
  };
}
