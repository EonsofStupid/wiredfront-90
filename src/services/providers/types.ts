
import { ProviderType, ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

export interface ProviderCapability {
  streaming: boolean;
  imageGeneration: boolean;
  codeCompletion: boolean;
  vectorSearch: boolean;
  promptTemplating: boolean;
}

export interface ProviderConnectionStatus {
  connected: boolean;
  lastConnected: string | null;
  error: string | null;
  rateLimited: boolean;
  rateLimitResetTime: string | null;
}

export interface ProviderApiConfig {
  apiKey?: string;
  baseUrl?: string;
  organizationId?: string;
  modelName?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ProviderModeConfig {
  [mode: string]: {
    modelName: string;
    temperature: number;
    maxTokens: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  };
}

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  category: ProviderCategoryType;
  capabilities: ProviderCapability;
  config: ProviderApiConfig;
  modeConfigs: ProviderModeConfig;
  status: ProviderConnectionStatus;
  isDefault: boolean;
  isEnabled: boolean;
}

export interface ProviderRegistryState {
  providers: Provider[];
  currentProviderId: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProviderRegistryActions {
  registerProvider: (provider: Provider) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  setCurrentProvider: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;
  verifyApiKey: (id: string) => Promise<boolean>;
  getProvidersByCategory: (category: ProviderCategoryType) => Provider[];
  getProviderById: (id: string) => Provider | null;
  getDefaultProvider: (category: ProviderCategoryType) => Provider | null;
}

export type ProviderRegistry = ProviderRegistryState & ProviderRegistryActions;
