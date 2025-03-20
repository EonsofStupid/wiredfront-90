
/**
 * Core domain types for vector database configurations
 */

// Branded type for vector config ID
export type VectorConfigId = string & { readonly _brand: unique symbol };

/**
 * Helper to create a vector configuration ID
 */
export function createVectorConfigId(): VectorConfigId {
  return crypto.randomUUID() as VectorConfigId;
}

/**
 * Available vector store types
 */
export type VectorStoreType = 'pinecone' | 'weaviate' | 'qdrant' | 'chroma' | 'milvus' | 'redis' | 'supabase';

/**
 * Cluster information for vector databases
 */
export interface ClusterInfo {
  region?: string;
  instanceType?: string;
  status?: string;
  nodes?: number;
  [key: string]: any;
}

/**
 * Base configuration for vector databases
 */
export interface VectorConfig {
  apiKey?: string;
  environment?: string;
  indexName?: string;
  projectId?: string;
  namespace?: string;
  dimension?: number;
  metric?: 'cosine' | 'euclidean' | 'dot';
  additionalConfig?: Record<string, any>;
}

/**
 * Complete vector database configuration
 */
export interface VectorConfiguration {
  id: VectorConfigId;
  name: string;
  description?: string;
  userId?: string;
  storeType: VectorStoreType;
  config: VectorConfig;
  isActive: boolean;
  clusterInfo?: ClusterInfo;
  createdAt: string | Date;
  updatedAt: string | Date;
  endpointUrl?: string;
  grpcEndpoint?: string;
  readOnlyKey?: string;
}

/**
 * Vector database statistics
 */
export interface VectorDBStats {
  totalVectors: number;
  usedStorage: number;
  lastIndexed: string | null;
}

/**
 * Vector search query parameters
 */
export interface SearchQuery {
  text: string;
  projectId?: string;
  limit?: number;
  filters?: Record<string, any>;
}

/**
 * Vector search result
 */
export interface SearchResult {
  content: string;
  metadata: any;
  score: number;
  source: string;
}

/**
 * Vector usage limits status
 */
export interface VectorLimitStatus {
  atLimit: boolean;
  usagePercentage: number;
  vectorCount: number;
  maxVectors: number;
}
