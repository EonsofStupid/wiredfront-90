
import { BaseConfiguration, ProviderSettings } from '../common';
import { APIType } from "@/integrations/supabase/types";

export interface VectorStoreSettings extends ProviderSettings {
  index_name: string;
  environment?: string;
  dimension_size?: number;
  metric_type?: 'cosine' | 'euclidean' | 'dot';
}

export interface VectorConfiguration extends BaseConfiguration {
  api_type: Extract<APIType, 'pinecone' | 'weaviate'>;
  provider_settings: VectorStoreSettings;
}
