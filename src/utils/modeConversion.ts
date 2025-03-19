
import { ChatMode, isChatMode } from '@/types/chat';

/**
 * Converts a Supabase chat mode to our internal store mode format
 */
export const supabaseModeToStoreMode = (mode: string | null | undefined): ChatMode => {
  if (!mode) return 'chat';
  
  // Handle legacy or alternative spellings of modes
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev',
  };
  
  // Return the mapped value if it exists, otherwise check if the original is valid
  const normalizedMode = modeMap[mode] || mode;
  
  // Validate that the result is a valid ChatMode
  if (!isChatMode(normalizedMode)) {
    console.warn(`Invalid chat mode: ${mode}, falling back to 'chat'`);
    return 'chat';
  }
  
  return normalizedMode as ChatMode;
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
