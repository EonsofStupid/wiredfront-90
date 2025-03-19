
import { ChatMode, isChatMode } from '@/types/chat';

export type MessageType = 'text' | 'command' | 'system';
export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';

// Comprehensive TokenEnforcementMode to include all possible values
export type TokenEnforcementMode = 'hard' | 'soft' | 'never' | 'always' | 'role_based' | 'mode_based';
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';
export type ChatFeatureKey = 'ai_provider' | 'github' | 'rag' | 'voice' | 'notifications' | 'status';
export type KnownFeatureFlag = 'dark_mode' | 'beta_features' | 'advanced_logging' | 'voice_input' | 'mode_switch' | 'token_enforcement' | 'token_control' | 'github_integration' | 'code_assistant' | 'rag_support' | 'github_sync';
export type LogLevel = 'info' | 'error' | 'warn' | 'debug';
export type LogSource = 'system' | 'navigation' | 'auth' | 'api' | 'chat' | 'github' | 'rag' | 'feature_access' | 'provider' | string;

// Define custom type guards for our enum types
export const isLogLevel = (value: any): value is LogLevel => {
  return ['info', 'error', 'warn', 'debug'].includes(value);
};

export const isLogSource = (value: any): value is LogSource => {
  return typeof value === 'string';
};

export const isTokenEnforcementMode = (value: any): value is TokenEnforcementMode => {
  return ['hard', 'soft', 'never', 'always', 'role_based', 'mode_based'].includes(value);
};

// Add helper function to convert between different ChatMode naming conventions
export const normalizeChatMode = (mode: ChatMode | string): ChatMode => {
  // Map legacy values to new expected values
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev'
  };
  
  // If it's a valid mode, return it or its mapped value
  if (isChatMode(mode)) {
    return modeMap[mode] || mode as ChatMode;
  }
  
  // Default fallback
  return 'chat';
};

// Helper for converting between feature flag representations
export const mapFeatureFlagToChat = (flagKey: string): string => {
  const mapping: Record<string, string> = {
    'voice_input': 'voice',
    'mode_switch': 'modeSwitch',
    'github_integration': 'github',
    'code_assistant': 'codeAssistant',
    'rag_support': 'ragSupport',
    'github_sync': 'githubSync',
    'token_enforcement': 'tokenEnforcement',
    'token_control': 'tokenEnforcement'
  };
  
  return mapping[flagKey] || flagKey;
};
