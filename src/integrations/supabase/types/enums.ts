
// Define the enum for token enforcement modes to match what's in the DB
export type TokenEnforcementMode = 'always' | 'never' | 'role_based' | 'mode_based';

// Chat modes 
export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training';

// Define app roles
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

// Define validation statuses
export type ValidationStatus = 'valid' | 'invalid' | 'pending' | 'expired';

// Define message types
export type MessageType = 'text' | 'command' | 'system';

// Define setting types
export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';

// Define feature flag types
export enum KnownFeatureFlag {
  DEV_MODE = 'dev_mode',
  BETA_FEATURES = 'beta_features',
  AI_FEATURES = 'ai_features',
  GITHUB_INTEGRATION = 'github_integration',
  RAG_SUPPORT = 'rag_support',
  TOKEN_ENFORCEMENT = 'token_enforcement',
  EXPERIMENTAL = 'experimental',
  CODE_ASSISTANT = 'code_assistant',
  GITHUB_SYNC = 'github_sync',
  NOTIFICATIONS = 'notifications',
  TOKEN_CONTROL = 'token_control'
}
