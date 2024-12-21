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