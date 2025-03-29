
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Provider } from '@/components/chat/types/provider-types';

// Zustand setState and getState types
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export type GetState<T> = () => T;

// Feature key type from chat feature-types
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
  | 'standardChat'
  | 'imageGeneration'
  | 'training'
  | 'darkMode'
  | 'multiFile';

// Feature toggle actions interface
export interface FeatureToggleActions {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, enabled: boolean) => void;
}

// Provider actions interface
export interface ProviderActions {
  updateChatProvider: (provider: Provider | null) => void;
  updateAvailableProviders: (providers: Provider[]) => void;
}

// Position actions interface
export interface PositionActions {
  togglePosition: () => void;
  setPosition: (position: ChatPosition) => void;
}

// Mode actions interface
export interface ModeActions {
  setMode: (mode: string | ChatMode) => void;
}

// Feature actions interface
export interface FeatureActions extends FeatureToggleActions, ProviderActions, PositionActions, ModeActions {
  setModel: (model: string) => void;
  toggleDocked: () => void;
  setChatId: (id: string | null) => void;
}
