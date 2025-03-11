
import { Database } from "@/integrations/supabase/types";

// Update the APIType to include 'github'
export type APIType = 
  | Database["public"]["Enums"]["api_type"] 
  | "github"; // Add "github" explicitly as it's not in the DB enum yet

export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];

export interface APIConfigurationItem {
  type: APIType;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface ServiceCardProps {
  type: APIType;
  title: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
  onSaveConfig: (type: APIType, config: { name: string; key: string; environment?: string; index_name?: string; }) => Promise<void>;
  isConnecting: boolean;
  selectedConfig: string | null;
  newConfig: {
    name: string;
    key: string;
    environment?: string;
    index_name?: string;
  };
  onConfigChange: (type: APIType, field: string, value: string) => void;
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

export interface APIConfigurationListProps {
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
