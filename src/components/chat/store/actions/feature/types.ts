
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider, FeatureState } from "../../types/chat-store-types";
import { TokenEnforcementMode, KnownFeatureFlag, ChatFeatureKey } from '@/integrations/supabase/types/enums';

// Export feature key types for usage throughout the application
export type FeatureKey = ChatFeatureKey | KnownFeatureFlag | keyof FeatureState;

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

// Enhanced helper function to convert between KnownFeatureFlag and ChatFeatureKey
export function convertFeatureKeyToChatFeature(key: FeatureKey): keyof FeatureState | null {
  // If it's already a keyof FeatureState, return it directly
  if (typeof key === 'string' && 
      ['voice', 'rag', 'modeSwitch', 'notifications', 'github',
       'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'].includes(key)) {
    return key as keyof FeatureState;
  }
  
  // Handle KnownFeatureFlag values
  switch (key) {
    case 'voice_input':
      return 'voice';
    case 'rag_support':
      return 'rag';
    case 'mode_switch':
      return 'modeSwitch';
    case 'notifications':
      return 'notifications';
    case 'github_integration':
      return 'github';
    case 'code_assistant':
      return 'codeAssistant';
    case 'github_sync':
      return 'githubSync';
    case 'token_enforcement':
    case 'token_control':
      return 'tokenEnforcement';
    default:
      return null;
  }
}
