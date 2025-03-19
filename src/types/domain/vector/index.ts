
/**
 * Domain types for vector store configurations
 */

// Branded type for vector config ID
export type VectorConfigId = string & { readonly _brand: unique symbol };

export function createVectorConfigId(id: string): VectorConfigId {
  return id as VectorConfigId;
}

export type VectorStoreType = 'supabase' | 'pinecone' | 'qdrant' | 'weaviate';

export interface ClusterInfo {
  region?: string;
  instanceType?: string;
  status?: string;
  nodes?: number;
  [key: string]: any;
}

export interface VectorConfig {
  apiKey?: string;
  environment?: string;
  indexName?: string;
  projectId?: string;
  namespace?: string;
  dimension?: number;
  [key: string]: any;
}

export interface VectorConfiguration {
  id: VectorConfigId;
  userId?: string;
  storeType: VectorStoreType;
  config: VectorConfig;
  isActive: boolean;
  clusterInfo?: ClusterInfo;
  createdAt: Date;
  updatedAt: Date;
  endpointUrl?: string;
  grpcEndpoint?: string;
  readOnlyKey?: string;
  environment?: string;
  indexName?: string;
}

export interface VectorDBStats {
  totalVectors: number;
  usedStorage: number;
  lastIndexed: string | null;
}

export interface SearchQuery {
  text: string;
  projectId?: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  content: string;
  metadata: any;
  score: number;
  source: string;
}

export interface VectorLimitStatus {
  atLimit: boolean;
  usagePercentage: number;
  vectorCount: number;
  maxVectors: number;
}
