
import { Database } from "@/integrations/supabase/types";

export type APIType = Database["public"]["Enums"]["api_type"];
export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];

export interface APIConfiguration {
  id: string;
  user_id: string | null;
  api_type: APIType;
  memorable_name: string;
  secret_key_name: string;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: ValidationStatusType;
  provider_settings: {
    endpoint_url?: string;
    grpc_endpoint?: string;
    cluster_info?: Record<string, any>;
    usage_metrics?: {
      total_requests: number;
      total_cost: number;
      last_used: string;
    };
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}
