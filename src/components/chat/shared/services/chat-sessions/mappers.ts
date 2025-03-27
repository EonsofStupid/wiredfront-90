
import { Session, DBSession } from '@/types/chatsessions';

/**
 * Maps a database session to our front-end Session type
 */
export function mapDbSessionToSession(dbSession: DBSession): Session {
  return {
    id: dbSession.id,
    user_id: dbSession.user_id,
    title: dbSession.title,
    created_at: dbSession.created_at,
    updated_at: dbSession.updated_at || dbSession.created_at,
    last_accessed: dbSession.last_accessed,
    tokens_used: dbSession.tokens_used || 0,
    message_count: dbSession.message_count || 0,
    metadata: dbSession.metadata || {},
    archived: dbSession.archived,
    mode: dbSession.mode,
    context: {},
    is_active: true
  };
}

/**
 * Maps our front-end Session type to the database format
 */
export function mapSessionToDbSession(session: Session): DBSession {
  return {
    id: session.id,
    user_id: session.user_id,
    title: session.title,
    created_at: session.created_at,
    last_accessed: session.last_accessed,
    tokens_used: session.tokens_used,
    message_count: session.message_count,
    metadata: session.metadata,
    archived: session.archived,
    mode: session.mode,
    provider_id: session.provider_id,
    updated_at: new Date().toISOString(),
  };
}
