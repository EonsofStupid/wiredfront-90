
import { Database } from "@/integrations/supabase/types";

// Update the APIType type to include 'github'
export type APIType = 
  | Database["public"]["Enums"]["api_type"] 
  | "github"; // Add "github" explicitly as it's not in the DB enum yet

export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];

export interface APISettingsState {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  elevenLabsKey: string;
  selectedVoice: string;
  googleDriveKey: string;
  dropboxKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  githubToken: string;
  dockerToken: string;
}

export interface APIConfiguration {
  id: string;
  user_id: string | null;
  api_type: APIType;
  memorable_name?: string; // Added to match the type in apiKeyManagement/index.ts
  is_enabled: boolean;
  is_default: boolean;
  validation_status: ValidationStatusType;
  created_at?: string;
  updated_at?: string;
  feature_bindings?: string[];
  last_validated?: string;
  provider_settings?: any;
  usage_metrics?: any;
  rag_preference?: string;
  planning_mode?: string;
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
