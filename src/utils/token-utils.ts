
import { Json } from '@/integrations/supabase/types';
import { TokenEnforcementMode } from '@/types/chat/enums';

/**
 * Safely extracts a mode value from metadata
 */
export function extractMode(metadata: Record<string, any> | null): string | null {
  if (!metadata) return null;
  
  return metadata.mode || null;
}

/**
 * Extracts the token enforcement mode from feature flag metadata
 */
export function extractEnforcementMode(metadata: Record<string, any> | null): TokenEnforcementMode | null {
  if (!metadata) return null;
  
  const mode = typeof metadata === 'object' && 'mode' in metadata 
    ? metadata.mode as string
    : null;
    
  if (mode && isValidEnforcementMode(mode)) {
    return mode as TokenEnforcementMode;
  }
  
  const enforcementMode = typeof metadata === 'object' && 'enforcement_mode' in metadata
    ? metadata.enforcement_mode as string
    : null;
    
  if (enforcementMode && isValidEnforcementMode(enforcementMode)) {
    return enforcementMode as TokenEnforcementMode;
  }
  
  return null;
}

/**
 * Check if a string is a valid TokenEnforcementMode
 */
function isValidEnforcementMode(mode: string): boolean {
  return ['always', 'never', 'role_based', 'mode_based', 'warn', 'strict'].includes(mode);
}

/**
 * Format token balance for display
 */
export function formatTokenBalance(balance: number): string {
  return new Intl.NumberFormat().format(balance);
}
