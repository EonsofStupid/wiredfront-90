
/**
 * Chat-specific feature keys
 */
export type ChatFeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'codeAssistant'
  | 'ragSupport'
  | 'knowledgeBase'
  | 'standardChat'
  | 'imageGeneration'
  | 'training'
  | 'multiFile';

/**
 * Chat feature store state
 */
export interface ChatFeatureState {
  features: Record<ChatFeatureKey, boolean>;
  config: Record<string, any>;
  isInitialized: boolean;
}

/**
 * Chat feature actions
 */
export interface ChatFeatureActions {
  toggleFeature: (key: ChatFeatureKey) => void;
  enableFeature: (key: ChatFeatureKey) => void;
  disableFeature: (key: ChatFeatureKey) => void;
  setFeatureState: (key: ChatFeatureKey, enabled: boolean) => void;
  setFeatureConfig: (key: ChatFeatureKey, config: any) => void;
  resetFeatures: () => void;
  initialize: () => Promise<void>;
}

/**
 * Complete chat feature store
 */
export type ChatFeatureStore = ChatFeatureState & ChatFeatureActions;
