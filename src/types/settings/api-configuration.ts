export interface OAuthConnection {
  id: string;
  user_id: string;
  provider: string;
  account_username: string;
  account_type?: string;
  is_default: boolean;
  scopes: string[];
  last_used?: string;
  created_at?: string;
  updated_at?: string;
}

export interface APIConfigurationItem {
  type: string;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface APIConfigurationProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: string) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfigurationCardProps {
  config: APIConfiguration;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: string) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfiguration {
  id: string;
  api_type: string;
  is_enabled: boolean;
  is_default: boolean;
}