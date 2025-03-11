
import { APIType } from './api-configuration';

export interface APIKeyConfig {
  id: string;
  user_id: string;
  api_type: APIType;
  memorable_name: string;
  secret_key_name: string;
  is_enabled: boolean;
  validation_status: 'valid' | 'invalid' | 'pending' | 'expired';
  created_at: string;
  updated_at?: string;
  last_used?: string;
  usage_metrics?: {
    total_calls?: number;
    remaining_quota?: number | null;
    last_reset?: string;
    rate_limit_reached?: boolean;
  };
  feature_bindings?: string[];
  rag_preference?: 'supabase' | 'pinecone';
  planning_mode?: 'basic' | 'detailed' | 'architectural';
}

export interface APIKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyAdded: () => void;
}

export interface APIKeyCardProps {
  apiKey: APIKeyConfig;
  onDelete: () => void;
}
