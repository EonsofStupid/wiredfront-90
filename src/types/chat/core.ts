
/**
 * Core type definitions for the chat system
 */

// Basic chat modes supported by the system
export type ChatMode = 'chat' | 'code' | 'editor' | 'project' | 'assistant' | 'agent' | 'doc';

// Message roles
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning' | 'info';

// Message status for tracking delivery and read state
export type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed' 
  | 'pending';

// Connection state for realtime features
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

// Basic validation function for chat modes - used to validate incoming mode values
export function isChatMode(value: unknown): value is ChatMode {
  if (typeof value !== 'string') return false;
  
  const validModes: ChatMode[] = [
    'chat', 'code', 'editor', 'project', 'assistant', 'agent', 'doc'
  ];
  
  return validModes.includes(value as ChatMode);
}
