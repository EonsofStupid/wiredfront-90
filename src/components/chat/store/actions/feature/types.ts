
import { Provider } from '../../types/chat-store-types';

// Define the allowed feature keys
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

// Provider types
export interface ProviderConfig {
  id: string;
  name: string;
  description?: string;
  category: 'chat' | 'image' | 'audio' | 'code';
  isEnabled: boolean;
  maxTokens?: number;
  contextSize?: number;
}

// Action parameters
export interface FeatureActionParams {
  featureKey: FeatureKey;
  value?: boolean;
}

export interface ProviderActionParams {
  providers: Provider[];
  currentProviderId?: string;
}
