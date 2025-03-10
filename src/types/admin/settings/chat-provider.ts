
import { APIType } from './api-configuration';

export interface ChatProviderConfig {
  id: string;
  name: string;
  type: ChatProviderType;
  apiReference: string;
  isEnabled: boolean;
  isDefault: boolean;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export type ChatProviderType = 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama';

export interface ChatSessionConfig {
  timeout: number;
  maxHistory: number;
  cleanupInterval: number;
  maxConcurrentSessions: number;
}

export interface ChatFeatureConfig {
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  notifications: boolean;
  voiceInput: boolean;
  voiceOutput: boolean;
}

export interface ChatAppearanceConfig {
  position: 'bottom-right' | 'bottom-left';
  docked: boolean;
  theme: 'light' | 'dark' | 'system';
  scale: number;
  defaultMinimized: boolean;
}

export interface ChatAdminSettings {
  providers: ChatProviderConfig[];
  features: ChatFeatureConfig;
  appearance: ChatAppearanceConfig;
  sessions: ChatSessionConfig;
}
