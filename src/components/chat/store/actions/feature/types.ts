
import { StateCreator } from 'zustand';
import { ChatState, ProviderCategory, FeatureState } from "../../types/chat-store-types";
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

// Define feature key type based on valid enum types only (removing string)
export type FeatureKey = string | keyof FeatureState;

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
  updateChatProvider: (providers: ProviderCategory[]) => void;
  updateCurrentProvider: (provider: ProviderCategory) => void;
  updateAvailableProviders: (providers: ProviderCategory[]) => void;
  
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
  
  // Handle string mappings safely
  if (typeof key === 'string') {
    return mapStringToFeatureKey(key);
  }
  
  // Default case - return null for unhandled types
  return null;
}

// Type guard to check if a key is a valid FeatureState key
export function isFeatureStateKey(key: any): key is keyof FeatureState {
  if (key === null || key === undefined) {
    return false;
  }

  const validKeys: (keyof FeatureState)[] = [
    'voice',
    'rag',
    'modeSwitch',
    'notifications',
    'github',
    'codeAssistant',
    'ragSupport',
    'githubSync',
    'tokenEnforcement',
    'startMinimized',
    'showTimestamps',
    'saveHistory'
  ];
  
  return validKeys.includes(key as keyof FeatureState);
}

// Helper function to convert string feature keys
function mapStringToFeatureKey(key: string): keyof FeatureState | null {
  const featureKeyMap: Record<string, keyof FeatureState> = {
    'code_assistant': 'codeAssistant',
    'rag_support': 'ragSupport',
    'github_sync': 'githubSync',
    'notifications': 'notifications',
    'voice': 'voice',
    'rag': 'rag',
    'mode_switch': 'modeSwitch',
    'github': 'github',
    'token_enforcement': 'tokenEnforcement',
    'start_minimized': 'startMinimized',
    'show_timestamps': 'showTimestamps',
    'save_history': 'saveHistory'
  };
  
  return featureKeyMap[key] || null;
}
