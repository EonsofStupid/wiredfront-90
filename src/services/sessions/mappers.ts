
import { Session, SessionMetadata } from '@/types/sessions';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps a database session to the application Session type
 */
export function mapDbSessionToSession(dbSession: any): Session {
  return {
    id: dbSession.id,
    title: dbSession.title || '',
    created_at: dbSession.created_at || new Date().toISOString(),
    last_accessed: dbSession.last_accessed || new Date().toISOString(),
    message_count: dbSession.message_count || 0,
    is_active: !dbSession.archived,
    archived: dbSession.archived || false,
    metadata: mapDbMetadataToSessionMetadata(dbSession.metadata),
    user_id: dbSession.user_id || undefined
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
    archived: session.archived || false,
    metadata: mapSessionMetadataToDbMetadata(session.metadata || {}),
    user_id: session.user_id
  };
}

/**
 * Maps database metadata (Json) to SessionMetadata
 */
export function mapDbMetadataToSessionMetadata(metadata: Json | null): SessionMetadata {
  if (!metadata) return {};
  
  // Type safety: ensure we return the correct type
  const result: SessionMetadata = {};
  
  // Map known fields
  if (typeof metadata === 'object' && metadata !== null) {
    if ('providerId' in metadata) result.providerId = String(metadata.providerId);
    if ('mode' in metadata) result.mode = String(metadata.mode);
    if ('models' in metadata && Array.isArray(metadata.models)) {
      result.models = metadata.models.map(String);
    }
    if ('tags' in metadata && Array.isArray(metadata.tags)) {
      result.tags = metadata.tags.map(String);
    }
    if ('projectId' in metadata) result.projectId = String(metadata.projectId);
    
    // Copy other properties
    Object.entries(metadata).forEach(([key, value]) => {
      if (!(key in result)) {
        result[key] = value;
      }
    });
  }
  
  return result;
}

/**
 * Maps SessionMetadata to database Json format
 */
export function mapSessionMetadataToDbMetadata(metadata: SessionMetadata): Json {
  return metadata as Json;
}
