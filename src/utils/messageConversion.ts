import { DBMessage, Message, MessageRole, MessageStatus } from '@/types/chat/messages';
import { Json } from '@/integrations/supabase/types';

/**
 * Convert a database message to application message format
 */
export function dbMessageToMessage(dbMessage: any): Message {
  return {
    id: dbMessage.id,
    session_id: dbMessage.session_id,
    user_id: dbMessage.user_id,
    role: dbMessage.role as MessageRole,
    content: dbMessage.content,
    message_status: dbMessage.status as MessageStatus,
    metadata: typeof dbMessage.metadata === 'object' ? dbMessage.metadata : {},
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at,
    timestamp: dbMessage.created_at,
    position_order: dbMessage.position_order,
    retry_count: dbMessage.retry_count,
    last_retry: dbMessage.last_retry,
  };
}

/**
 * Convert application message to database format
 */
export function messageToDbMessage(message: Message): Partial<DBMessage> {
  return {
    id: message.id,
    session_id: message.session_id,
    user_id: message.user_id,
    role: message.role,
    content: message.content,
    status: message.message_status || message.status,
    metadata: message.metadata as unknown as Json,
    created_at: message.created_at,
    updated_at: message.updated_at,
    position_order: message.position_order,
    retry_count: message.retry_count,
    last_retry: message.last_retry,
    type: 'text', // Default type
  };
}

/**
 * Convert timestamp to readable format
 */
export function formatMessageTimestamp(timestamp?: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  // If today, just show time
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this year, show month and day with time
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Otherwise show full date
  return date.toLocaleDateString() + ' ' + 
         date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
