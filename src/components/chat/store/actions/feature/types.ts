
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { ChatState } from '../../types/chat-store-types';
import { Provider } from '@/components/chat/types/provider-types';

// Zustand setState and getState types
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: any
) => void;

export type GetState<T> = () => T;

// Feature key type
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'knowledgeBase'
  | 'tokenEnforcement'
  | 'training';

// Feature toggle actions interface
export interface FeatureToggleActions {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, enabled: boolean) => void;
}

// Provider actions interface
export interface ProviderActions {
  updateProviders: (providers: Provider[]) => void;
  updateChatProvider: (provider: Provider | null) => void;
}

// Position actions interface
export interface PositionActions {
  togglePosition: () => void;
  setPosition: (position: ChatPosition) => void;
}

// Mode actions interface
export interface ModeActions {
  toggleMode: () => void;
  setMode: (mode: string | ChatMode) => void;
}

// Feature actions interface
export interface FeatureActions extends FeatureToggleActions, ProviderActions, PositionActions, ModeActions {
  setModel: (model: string) => void;
  toggleDocked: () => void;
  setDocked: (docked: boolean) => void;
  setTokenBalance: (balance: number) => void;
}
