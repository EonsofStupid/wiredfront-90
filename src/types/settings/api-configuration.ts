import { APIType } from "@/types/store/settings/api-config";

export interface APIConfigurationItem {
  type: APIType;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface APIConfigurationProps {
  configurations: any[];
  onConfigurationChange: (checked: boolean, config: any | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfigurationCardProps {
  config: any;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: any | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface CreateConfigurationOptions {
  name?: string;
  assistant_name?: string;
  assistant_id?: string | null;
  provider_settings?: Record<string, any>;
  is_default?: boolean;
}

export interface ServiceCardProps {
  type: APIType;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
  configurations: any[];
  newConfig: {
    name: string;
    key: string;
  };
  isConnecting: boolean;
  selectedConfig: string | null;
  onConnect: (configId: string) => void;
  onConfigChange: (type: APIType, field: string, value: string) => void;
  onSaveConfig: (type: APIType) => void;
}