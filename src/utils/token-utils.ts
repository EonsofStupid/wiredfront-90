
import { Json } from '@/integrations/supabase/types';
import { TokenEnforcementMode, isTokenEnforcementMode } from '@/components/chat/types/chat-modes';

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
export function extractEnforcementMode(metadata: Record<string, any> | null): TokenEnforcementMode {
  if (!metadata) return 'never';
  
  // Check if mode exists directly in metadata
  if (typeof metadata === 'object' && 'mode' in metadata) {
    const mode = metadata.mode as string;
    if (isTokenEnforcementMode(mode)) {
      return mode as TokenEnforcementMode;
    }
  }
  
  // Check if enforcement_mode exists in metadata
  if (typeof metadata === 'object' && 'enforcement_mode' in metadata) {
    const enforcementMode = metadata.enforcement_mode as string;
    if (isTokenEnforcementMode(enforcementMode)) {
      return enforcementMode as TokenEnforcementMode;
    }
  }
  
  // Default fallback
  return 'never';
}

/**
 * Format token balance for display
 */
export function formatTokenBalance(balance: number): string {
  return new Intl.NumberFormat().format(balance);
}
