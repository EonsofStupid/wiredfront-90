
import { TokenEnforcementMode, UIEnforcementMode } from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps UI enforcement modes to database enforcement modes
 */
export const uiEnforcementToDatabaseEnforcement: Record<UIEnforcementMode, TokenEnforcementMode> = {
  [UIEnforcementMode.Always]: TokenEnforcementMode.Always,
  [UIEnforcementMode.Soft]: TokenEnforcementMode.Warn,
  [UIEnforcementMode.Never]: TokenEnforcementMode.Never
};

/**
 * Maps database enforcement modes to UI enforcement modes
 */
export const databaseEnforcementToUiEnforcement: Record<TokenEnforcementMode, UIEnforcementMode> = {
  [TokenEnforcementMode.Always]: UIEnforcementMode.Always,
  [TokenEnforcementMode.Never]: UIEnforcementMode.Never,
  [TokenEnforcementMode.RoleBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.ModeBased]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Warn]: UIEnforcementMode.Soft,
  [TokenEnforcementMode.Strict]: UIEnforcementMode.Always
};

/**
 * Extracts the token enforcement mode from metadata
 */
export const extractEnforcementMode = (metadata: Json | null): TokenEnforcementMode | null => {
  if (!metadata) return null;
  
  // Handle string mode
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return extractEnforcementMode(parsed);
    } catch (e) {
      return null;
    }
  }
  
  // Handle object with mode property
  if (typeof metadata === 'object' && metadata !== null) {
    if ('mode' in metadata) {
      const mode = metadata.mode;
      if (typeof mode === 'string' && isValidEnforcementMode(mode)) {
        return mode as TokenEnforcementMode;
      }
    }
    
    if ('enforcement_mode' in metadata) {
      const mode = metadata.enforcement_mode;
      if (typeof mode === 'string' && isValidEnforcementMode(mode)) {
        return mode as TokenEnforcementMode;
      }
    }
  }
  
  return null;
};

/**
 * Validates if a string is a valid token enforcement mode
 */
export const isValidEnforcementMode = (mode: string): boolean => {
  return Object.values(TokenEnforcementMode).includes(mode as TokenEnforcementMode);
};

/**
 * Converts a UI enforcement mode to a database enforcement mode
 */
export const convertUiToDbEnforcement = (uiMode: UIEnforcementMode): TokenEnforcementMode => {
  return uiEnforcementToDatabaseEnforcement[uiMode] || TokenEnforcementMode.Warn;
};

/**
 * Converts a database enforcement mode to a UI enforcement mode
 */
export const convertDbToUiEnforcement = (dbMode: TokenEnforcementMode): UIEnforcementMode => {
  return databaseEnforcementToUiEnforcement[dbMode] || UIEnforcementMode.Soft;
};
