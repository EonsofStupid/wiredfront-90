
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider, FeatureState } from "../../types/chat-store-types";
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { KnownFeatureFlag, ChatFeatureKey } from '@/types/admin/settings/feature-flags';

// Export feature key types for usage throughout the application
export type FeatureKey = ChatFeatureKey | KnownFeatureFlag;

// Define proper Zustand types for state management
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;

export interface FeatureActions {
  toggleFeature: (feature: keyof FeatureState) => void;
  enableFeature: (feature: keyof FeatureState) => void;
  disableFeature: (feature: keyof FeatureState) => void;
  setFeatureState: (feature: keyof FeatureState, isEnabled: boolean) => void;
  updateChatProvider: (providers: ChatProvider[]) => void;
  updateCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;
  
  // Token management actions
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
}

export type StoreWithDevtools = StateCreator<
  ChatState,
  [["zustand/devtools", never]],
  [],
  FeatureActions
>;

// Helper function to convert between KnownFeatureFlag and ChatFeatureKey
export function convertFeatureKeyToChatFeature(key: FeatureKey): keyof FeatureState | null {
  // If it's already a ChatFeatureKey, return it directly
  if (typeof key === 'string' && 
      ['voice', 'rag', 'modeSwitch', 'notifications', 'github',
       'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'].includes(key)) {
    return key as keyof FeatureState;
  }
  
  // Handle KnownFeatureFlag values
  switch (key) {
    case KnownFeatureFlag.VOICE:
      return 'voice';
    case KnownFeatureFlag.RAG:
      return 'rag';
    case KnownFeatureFlag.MODE_SWITCH:
      return 'modeSwitch';
    case KnownFeatureFlag.NOTIFICATIONS:
      return 'notifications';
    case KnownFeatureFlag.GITHUB_INTEGRATION:
      return 'github';
    case KnownFeatureFlag.CODE_ASSISTANT:
      return 'codeAssistant';
    case KnownFeatureFlag.RAG_SUPPORT:
      return 'ragSupport';
    case KnownFeatureFlag.GITHUB_SYNC:
      return 'githubSync';
    case KnownFeatureFlag.TOKEN_ENFORCEMENT:
    case KnownFeatureFlag.TOKEN_CONTROL:
      return 'tokenEnforcement';
    default:
      return null;
  }
}
