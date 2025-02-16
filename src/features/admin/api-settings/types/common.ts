
import { APIType, ValidationStatusType } from '@/integrations/supabase/types';

export interface BaseConfiguration {
  id: string;
  user_id: string | null;
  memorable_name: string;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: ValidationStatusType;
  created_at?: string;
  updated_at?: string;
}

export interface MetricsData {
  total_requests: number;
  total_cost: number;
  last_used: string;
  error_rate?: number;
  average_latency?: number;
}

export interface ProviderSettings {
  endpoint_url?: string;
  grpc_endpoint?: string;
  cluster_info?: Record<string, any>;
  usage_metrics?: MetricsData;
  [key: string]: any;
}

export type ProviderCategory = 'ai' | 'vector' | 'voice';
