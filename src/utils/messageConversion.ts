import { DBMessage, DBSession, Message, Session } from '@/types/chat';
import { normalizeChatMode } from '@/types/chat/core';
import { jsonToRecord, toJson } from '@/types/supabase';

/**
 * Convert a database message to an application message
 */
export function dbMessageToMessage(dbMessage: DBMessage): Message {
  return {
    id: dbMessage.id,
    session_id: dbMessage.session_id,
    user_id: dbMessage.user_id,
    role: dbMessage.role as any,
    content: dbMessage.content,
    metadata: jsonToRecord(dbMessage.metadata),
    message_status: dbMessage.status as any,
    retry_count: dbMessage.retry_count,
    last_retry: dbMessage.last_retry || undefined,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at,
    timestamp: dbMessage.created_at,
    position_order: dbMessage.position_order
  };
}

/**
 * Convert an application message to a database message
 */
export function messageToDBMessage(message: Message): Partial<DBMessage> {
  return {
    id: message.id,
    session_id: message.session_id,
    user_id: message.user_id || null,
    role: message.role,
    content: message.content,
    metadata: toJson(message.metadata || {}),
    status: message.message_status,
    retry_count: message.retry_count || 0,
    last_retry: message.last_retry || null,
    position_order: message.position_order || 0
  };
}

/**
 * Convert a database session to an application session
 */
export function dbSessionToSession(dbSession: DBSession): Session {
  return {
    id: dbSession.id,
    title: dbSession.title || 'Untitled Chat',
    user_id: dbSession.user_id,
    mode: normalizeChatMode(dbSession.mode),
    provider_id: dbSession.provider_id || undefined,
    project_id: dbSession.project_id || undefined,
    metadata: jsonToRecord(dbSession.metadata),
    context: jsonToRecord(dbSession.context),
    is_active: dbSession.is_active,
    created_at: dbSession.created_at,
    last_accessed: dbSession.last_accessed,
    tokens_used: dbSession.tokens_used,
    message_count: dbSession.message_count
  };
}

/**
 * Convert an application session to a database session
 */
export function sessionToDBSession(session: Session): Partial<DBSession> {
  return {
    id: session.id,
    title: session.title,
    user_id: session.user_id,
    mode: session.mode,
    provider_id: session.provider_id || null,
    project_id: session.project_id || null,
    metadata: toJson(session.metadata || {}),
    context: toJson(session.context || {}),
    is_active: session.is_active,
    tokens_used: session.tokens_used || 0,
    message_count: session.message_count || 0
  };
}

export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // If less than 1 minute ago
  if (diff < 60000) {
    return 'just now';
  }

  // If less than 1 hour ago
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // If less than 24 hours ago
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // If less than 7 days ago
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  // Otherwise, show the date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
