import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, XCircle, Clock, Trash2, AlertTriangle, Ban } from "lucide-react";
import { APIConfigurationCardProps } from "@/types/settings/api-configuration";
import { ValidationStatusType } from "@/types/store/settings/api-config";
import { useCallback } from "react";
import { Progress } from "@/components/ui/progress";

const getValidationStatusIcon = (status: ValidationStatusType | undefined) => {
  switch (status) {
    case 'valid':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'invalid':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'expired':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'rate_limited':
      return <Ban className="h-4 w-4 text-orange-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

export function APIConfigurationCard({ 
  config, 
  api, 
  onConfigurationChange, 
  onSetDefault,
  onDelete 
}: APIConfigurationCardProps) {
  const handleConfigChange = useCallback((checked: boolean) => {
    onConfigurationChange(checked, config, api.type);
  }, [config, api.type, onConfigurationChange]);

  const handleSetDefault = useCallback(() => {
    if (config) {
      onSetDefault(config.id);
    }
  }, [config, onSetDefault]);

  const handleDelete = useCallback(() => {
    if (config) {
      onDelete(config.id);
    }
  }, [config, onDelete]);

  const getUsagePercentage = () => {
    if (!config?.daily_request_limit) return 0;
    return (config.usage_count / config.daily_request_limit) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{api.label}</CardTitle>
            {config?.validation_status && (
              <Badge 
                variant={
                  config.validation_status === 'valid' ? 'success' : 
                  config.validation_status === 'rate_limited' ? 'warning' : 
                  'secondary'
                } 
                className="ml-2"
              >
                {getValidationStatusIcon(config.validation_status)}
                <span className="ml-1 capitalize">{config.validation_status}</span>
              </Badge>
            )}
          </div>
          <Switch
            checked={config?.is_enabled ?? false}
            onCheckedChange={handleConfigChange}
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

            {config.usage_count > 0 && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Usage:</span> {formatNumber(config.usage_count)} requests
                </div>
                {config.daily_request_limit && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Daily limit: {formatNumber(config.usage_count)}/{formatNumber(config.daily_request_limit)}
                    </div>
                    <Progress value={getUsagePercentage()} className="h-2" />
                  </div>
                )}
              </div>
            )}

            {config.last_error_message && (
              <div className="text-sm text-red-500">
                <span className="font-medium">Last Error:</span> {config.last_error_message}
              </div>
            )}

            {config.environment && config.environment !== 'production' && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {config.environment}
              </Badge>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                disabled={config.is_default}
              >
                {config.is_default ? 'Default API' : 'Set as Default'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
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