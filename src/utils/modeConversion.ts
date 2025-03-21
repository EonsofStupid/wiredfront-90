
import { ChatMode, isChatMode, CHAT_MODES } from '@/types/chat/core';

/**
 * Convert a Supabase mode to a store-compatible mode
 */
export function supabaseModeToStoreMode(mode: string): ChatMode {
  // Map database mode values to store mode values
  const modeMap: Record<string, ChatMode> = {
    'standard': CHAT_MODES.CHAT,
    'developer': CHAT_MODES.DEV
  };
  
  // If it's already a valid mode, return it or its mapped value
  if (isChatMode(mode)) {
    return mode;
  }
  
  // Check if there's a mapping
  if (mode in modeMap) {
    return modeMap[mode];
  }
  
  // Default fallback
  return CHAT_MODES.CHAT;
}

/**
 * Convert a store mode to a Supabase-compatible mode
 */
export function storeModeToSupabaseMode(mode: ChatMode): string {
  // Map store mode values to database mode values
  const modeMap: Record<ChatMode, string> = {
    'chat': 'chat',
    'dev': 'dev',
    'image': 'image',
    'training': 'training',
    'code': 'code',
    'planning': 'planning'
  };
  
  return modeMap[mode] || 'chat';
}
