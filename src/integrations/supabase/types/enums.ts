
export type MessageType = 'text' | 'command' | 'system';
export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';
export type ChatMode = 'standard' | 'developer' | 'training' | 'image'; 
export type TokenEnforcementMode = 'hard' | 'soft' | 'never' | 'always' | 'role_based' | 'mode_based';
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';
export type ChatFeatureKey = 'ai_provider' | 'github' | 'rag' | 'voice' | 'notifications' | 'status';
export type KnownFeatureFlag = 'dark_mode' | 'beta_features' | 'advanced_logging' | 'voice_input' | 'mode_switch' | 'token_enforcement' | 'token_control' | 'github_integration' | 'code_assistant' | 'rag_support' | 'github_sync';
export type LogLevel = 'info' | 'error' | 'warn' | 'debug';
export type LogSource = 'system' | 'navigation' | 'auth' | 'api' | 'chat' | 'github' | 'rag' | 'feature_access' | 'provider' | string;
