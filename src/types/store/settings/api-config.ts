export type VectorStoreType = 'pinecone' | 'weaviate';

export interface VectorStoreConfig {
  id: string;
  user_id?: string;
  store_type: VectorStoreType;
  config: {
    endpoint_url?: string;
    grpc_endpoint?: string;
    admin_key?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
    cluster_info?: {
      version?: string;
      region?: string;
      type?: string;
      sla?: string;
      highAvailability?: boolean;
    };
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}