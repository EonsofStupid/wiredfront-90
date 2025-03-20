
import { VectorConfiguration, VectorStoreType } from '@/types/domain/vector/types';
import { useVectorStore } from './store';

/**
 * Determines if a vector configuration is properly configured for use
 */
export function isConfigurationValid(config: VectorConfiguration): boolean {
  switch (config.storeType) {
    case 'pinecone':
      return !!config.config.apiKey && !!config.config.environment;
    case 'weaviate':
      return !!config.config.endpoint && (!!config.config.apiKey || !!config.config.adminKey);
    case 'qdrant':
      return !!config.config.endpoint;
    case 'supabase':
      return true; // Supabase config is already valid if we're using the app
    default:
      return false;
  }
}

/**
 * Returns supported vector store types
 */
export function getSupportedVectorStores(): VectorStoreType[] {
  return ['pinecone', 'weaviate', 'qdrant', 'supabase'];
}

/**
 * Finds the default (active) vector configuration
 */
export function getDefaultConfiguration(): VectorConfiguration | null {
  const configurations = useVectorStore.getState().configurations;
  return configurations.find(config => config.isActive) || configurations[0] || null;
}
