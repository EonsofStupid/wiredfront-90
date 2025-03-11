
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Star, Trash2 } from "lucide-react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";

interface KeyActionsProps {
  config: APIConfiguration;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  updatingStatus: boolean;
  handleToggleEnabled: () => Promise<void>;
  handleSetDefault: () => Promise<void>;
}

export function KeyActions({
  config,
  isSuperAdmin,
  isAdmin,
  onValidate,
  onDelete,
  updatingStatus,
  handleToggleEnabled,
  handleSetDefault
}: KeyActionsProps) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center mr-2">
        <Switch
          id={`enable-${config.id}`}
          checked={config.is_enabled}
          onCheckedChange={handleToggleEnabled}
          disabled={updatingStatus || (!isSuperAdmin && !isAdmin)}
          className="mr-2"
        />
        <span className="text-sm">{config.is_enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onValidate(config.id)}
        className="h-8 border-gray-700 hover:bg-slate-800"
        disabled={updatingStatus || !isSuperAdmin}
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        Validate
      </Button>
      
      {!config.is_default && isSuperAdmin && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSetDefault}
          className="h-8 border-gray-700 hover:bg-slate-800"
          disabled={updatingStatus}
        >
          <Star className="h-3.5 w-3.5 mr-1" />
          Set Default
        </Button>
      )}
      
      {isSuperAdmin && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(config.id)}
          className="h-8"
          disabled={updatingStatus}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
