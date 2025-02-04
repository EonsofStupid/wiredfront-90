import { APIType, ValidationStatusType } from "./api";

export interface APIConfiguration {
  id: string;
  user_id: string | null;
  api_type: APIType;
  is_enabled: boolean | null;
  is_default: boolean | null;
  priority: number | null;
  assistant_id: string | null;
  assistant_name: string | null;
  last_validated: string | null;
  model_preferences: any;
  provider_settings: any;
  training_enabled: boolean | null;
  validation_status: ValidationStatusType | null;
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
  onSaveConfig: (type: APIType) => void;
}