
import { 
  ProviderCapabilities, 
  ProviderConfig, 
  ProviderStatus, 
  ProviderUsageMetrics,
  ChatOptions,
  ImageOptions,
  DevOptions,
  VoiceOptions
} from '@/types/providers/provider-types';
import { ProviderType, ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

export interface LLMProviderInterface {
  id: string;
  name: string;
  type: ProviderType;
  category: ProviderCategoryType;
  capabilities: ProviderCapabilities;
  config: ProviderConfig;
  status: ProviderStatus;
  metrics: ProviderUsageMetrics;
  
  // Initialize and connect
  initialize: () => Promise<boolean>;
  testConnection: () => Promise<boolean>;
  
  // Core capabilities
  generateText: (prompt: string, options?: ChatOptions) => Promise<string>;
  generateImage?: (prompt: string, options?: ImageOptions) => Promise<string>;
  generateCode?: (prompt: string, options?: DevOptions) => Promise<string>;
  generateVoice?: (text: string, options?: VoiceOptions) => Promise<ArrayBuffer>;
  
  // RAG support
  enhancePrompt: (prompt: string, context?: any) => Promise<string>;
  prepareRAGContext: (documents: any[], query: string) => Promise<string>;
  
  // Analytics
  trackUsage: (operation: string, tokens: number, cost: number) => void;
}
