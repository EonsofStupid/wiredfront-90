
import { ServiceProviderConfig } from "../types/service-config.types";
import { APIType } from "../types/api-config.types";

const AI_PROVIDERS: ServiceProviderConfig[] = [
  {
    type: 'openai',
    label: 'OpenAI',
    description: 'GPT models for advanced language tasks',
    category: 'ai',
    docsUrl: 'https://platform.openai.com/docs',
    metadata: {
      costPerRequest: 0.002,
      rateLimit: 3000,
    }
  },
  {
    type: 'anthropic',
    label: 'Anthropic',
    description: 'Claude models for reasoning and analysis',
    category: 'ai',
    docsUrl: 'https://docs.anthropic.com',
    metadata: {
      costPerRequest: 0.003,
      rateLimit: 2000,
    }
  },
  // Add other AI providers
];

const VECTOR_PROVIDERS: ServiceProviderConfig[] = [
  {
    type: 'pinecone',
    label: 'Pinecone',
    description: 'Vector database for embeddings and similarity search',
    category: 'vector',
    docsUrl: 'https://docs.pinecone.io',
    configurationOptions: {
      requiresEndpoint: true,
      supportsNamespaces: true,
    }
  },
  // Add other vector store providers
];

export function getProvidersByType(type: 'ai' | 'vector' | 'voice' | 'storage' | 'development'): ServiceProviderConfig[] {
  switch (type) {
    case 'ai':
      return AI_PROVIDERS;
    case 'vector':
      return VECTOR_PROVIDERS;
    // Add other provider types
    default:
      return [];
  }
}

export function getProviderConfig(type: APIType): ServiceProviderConfig | undefined {
  return [...AI_PROVIDERS, ...VECTOR_PROVIDERS].find(provider => provider.type === type);
}
