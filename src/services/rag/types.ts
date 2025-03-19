
import { 
  VectorDBStats,
  SearchQuery, 
  SearchResult, 
  VectorLimitStatus 
} from '@/types/domain/vector';

// Re-export types from domain
export {
  VectorDBStats,
  SearchQuery,
  SearchResult,
  VectorLimitStatus
};

export interface VectorDBConfig {
  projectId?: string;
  dbType?: 'supabase' | 'pinecone';
}

// RAG Tier type
export type RAGTier = 'standard' | 'premium';
