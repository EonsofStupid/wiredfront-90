
import { Session, SessionMetadata } from '@/types/sessions';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps a database session to the application Session type
 */
export function mapDbSessionToSession(dbSession: any): Session {
  return {
    id: dbSession.id,
    title: dbSession.title || 'Unnamed Session',
    created_at: dbSession.created_at || new Date().toISOString(),
    last_accessed: dbSession.last_accessed || new Date().toISOString(),
    message_count: dbSession.message_count || 0,
    is_active: dbSession.is_active !== false,
    archived: dbSession.archived === true,
    metadata: mapDbMetadataToSessionMetadata(dbSession.metadata),
    user_id: dbSession.user_id
  };
}

/**
 * Maps application Session to database format
 */
export function mapSessionToDbSession(session: Session): any {
  return {
    id: session.id,
    title: session.title,
    created_at: session.created_at,
    last_accessed: session.last_accessed,
    message_count: session.message_count,
    is_active: session.is_active,
    archived: session.archived,
    metadata: mapSessionMetadataToDbMetadata(session.metadata),
    user_id: session.user_id
  };
}

/**
 * Maps database metadata to SessionMetadata
 */
export function mapDbMetadataToSessionMetadata(metadata: Json | null): SessionMetadata {
  if (!metadata) return {};
  
  if (typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)) {
    // Extract known fields as needed
    return {
      ...(metadata as any)
    };
  }
  
  return {};
}

/**
 * Maps SessionMetadata to database format
 */
export function mapSessionMetadataToDbMetadata(metadata?: SessionMetadata): Json {
  if (!metadata) return {};
  
  // Make a deep copy to avoid mutation
  return JSON.parse(JSON.stringify(metadata));
}

/**
 * Utility for deleting all sessions
 */
export async function clearAllSessions(preserveSessionId: string | null = null): Promise<{success: boolean, error?: Error}> {
  try {
    // This is a stub that will be fully implemented later
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to clear sessions')
    };
  }
}
