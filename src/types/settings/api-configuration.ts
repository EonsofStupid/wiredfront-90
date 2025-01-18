import { APIType, APIConfiguration } from "@/types/store/settings/api-config";

export interface APIConfigurationItem {
  type: APIType;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface APIConfigurationProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfigurationCardProps {
  config: APIConfiguration;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface CreateConfigurationOptions {
  is_default?: boolean;
  assistant_name?: string;
  assistant_id?: string;
  provider_settings?: {
    endpoint_url?: string;
    grpc_endpoint?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
    cluster_info?: Record<string, any>;
    api_key_secret?: string;
    provider?: string;
  };
  validation_status?: 'pending' | 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error';
  usage_count?: number;
  daily_request_limit?: number;
  monthly_token_limit?: number;
  cost_tracking?: {
    total_cost: number;
    last_month_cost: number;
  };
  error_count?: number;
  last_error_message?: string;
  last_successful_use?: string;
  environment?: string;
  rotation_priority?: number;
}