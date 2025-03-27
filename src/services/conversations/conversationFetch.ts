
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationMetadata } from '@/types/conversations';
import { logger } from '@/services/chat/LoggingService';

/**
 * Raw conversation data structure from database
 * Using a completely decoupled interface to prevent type recursion issues
 */
interface RawConversationData {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  archived: boolean;
  metadata: unknown; // Use unknown to break type recursion
  user_id: string | null;
}

/**
 * Clean mapping function to transform database records to application domain objects
 * This function handles type conversion and provides a clear separation between 
 * database schema and application domain model
 */
function mapToConversation(rawData: RawConversationData, messageCount: number = 0): Conversation {
  // Validate and transform the metadata to ensure type safety
  const safeMetadata: ConversationMetadata = rawData.metadata 
    ? validateAndTransformMetadata(rawData.metadata)
    : {};
  
  return {
    id: rawData.id,
    title: rawData.title,
    created_at: rawData.created_at,
    last_accessed: rawData.last_accessed,
    message_count: messageCount,
    is_active: !rawData.archived,
    archived: rawData.archived,
    metadata: safeMetadata,
    user_id: rawData.user_id || undefined
  };
}

/**
 * Helper function to validate and transform raw metadata to a type-safe structure
 * This adds runtime validation to complement the TypeScript type checking
 */
function validateAndTransformMetadata(rawMetadata: unknown): ConversationMetadata {
  if (!rawMetadata || typeof rawMetadata !== 'object') {
    return {};
  }
  
  // Process the metadata to ensure type safety
  const processed: ConversationMetadata = {};
  
  if (rawMetadata && typeof rawMetadata === 'object') {
    // Cast to Record to work with it
    const metaObj = rawMetadata as Record<string, unknown>;
    
    // Copy valid properties
    if ('mode' in metaObj && typeof metaObj.mode === 'string') {
      processed.mode = metaObj.mode;
    }
    
    if ('context' in metaObj && typeof metaObj.context === 'object' && metaObj.context) {
      processed.context = metaObj.context as Record<string, unknown>;
    }
    
    if ('settings' in metaObj && typeof metaObj.settings === 'object' && metaObj.settings) {
      processed.settings = metaObj.settings as Record<string, unknown>;
    }
    
    // Handle lastPosition if it exists
    if ('lastPosition' in metaObj && typeof metaObj.lastPosition === 'object' && metaObj.lastPosition) {
      const posObj = metaObj.lastPosition as Record<string, unknown>;
      if ('x' in posObj && 'y' in posObj && 
          typeof posObj.x === 'number' && typeof posObj.y === 'number') {
        processed.lastPosition = { x: posObj.x, y: posObj.y };
      }
    }
    
    // Handle other properties
    Object.entries(metaObj).forEach(([key, value]) => {
      if (!['mode', 'context', 'settings', 'lastPosition'].includes(key)) {
        processed[key] = value;
      }
    });
  }
  
  return processed;
}

/**
 * Fetches all conversations for the current authenticated user
 */
export async function fetchUserConversations(): Promise<Conversation[]> {
  try {
    // Get user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch chat conversations for the current user
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        id,
        title,
        created_at,
        last_accessed,
        archived,
        metadata,
        user_id
      `)
      .eq('user_id', user.id)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to our internal type to break recursive type chains
    // Use type assertion only at this boundary between external and internal types
    const rawConversations: RawConversationData[] = data.map(item => ({
      id: item.id,
      title: item.title,
      created_at: item.created_at,
      last_accessed: item.last_accessed,
      archived: item.archived,
      metadata: item.metadata,
      user_id: item.user_id
    }));
    
    // Get message counts for each conversation and map to final Conversation objects
    const conversationsWithCounts = await Promise.all(rawConversations.map(async (conversation) => {
      // Count messages for this conversation
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversation.id);
      
      if (countError) {
        logger.warn('Failed to get message count', { error: countError, conversationId: conversation.id });
      }
      
      // Convert to domain model using the mapper function
      return mapToConversation(conversation, count || 0);
    }));
    
    logger.info('Conversations fetched', { count: conversationsWithCounts.length });
    return conversationsWithCounts;
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    throw error;
  }
}
