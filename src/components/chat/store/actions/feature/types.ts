
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider, FeatureState } from "../../types/chat-store-types";
import { TokenEnforcementMode, KnownFeatureFlag, ChatFeatureKey } from '@/integrations/supabase/types/enums';

// Define feature key type based on valid enum types only (removing string)
export type FeatureKey = KnownFeatureFlag | ChatFeatureKey | keyof FeatureState;

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

/**
 * Type guard to check if a value is a valid keyof FeatureState
 */
export function isFeatureStateKey(key: any): key is keyof FeatureState {
  return typeof key === 'string' && 
      ['voice', 'rag', 'modeSwitch', 'notifications', 'github',
       'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'].includes(key);
}

/**
 * Enhanced helper function to convert between KnownFeatureFlag and ChatFeatureKey
 * with proper type narrowing and null handling
 */
export function convertFeatureKeyToChatFeature(key: FeatureKey | null | undefined): keyof FeatureState | null {
  // Guard against null or undefined
  if (key === null || key === undefined) {
    return null;
  }
  
  // If it's already a keyof FeatureState, return it directly
  if (isFeatureStateKey(key)) {
    return key;
  }
  
  // If it's an enum value, convert it properly with type safety
  if (typeof key === 'object' && key !== null && 'toString' in key) {
    const keyString = key.toString();
    // Continue with the string-based key
    return convertStringFeatureKey(keyString);
  }
  
  // Handle string enum values
  if (typeof key === 'string') {
    return convertStringFeatureKey(key);
  }
  
  // Default case - return null for unhandled types
  return null;
}

/**
 * Helper function to convert string-based keys to feature state keys
 */
function convertStringFeatureKey(key: string): keyof FeatureState | null {
  // Handle KnownFeatureFlag values with better string conversion
  switch (key) {
    case 'voice_input':
    case 'VOICE':
      return 'voice';
    case 'rag_support':
    case 'RAG':
      return 'rag';
    case 'mode_switch':
    case 'MODE_SWITCH':
      return 'modeSwitch';
    case 'notifications':
    case 'NOTIFICATIONS':
      return 'notifications';
    case 'github_integration':
    case 'GITHUB_INTEGRATION':
      return 'github';
    case 'code_assistant':
    case 'CODE_ASSISTANT':
      return 'codeAssistant';
    case 'github_sync':
    case 'GITHUB_SYNC':
      return 'githubSync';
    case 'token_enforcement':
    case 'token_control':
    case 'TOKEN_ENFORCEMENT':
    case 'TOKEN_CONTROL':
      return 'tokenEnforcement';
    default:
      // Handle snake_case to camelCase conversion for any remaining keys
      if (key.includes('_')) {
        const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        if (isFeatureStateKey(camelKey)) {
          return camelKey;
        }
      }
      return null;
  }
}
