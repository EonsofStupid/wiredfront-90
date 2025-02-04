import { Database } from "@/integrations/supabase/types";

export type APIType = Database["public"]["Enums"]["api_type"];
export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];

export interface APIConfigurationItem {
  type: string;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface APIConfiguration {
  id: string;
  user_id: string | null;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  validation_status: ValidationStatusType;
  created_at?: string;
  updated_at?: string;
}

export interface APIConfigurationProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface ServiceCardProps {
  type: APIType;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
  isConnecting: boolean;
  selectedConfig: string | null;
  newConfig: {
    name: string;
    key: string;
    endpoint_url?: string;
    grpc_endpoint?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
  };
  onConnect: () => void;
  onConfigChange: (type: APIType, field: string, value: string) => void;
  onSaveConfig: (type: APIType) => Promise<void>;
}