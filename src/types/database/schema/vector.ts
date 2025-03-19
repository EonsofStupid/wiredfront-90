
import { Json } from '@/types/database/json';

/**
 * Database schema types for vector store configurations
 */
export interface DBVectorStoreConfig {
  id: string;
  user_id?: string;
  store_type: string;
  config: Json;
  is_active: boolean;
  cluster_info?: Json;
  created_at: string;
  updated_at: string;
  endpoint_url?: string;
  grpc_endpoint?: string;
  read_only_key?: string;
  environment?: string;
  index_name?: string;
}
