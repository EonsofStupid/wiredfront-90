
import { TokenEnforcementMode } from "@/types/chat/enums";
import { EnumUtils } from "@/lib/enums";

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
