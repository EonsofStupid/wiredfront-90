
// Define the enum for token enforcement modes to match what's in the DB
export type TokenEnforcementMode = 'always' | 'never' | 'role_based' | 'mode_based';

// Chat modes 
export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training';

// Define app roles - ensuring consistency with feature-flags.ts
export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

// Define validation statuses
export type ValidationStatus = 'valid' | 'invalid' | 'pending' | 'expired';

// Define message types
export type MessageType = 'text' | 'command' | 'system';

// Define setting types
export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';

// Using the same enum from feature-flags.ts for consistency
import { KnownFeatureFlag } from '@/types/admin/settings/feature-flags';
export { KnownFeatureFlag };

// Export chat feature type to ensure consistency
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
