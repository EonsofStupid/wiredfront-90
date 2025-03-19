
import { ChatMode, isChatMode, normalizeChatMode } from '@/types/chat';

/**
 * Converts a Supabase chat mode to our internal store mode format
 */
export const supabaseModeToStoreMode = (mode: string | null | undefined): ChatMode => {
  return normalizeChatMode(mode);
};

/**
 * Converts our internal store mode to the Supabase format
 */
export const storeModeToSupabaseMode = (mode: string | null | undefined): string => {
  if (!mode) return 'chat';
  
  // Normalize any store-specific formats to the Supabase format
  const modeMap: Record<string, string> = {
    'chat': 'chat',
    'dev': 'dev',
    'developer': 'dev',
    'standard': 'chat',
    'image': 'image',
    'training': 'training',
    'planning': 'planning',
    'code': 'code'
  };
  
  // Return the mapped value if it exists, otherwise return the original mode
  return modeMap[mode] || mode;
};

/**
 * Validates that a string is a valid ChatMode
 */
export const isValidChatMode = (mode: unknown): mode is ChatMode => {
  return isChatMode(mode);
};
