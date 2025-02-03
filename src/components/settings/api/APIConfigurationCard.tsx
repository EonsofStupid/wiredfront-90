import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { APIConfigurationCardProps } from "@/types/settings/api-configuration";
import { ValidationStatusType } from "@/types/store/settings/api-config";

const getValidationStatusIcon = (status: ValidationStatusType) => {
  switch (status) {
    case 'valid':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'invalid':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'expired':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'rate_limited':
      return <Clock className="h-4 w-4 text-orange-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'pending':
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export function APIConfigurationCard({ 
  config, 
  api, 
  onConfigurationChange, 
  onSetDefault,
  onDelete 
}: APIConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{api.label}</CardTitle>
            {config?.validation_status && (
              <Badge 
                variant={config.validation_status === 'valid' ? 'success' : 'secondary'} 
                className="ml-2"
              >
                {getValidationStatusIcon(config.validation_status as ValidationStatusType)}
                <span className="ml-1 capitalize">{config.validation_status}</span>
              </Badge>
            )}
          </div>
          <Switch
            checked={config?.is_enabled ?? false}
            onCheckedChange={(checked) => {
              onConfigurationChange(checked, config, api.type);
            }}
          />
        </div>
        <CardDescription>{api.description}</CardDescription>
      </CardHeader>
      {config?.is_enabled && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">API Key configured</span>
            </div>
            {config.assistant_name && (
              <div className="text-sm">
                <span className="font-medium">Assistant:</span> {config.assistant_name}
              </div>
            )}
            {config.training_enabled && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                Training Enabled
              </Badge>
            )}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(config.id)}
                disabled={config.is_default}
              >
                {config.is_default ? 'Default API' : 'Set as Default'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(config.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}