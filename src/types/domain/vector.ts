
/**
 * Domain types for vector database configurations
 */

// Vector store types
export type VectorStoreType = 'pinecone' | 'weaviate' | 'qdrant' | 'chroma' | 'milvus' | 'redis' | 'supabase';

// Vector configuration ID type
export type VectorConfigId = string;

// Helper to create a vector configuration ID
export function createVectorConfigId(): VectorConfigId {
  return crypto.randomUUID();
}

// Vector database connection configuration
export interface VectorConfig {
  apiKey?: string;
  endpoint?: string;
  projectId?: string;
  environment?: string;
  namespace?: string;
  indexName?: string;
  dimension?: number;
  metric?: 'cosine' | 'euclidean' | 'dot';
  additionalConfig?: Record<string, any>;
}

// Vector database complete configuration
export interface VectorConfiguration {
  id: VectorConfigId;
  name: string;
  description?: string;
  storeType: VectorStoreType;
  config: VectorConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
