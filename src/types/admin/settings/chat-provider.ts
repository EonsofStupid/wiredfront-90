
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
  category?: 'chat' | 'image' | 'integration';
}

export type ChatProviderType = 'openai' | 'anthropic' | 'gemini' | 'local' | 'perplexity' | 'llama' | 
  'dalle' | 'midjourney' | 'stability' | 'dreamstudio' | 'deepai' | 'artbreeder' | 
  'zapier' | 'bubble' | 'openrouter' | 'replit';

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
  imageGeneration: boolean;
  integrations: boolean;
}

export interface ChatAppearanceConfig {
  position: 'bottom-right' | 'bottom-left';
  docked: boolean;
  theme: 'light' | 'dark' | 'system';
  scale: number;
  defaultMinimized: boolean;
}

export interface GitHubIntegrationConfig {
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number;
  repositories: string[];
  preferredAccount?: string;
  defaultBranch?: string;
}

export interface ChatAdminSettings {
  providers: ChatProviderConfig[];
  features: ChatFeatureConfig;
  appearance: ChatAppearanceConfig;
  sessions: ChatSessionConfig;
  githubIntegration?: GitHubIntegrationConfig;
}
