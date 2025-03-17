
import { ChatMode as StoreChatMode } from '@/components/chat/store/types/chat-store-types';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';

/**
 * Convert Supabase chat mode to store chat mode
 */
export function supabaseModeToStoreMode(mode: SupabaseChatMode): StoreChatMode {
  const modeMap: Record<SupabaseChatMode, StoreChatMode> = {
    'chat': 'chat',
    'chat-only': 'chat',
    'standard': 'chat',
    'dev': 'dev',
    'developer': 'dev',
    'image': 'image',
    'training': 'training'
  };
  
  return modeMap[mode] || 'chat';
}

/**
 * Convert store chat mode to Supabase chat mode
 */
export function storeModeToSupabaseMode(mode: StoreChatMode): SupabaseChatMode {
  const modeMap: Record<StoreChatMode, SupabaseChatMode> = {
    'chat': 'chat',
    'dev': 'dev',
    'image': 'image',
    'training': 'training'
  };
  
  return modeMap[mode] || 'chat';
}

/**
 * Get the display name for a chat mode
 */
export function getChatModeDisplayName(mode: StoreChatMode | SupabaseChatMode): string {
  const displayNames: Record<string, string> = {
    'chat': 'Chat',
    'chat-only': 'Chat',
    'standard': 'Standard Chat',
    'dev': 'Developer Mode',
    'developer': 'Developer Mode',
    'image': 'Image Generation',
    'training': 'Training Mode'
  };
  
  return displayNames[mode] || 'Chat';
}

/**
 * Get the icon name for a chat mode
 */
export function getChatModeIcon(mode: StoreChatMode | SupabaseChatMode): string {
  const icons: Record<string, string> = {
    'chat': 'message-circle',
    'chat-only': 'message-circle',
    'standard': 'message-circle',
    'dev': 'code',
    'developer': 'code',
    'image': 'image',
    'training': 'graduation-cap'
  };
  
  return icons[mode] || 'message-circle';
}
