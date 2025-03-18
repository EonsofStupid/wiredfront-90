
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { ChatMode as StoreChatMode } from '@/components/chat/store/types/chat-store-types';

/**
 * Convert Supabase mode enum to store mode type
 */
export const supabaseModeToStoreMode = (mode: SupabaseChatMode): StoreChatMode => {
  switch (mode) {
    case 'dev':
    case 'developer':
      return 'dev';
    case 'image':
      return 'image';
    case 'training':
      return 'training';
    case 'standard':
    case 'chat':
    default:
      return 'chat';
  }
};

/**
 * Convert store mode type to Supabase mode enum
 */
export const storeModeToSupabaseMode = (mode: StoreChatMode): SupabaseChatMode => {
  switch (mode) {
    case 'dev':
      return 'dev';
    case 'image':
      return 'image';
    case 'training':
      return 'training';
    case 'chat':
    default:
      return 'chat';
  }
};
