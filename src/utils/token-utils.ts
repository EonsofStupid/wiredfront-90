
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Maps token enforcement modes to display labels
 */
export const tokenEnforcementModeToLabel: Record<TokenEnforcementMode, string> = {
  [TokenEnforcementMode.None]: 'Not Enforced',
  [TokenEnforcementMode.Warn]: 'Warning Only',
  [TokenEnforcementMode.Soft]: 'Soft Enforcement',
  [TokenEnforcementMode.Hard]: 'Hard Enforcement',
  [TokenEnforcementMode.Always]: 'Always',
  [TokenEnforcementMode.Never]: 'Never',
  [TokenEnforcementMode.RoleBased]: 'Role-Based',
  [TokenEnforcementMode.ModeBased]: 'Mode-Based',
  [TokenEnforcementMode.Strict]: 'Strict'
};

/**
 * Maps token enforcement modes to descriptions and visual styles
 */
export const tokenEnforcementModeInfo: Record<TokenEnforcementMode, { label: string; description: string; color: string }> = {
  [TokenEnforcementMode.None]: {
    label: 'Not Enforced',
    description: 'Token limits are not being enforced',
    color: 'text-gray-500'
  },
  [TokenEnforcementMode.Warn]: {
    label: 'Warning Only',
    description: 'You will be warned when you exceed token limits, but operations will not be blocked',
    color: 'text-yellow-500'
  },
  [TokenEnforcementMode.Soft]: {
    label: 'Soft Enforcement',
    description: 'Some functionality will be limited when you exceed token limits',
    color: 'text-orange-500'
  },
  [TokenEnforcementMode.Hard]: {
    label: 'Hard Enforcement',
    description: 'Operations will be blocked when you exceed token limits',
    color: 'text-red-500'
  },
  [TokenEnforcementMode.Always]: {
    label: 'Always',
    description: 'Token limits are always enforced',
    color: 'text-red-700'
  },
  [TokenEnforcementMode.Never]: {
    label: 'Never',
    description: 'Token limits are never enforced',
    color: 'text-gray-500'
  },
  [TokenEnforcementMode.RoleBased]: {
    label: 'Role-Based',
    description: 'Token enforcement depends on your user role',
    color: 'text-blue-500'
  },
  [TokenEnforcementMode.ModeBased]: {
    label: 'Mode-Based',
    description: 'Token enforcement depends on the current chat mode',
    color: 'text-purple-500'
  },
  [TokenEnforcementMode.Strict]: {
    label: 'Strict',
    description: 'Token limits are strictly enforced with no exceptions',
    color: 'text-red-600'
  }
};

/**
 * Database string to TokenEnforcementMode enum
 */
export const stringToEnforcementMode = (value: string): TokenEnforcementMode => {
  const normalizedValue = value.trim().toLowerCase();
  
  switch (normalizedValue) {
    case 'none':
      return TokenEnforcementMode.None;
    case 'warn':
      return TokenEnforcementMode.Warn;
    case 'soft':
      return TokenEnforcementMode.Soft;
    case 'hard':
      return TokenEnforcementMode.Hard;
    case 'always':
      return TokenEnforcementMode.Always;
    case 'never':
      return TokenEnforcementMode.Never;
    case 'role_based':
    case 'rolebased':
      return TokenEnforcementMode.RoleBased;
    case 'mode_based':
    case 'modebased':
      return TokenEnforcementMode.ModeBased;
    case 'strict':
      return TokenEnforcementMode.Strict;
    default:
      return TokenEnforcementMode.None;
  }
};

/**
 * Calculate percentage of usage based on tokens
 */
export const calculateTokenUsagePercent = (used: number, limit: number): number => {
  if (!limit || limit === 0) return 0;
  const percent = Math.round((used / limit) * 100);
  return Math.min(100, Math.max(0, percent));
};

/**
 * Check if token balance is low based on threshold
 */
export const isLowTokenBalance = (balance: number, threshold = 100): boolean => {
  return balance <= threshold;
};

/**
 * Format token balance for display
 */
export const formatTokenBalance = (balance: number): string => {
  return balance.toLocaleString();
};
