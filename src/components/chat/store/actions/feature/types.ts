
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider } from "../../types/chat-store-types";
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { KnownFeatureFlag } from '@/types/admin/settings/feature-flags';

// Export KnownFeatureFlag as FeatureKey for usage throughout the application
export type FeatureKey = keyof ChatState['features'] | KnownFeatureFlag;

// Define proper Zustand types for state management
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;

export interface FeatureActions {
  toggleFeature: (feature: keyof ChatState['features']) => void;
  enableFeature: (feature: keyof ChatState['features']) => void;
  disableFeature: (feature: keyof ChatState['features']) => void;
  setFeatureState: (feature: keyof ChatState['features'], isEnabled: boolean) => void;
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
