
// Enum types used in database queries
export type MessageRoleType = 'user' | 'assistant' | 'system' | 'error' | 'tool' | 'function';

export type MessageTypeType = 'text' | 'command' | 'system' | 'image' | 'training' | 'code' | 'file' | 'audio' | 'link' | 'document';

export type MessageStatusType = 'pending' | 'sending' | 'sent' | 'received' | 'error' | 'failed' | 'retrying' | 'cached' | 'canceled' | 'delivered';

export type ChatModeType = 'chat' | 'dev' | 'image' | 'training' | 'planning' | 'code' | 'editor' | 'document' | 'audio';

export type TokenEnforcementModeType = 'none' | 'warn' | 'soft' | 'hard' | 'always' | 'never' | 'role_based' | 'mode_based' | 'strict';

export type UserRoleType = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

export type ApiType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';

export type ValidationStatus = 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error' | 'pending';

export type VectorStoreType = 'pinecone' | 'weaviate' | 'qdrant' | 'milvus' | 'supabase';

export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';

// Import and re-export for direct use
export { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode,
  TaskType,
  UIEnforcementMode
} from '@/components/chat/types/chat/enums';
