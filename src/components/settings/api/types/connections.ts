import { Json } from "@/integrations/supabase/types";

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

export interface ConnectionButtonProps {
  isConnecting: boolean;
  onConnect: () => Promise<void>;
}

export interface ConnectionCardProps {
  connection: OAuthConnection;
  onToggleDefault: (connectionId: string, isDefault: boolean) => void;
  onDelete: (connectionId: string) => void;
}

export interface ConnectionListProps {
  connections: OAuthConnection[] | undefined;
  isLoading: boolean;
  onToggleDefault: (connectionId: string, isDefault: boolean) => void;
  onDelete: (connectionId: string) => void;
}

export interface ConnectionActionsResult {
  onConnect: () => Promise<void>;
  onDisconnect: (connectionId: string) => Promise<void>;
  onToggleDefault: (connectionId: string, isDefault: boolean) => Promise<void>;
  isConnecting: boolean;
}