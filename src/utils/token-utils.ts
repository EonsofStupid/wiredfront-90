
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Type guard to check if a value is a valid TokenEnforcementMode
 */
export function isTokenEnforcementMode(value: unknown): value is TokenEnforcementMode {
  if (typeof value !== 'string') return false;
  return ['always', 'never', 'role_based', 'mode_based'].includes(value);
}

/**
 * Safely extract TokenEnforcementMode from metadata
 */
export function extractEnforcementMode(metadata: Json | null): TokenEnforcementMode | null {
  if (!metadata) return null;
  
  try {
    if (typeof metadata === 'object' && metadata !== null) {
      const metadataObj = metadata as Record<string, unknown>;
      const mode = metadataObj.enforcementMode;
      
      if (isTokenEnforcementMode(mode)) {
        return mode;
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting enforcement mode:', error);
    return null;
  }
}

/**
 * Format token amount with proper pluralization
 */
export function formatTokenAmount(amount: number): string {
  return `${amount} token${amount === 1 ? '' : 's'}`;
}

/**
 * Get descriptive text for enforcement mode
 */
export function getEnforcementModeDescription(mode: TokenEnforcementMode): string {
  switch (mode) {
    case 'always':
      return 'Tokens are required for all operations';
    case 'never':
      return 'Tokens are tracked but not enforced';
    case 'role_based':
      return 'Token enforcement depends on user role';
    case 'mode_based':
      return 'Token enforcement varies by feature mode';
    default:
      return 'Unknown enforcement mode';
  }
}
