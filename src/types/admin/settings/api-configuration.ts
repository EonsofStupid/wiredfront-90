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

export interface ServiceCardProps {
  type: string;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
  onSaveConfig: (type: string) => void;
}

export interface APIConfiguration {
  id: string;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  validation_status?: ValidationStatusType;
  assistant_name?: string;
  training_enabled?: boolean;
}

export interface APIConfigurationProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfigurationCardProps {
  config: APIConfiguration | undefined;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}