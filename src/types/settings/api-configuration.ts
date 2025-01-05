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
}

export interface APIConfigurationCardProps {
  config: any;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: any | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
}

export interface CreateConfigurationOptions {
  assistant_name?: string;
  assistant_id?: string | null;
  provider_settings?: Record<string, any>;
  is_default?: boolean;
}