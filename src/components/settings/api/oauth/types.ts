import { OAuthConnection } from "@/types/settings/api-configuration";

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

export interface ConnectionActionProps {
  onConnect: () => Promise<void>;
  onDisconnect: (connectionId: string) => Promise<void>;
  onToggleDefault: (connectionId: string, isDefault: boolean) => Promise<void>;
}