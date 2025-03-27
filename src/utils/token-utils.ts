
import { Json, TokenEnforcementMode } from '@/integrations/supabase/types';

/**
 * Checks if a string is a valid TokenEnforcementMode
 */
export function isTokenEnforcementMode(value: string): value is TokenEnforcementMode {
  return ['always', 'never', 'role_based', 'mode_based'].includes(value);
}

/**
 * Extracts a valid TokenEnforcementMode from metadata or returns a default
 */
export function extractEnforcementMode(metadata: Json): TokenEnforcementMode {
  if (!metadata || typeof metadata !== 'object') {
    return 'never';
  }
  
  // Try to get the mode from metadata
  const mode = typeof metadata.mode === 'string' ? metadata.mode : null;
  
  if (mode && isTokenEnforcementMode(mode)) {
    return mode;
  }
  
  // Try to get the enforcement_mode directly
  const enforcementMode = typeof metadata.enforcement_mode === 'string' ? metadata.enforcement_mode : null;
  
  if (enforcementMode && isTokenEnforcementMode(enforcementMode)) {
    return enforcementMode;
  }
  
  return 'never';
}

/**
 * Format token count for display
 */
export function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
