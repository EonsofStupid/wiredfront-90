
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

// Type guard to check if a key is a valid FeatureState key
export function isFeatureStateKey(key: FeatureKey): key is keyof FeatureState {
  const validKeys: (keyof FeatureState)[] = [
    'voice',
    'rag',
    'modeSwitch',
    'notifications',
    'github',
    'codeAssistant',
    'ragSupport',
    'githubSync',
    'tokenEnforcement'
  ];
  return validKeys.includes(key as keyof FeatureState);
}

// Helper function to convert string feature keys
function convertStringFeatureKey(key: string): keyof FeatureState | null {
  // Add your string to feature key mapping logic here
  const featureKeyMap: Record<string, keyof FeatureState> = {
    'code_assistant': 'codeAssistant',
    'rag_support': 'ragSupport',
    'github_sync': 'githubSync',
    'notifications': 'notifications',
    // Add more mappings as needed
  };
  
  return featureKeyMap[key] || null;
}

/**
 * Converts a feature key to a chat feature key with proper type narrowing and null handling
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
  if (typeof key === 'object' && 'toString' in key) {
    const keyString = key.toString();
    // Continue with the string-based key conversion
    return convertStringFeatureKey(keyString);
  }
  
  // Handle string enum values - null safety added here
  if (typeof key === 'string') {
    return convertStringFeatureKey(key);
  }
  
  // Default case - return null for unhandled types
  return null;
}
