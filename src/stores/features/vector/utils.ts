
/**
 * Utility functions for vector store operations
 */

import { VectorConfiguration, VectorConfigId, createVectorConfigId, VectorStoreType } from '@/types/domain/vector/types';
import { NewVectorConfig } from '@/types/store/features/vector/types';
import { useVectorStore } from './store';
import { toJson } from '@/types/supabase';

/**
 * Format a new vector configuration from user input
 */
export function formatNewVectorConfig(input: NewVectorConfig): VectorConfiguration {
  return {
    id: createVectorConfigId(),
    name: input.name,
    description: input.description || '',
    storeType: input.storeType,
    config: input.config,
    isActive: input.isActive ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Add a new vector configuration
 */
export function addVectorConfiguration(input: NewVectorConfig): VectorConfigId {
  const config = formatNewVectorConfig(input);
  useVectorStore.getState().addConfiguration(config);
  return config.id;
}

/**
 * Get the proper display name for a vector store type
 */
export function getVectorStoreDisplayName(type: VectorStoreType): string {
  const displayNames: Record<VectorStoreType, string> = {
    pinecone: 'Pinecone',
    weaviate: 'Weaviate',
    qdrant: 'Qdrant',
    chroma: 'Chroma',
    milvus: 'Milvus',
    redis: 'Redis Vector DB',
    supabase: 'Supabase Vector'
  };
  
  return displayNames[type] || type;
}

/**
 * Prepare a vector configuration for storage in Supabase
 */
export function prepareVectorConfigForStorage(config: VectorConfiguration) {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    store_type: config.storeType,
    config: toJson(config.config),
    is_active: config.isActive,
    cluster_info: toJson(config.clusterInfo),
    created_at: config.createdAt,
    updated_at: new Date().toISOString(),
    endpoint_url: config.endpointUrl,
    grpc_endpoint: config.grpcEndpoint,
    read_only_key: config.readOnlyKey
  };
}
