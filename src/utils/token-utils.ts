
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

/**
 * Validates if a string is a valid TokenEnforcementMode
 */
export function isTokenEnforcementMode(mode: string): mode is TokenEnforcementMode {
  return ['always', 'never', 'role_based', 'mode_based'].includes(mode);
}

/**
 * Converts a string to a valid TokenEnforcementMode or returns a default
 */
export function ensureValidEnforcementMode(
  mode: string | undefined | null,
  defaultMode: TokenEnforcementMode = 'never'
): TokenEnforcementMode {
  if (!mode) return defaultMode;
  return isTokenEnforcementMode(mode) ? mode : defaultMode;
}
