
import { EnumUtils } from '@/lib/enums';

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

export interface VectorDBConfig {
  projectId?: string;
  dbType?: 'supabase' | 'pinecone';
}

export interface VectorLimitStatus {
  atLimit: boolean;
  usagePercentage: number;
  vectorCount: number;
  maxVectors: number;
}

// Add the RAGTier type that was previously in RAGService.ts
export type RAGTier = 'standard' | 'premium';
