export interface OAuthConnection {
  id: string;
  provider: string;
  account_username: string;
  account_type?: string;
  is_default: boolean;
  scopes: string[];
  last_used?: string;
}

export interface APIConfigurationItem {
  type: string;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
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
    [key: string]: any;
  };
}