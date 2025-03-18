
import { TokenEnforcementMode } from "@/integrations/supabase/types/enums";
import { KnownFeatureFlag } from "@/types/admin/settings/feature-flags";

// Feature keys that can be toggled
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'tokenEnforcement';

// Feature states 
export interface FeatureState {
  voice: boolean;
  rag: boolean;
  modeSwitch: boolean;
  notifications: boolean;
  github: boolean;
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  tokenEnforcement: boolean;
}

// Actions that can be performed on features
export interface FeatureActions {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => void;
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
}

// Token control specific state
export interface TokenControlState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

// Token management actions
export interface TokenActions {
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
}

// Provider-specific actions
export interface ProviderActions {
  updateCurrentProvider: (provider: any) => void;
  updateAvailableProviders: (providers: any[]) => void;
  updateChatProvider: (providers: any[]) => void;
}

// Combined feature actions
export type CombinedFeatureActions = FeatureActions & TokenActions & ProviderActions;

/**
 * Converts an admin feature flag to a chat store feature key
 */
export function convertFeatureKeyToChatFeature(flag: KnownFeatureFlag): FeatureKey | null {
  const mapping: Record<string, FeatureKey> = {
    'code_assistant': 'codeAssistant',
    'rag_support': 'ragSupport',
    'github_sync': 'githubSync',
    'notifications': 'notifications',
    'voice_input': 'voice',
    'rag_indexing': 'rag',
    'mode_switching': 'modeSwitch',
    'github_integration': 'github',
    'token_enforcement': 'tokenEnforcement'
  };
  
  const key = mapping[flag];
  if (key) {
    return key;
  }
  
  console.warn(`No matching chat feature found for feature flag: ${flag}`);
  return null;
}
