
export interface ProjectVector {
  id: string;
  project_id: string;
  vector_data: any;
  embedding: number[];
  created_at: string;
  updated_at: string;
  // Relations
  project?: {
    name: string;
    user_id: string;
  };
}

export interface VectorIndexingStats {
  total_vectors: number;
  indexed_projects: number;
  average_query_time: string;
  last_reindex: string;
}
