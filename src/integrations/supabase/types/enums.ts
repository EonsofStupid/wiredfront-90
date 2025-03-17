
export type MessageType = 'text' | 'command' | 'system';
export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';
export type ChatMode = 'standard' | 'developer' | 'training' | 'image'; 
export type TokenEnforcementMode = 'hard' | 'soft' | 'never';
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';
export type ChatFeatureKey = 'ai_provider' | 'github' | 'rag' | 'voice' | 'notifications' | 'status';
export type KnownFeatureFlag = 'dark_mode' | 'beta_features' | 'advanced_logging' | 'voice_input';
