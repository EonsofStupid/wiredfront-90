
import { supabase } from '@/integrations/supabase/client';
import { CreateConversationParams, ConversationOperationResult } from '@/types/conversations';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates a new chat conversation
 */
export async function createNewConversation(params?: CreateConversationParams): Promise<ConversationOperationResult> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    // Extract mode from metadata if available - with proper type checking
    const metadata = params?.metadata || {};
    const mode = typeof metadata === 'object' && 'mode' in metadata ? 
      metadata.mode as string : 'chat';
    const providerId = typeof metadata === 'object' && 'providerId' in metadata ? 
      metadata.providerId as string : undefined;
    
    // Generate a better default title based on mode
    let defaultTitle = params?.title;
    if (!defaultTitle) {
      const dateStr = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      
      switch (mode) {
        case 'dev':
        case 'editor':
          defaultTitle = `Code Session (${dateStr})`;
          break;
        case 'image':
          defaultTitle = `Image Generation (${dateStr})`;
          break;
        case 'training':
          defaultTitle = `Training Session (${dateStr})`;
          break;
        default:
          defaultTitle = `Chat ${dateStr}`;
      }
    }
    
    // Create a new conversation
    const { error } = await supabase
      .from('chat_conversations')
      .insert({
        id: conversationId,
        user_id: user.id,
        title: defaultTitle,
        created_at: now,
        last_accessed: now,
        archived: false,
        mode: mode,
        provider_id: providerId,
        // Ensure metadata is JSON compatible
        metadata: {
          ...(typeof metadata === 'object' ? 
            Object.fromEntries(
              Object.entries(metadata)
                .filter(([k]) => k !== 'mode' && k !== 'providerId')
                .map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v])
            ) : {})
        }
      });

    if (error) throw error;
    
    logger.info('New conversation created', { 
      conversationId, 
      title: defaultTitle,
      mode,
      providerId
    });
    
    return { success: true, conversationId };
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return { success: false, error };
  }
}
