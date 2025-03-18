
import { ChatMode as SupabaseChatMode, normalizeChatMode } from "@/integrations/supabase/types/enums";
import { ChatMode as StoreChatMode } from "@/components/chat/store/types/chat-store-types";

/**
 * Convert a Supabase ChatMode to a Store ChatMode
 */
export function supabaseModeToStoreMode(mode: SupabaseChatMode): StoreChatMode {
  // Normalize the supabase mode first
  const normalizedMode = normalizeChatMode(mode);
  
  // Handle special case mapping
  const modeMap: Record<string, StoreChatMode> = {
    'standard': 'chat',
    'chat': 'chat',
    'developer': 'dev',
    'dev': 'dev',
    'training': 'training',
    'image': 'image'
  };
  
  const storeMode = modeMap[normalizedMode] as StoreChatMode;
  if (!storeMode) {
    console.warn(`Unknown mode conversion: ${mode} -> defaulting to 'chat'`);
    return 'chat';
  }
  
  return storeMode;
}

/**
 * Convert a Store ChatMode to a Supabase ChatMode
 */
export function storeModeToSupabaseMode(mode: StoreChatMode): SupabaseChatMode {
  const modeMap: Record<string, SupabaseChatMode> = {
    'chat': 'chat',
    'chat-only': 'chat',
    'dev': 'dev',
    'training': 'training',
    'image': 'image'
  };
  
  const supabaseMode = modeMap[mode] as SupabaseChatMode;
  if (!supabaseMode) {
    console.warn(`Unknown mode conversion: ${mode} -> defaulting to 'chat'`);
    return 'chat';
  }
  
  return supabaseMode;
}

/**
 * Type guard to check if a value is a valid StoreChatMode
 */
export function isStoreChatMode(value: any): value is StoreChatMode {
  return ['chat', 'chat-only', 'dev', 'image', 'training'].includes(value);
}

/**
 * Type guard to check if a value is a valid SupabaseChatMode
 */
export function isSupabaseChatMode(value: any): value is SupabaseChatMode {
  return ['chat', 'chat-only', 'dev', 'image', 'training', 'standard', 'developer'].includes(value);
}
