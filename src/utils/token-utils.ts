
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

/**
 * Type guard to check if a value is a valid TokenEnforcementMode
 */
export function isTokenEnforcementMode(value: any): value is TokenEnforcementMode {
  return [
    'hard', 
    'soft', 
    'never', 
    'always', 
    'role_based', 
    'mode_based'
  ].includes(value);
}

/**
 * Convert a potential token enforcement mode string to a valid mode or default
 */
export function normalizeTokenEnforcementMode(
  mode: string | undefined | null, 
  defaultMode: TokenEnforcementMode = 'never'
): TokenEnforcementMode {
  if (!mode) return defaultMode;
  
  return isTokenEnforcementMode(mode) ? mode : defaultMode;
}

/**
 * Map token enforcement mode to display name
 */
export function getTokenEnforcementModeDisplayName(mode: TokenEnforcementMode): string {
  const modeMap: Record<TokenEnforcementMode, string> = {
    'hard': 'Strict Enforcement',
    'soft': 'Warning Only',
    'never': 'Disabled',
    'always': 'Always Enabled',
    'role_based': 'Role-Based',
    'mode_based': 'Mode-Based'
  };
  
  return modeMap[mode] || 'Unknown';
}
