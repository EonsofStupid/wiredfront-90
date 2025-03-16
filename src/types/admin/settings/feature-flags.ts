
// Define the known feature flags in the system
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
  TOKEN_CONTROL = 'token_control',
  // Adding the missing feature flags that are used in ChatState features
  VOICE = 'voice',
  RAG = 'rag',
  MODE_SWITCH = 'mode_switch'
}

// Define the app roles for type safety
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

// Creating a mapping between KnownFeatureFlag and ChatState feature keys
export type ChatFeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'tokenEnforcement';

// Mapping from KnownFeatureFlag to ChatFeatureKey
export const featureFlagToChatFeature: Record<KnownFeatureFlag, ChatFeatureKey | null> = {
  [KnownFeatureFlag.VOICE]: 'voice',
  [KnownFeatureFlag.RAG]: 'rag',
  [KnownFeatureFlag.MODE_SWITCH]: 'modeSwitch',
  [KnownFeatureFlag.NOTIFICATIONS]: 'notifications',
  [KnownFeatureFlag.GITHUB_INTEGRATION]: 'github',
  [KnownFeatureFlag.CODE_ASSISTANT]: 'codeAssistant',
  [KnownFeatureFlag.RAG_SUPPORT]: 'ragSupport',
  [KnownFeatureFlag.GITHUB_SYNC]: 'githubSync',
  [KnownFeatureFlag.TOKEN_ENFORCEMENT]: 'tokenEnforcement',
  [KnownFeatureFlag.TOKEN_CONTROL]: 'tokenEnforcement',
  [KnownFeatureFlag.DEV_MODE]: null,
  [KnownFeatureFlag.BETA_FEATURES]: null,
  [KnownFeatureFlag.AI_FEATURES]: null,
  [KnownFeatureFlag.EXPERIMENTAL]: null
};

// Feature flag base interface
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles?: AppRole[];
  target_users?: string[];
  rollout_percentage?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  feature_type?: string;
}

// Form data for creating/updating feature flags
export interface FeatureFlagFormData {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles: AppRole[];
  target_users: string[];
  rollout_percentage: number;
  metadata: Record<string, any>;
}

// Helper to convert between feature flag types
export function mapFeatureFlagToChat(flag: KnownFeatureFlag): ChatFeatureKey | null {
  return featureFlagToChatFeature[flag];
}

export function isChatFeatureKey(key: string): key is ChatFeatureKey {
  return [
    'voice', 'rag', 'modeSwitch', 'notifications', 'github',
    'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'
  ].includes(key);
}

// Alias for backward compatibility
export type FeatureFlagFormValues = FeatureFlagFormData;
