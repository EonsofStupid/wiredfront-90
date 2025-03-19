
import { ChatMode } from '@/types/chat';

/**
 * Converts a Supabase chat mode to our internal store mode format
 */
export const supabaseModeToStoreMode = (mode: ChatMode | string): ChatMode => {
  // Handle legacy or alternative spellings of modes
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev',
    'chat': 'chat',
    'dev': 'dev',
    'image': 'image',
    'training': 'training',
    'planning': 'planning',
    'code': 'code'
  };
  
  // Return the mapped value if it exists, otherwise return the original mode or fallback
  const normalizedMode = (modeMap[mode] || mode) as ChatMode;
  
  // Validate that the result is a valid ChatMode
  if (!isValidChatMode(normalizedMode)) {
    console.warn(`Invalid chat mode: ${mode}, falling back to 'chat'`);
    return 'chat';
  }
  
  return normalizedMode;
};

/**
 * Converts our internal store mode to the Supabase format
 */
export const storeModeToSupabaseMode = (mode: ChatMode | string): ChatMode => {
  // Normalize any store-specific formats to the Supabase format
  const modeMap: Record<string, ChatMode> = {
    'chat': 'chat',
    'dev': 'dev',
    'developer': 'dev',
    'standard': 'chat',
    'image': 'image',
    'training': 'training',
    'planning': 'planning',
    'code': 'code'
  };
  
  // Return the mapped value if it exists, otherwise return the original mode or fallback
  const normalizedMode = (modeMap[mode] || mode) as ChatMode;
  
  // Validate that the result is a valid ChatMode
  if (!isValidChatMode(normalizedMode)) {
    console.warn(`Invalid chat mode: ${mode}, falling back to 'chat'`);
    return 'chat';
  }
  
  return normalizedMode;
};

/**
 * Validates that a string is a valid ChatMode
 */
export const isValidChatMode = (mode: string): mode is ChatMode => {
  return ['chat', 'dev', 'image', 'training', 'planning', 'code'].includes(mode as ChatMode);
};
