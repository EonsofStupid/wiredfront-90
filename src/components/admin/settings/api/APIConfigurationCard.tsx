
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle, XCircle, Clock, Trash2, Settings2 } from "lucide-react";
import { APIConfigurationCardProps, ValidationStatusType, APIType } from "@/types/admin/settings/api-configuration";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  onDelete,
  isSuperAdmin
}: APIConfigurationCardProps & { isSuperAdmin: boolean }) {
  const [memorableName, setMemorableName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveConfiguration = async () => {
    if (!memorableName || !apiKey) {
      toast.error("Please provide both a memorable name and API key");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          secretName: `${api.type.toUpperCase()}_${memorableName.toUpperCase()}`,
          secretValue: apiKey,
          provider: api.type,
          memorableName,
          action: 'create'
        }
      });

      if (error) throw error;

      toast.success(data.message || 'API configuration saved successfully');
      setMemorableName("");
      setApiKey("");
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden",
      "transition-all duration-300",
      "hover:shadow-lg hover:scale-[1.02]",
      "bg-background/80 backdrop-blur-sm"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{api.label}</CardTitle>
            {config?.validation_status && (
              <Badge 
                variant={config.validation_status === 'valid' ? 'success' : 'secondary'} 
                className="ml-2"
              >
                {getValidationStatusIcon(config.validation_status)}
                <span className="ml-1 capitalize">{config.validation_status}</span>
              </Badge>
            )}
          </div>
          {config && (
            <Switch
              checked={config.is_enabled ?? false}
              onCheckedChange={(checked) => {
                onConfigurationChange(checked, config, api.type as APIType);
              }}
              disabled={!isSuperAdmin}
            />
          )}
        </div>
        <CardDescription>{api.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {config ? (
            <>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Configured as: {config.memorable_name}
                </span>
              </div>
              {config.provider_settings && (
                <div className="text-sm space-y-1">
                  <p>Last validated: {new Date(config.provider_settings.last_validated).toLocaleString()}</p>
                  {config.provider_settings.usage_count && (
                    <p>Usage count: {config.provider_settings.usage_count}</p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                {!config.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault(config.id)}
                    disabled={!isSuperAdmin}
                  >
                    Set as Default
                  </Button>
                )}
                {isSuperAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(config.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : isSuperAdmin ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memorable-name">Memorable Name</Label>
                <Input
                  id="memorable-name"
                  value={memorableName}
                  onChange={(e) => setMemorableName(e.target.value)}
                  placeholder="e.g., production-v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={api.placeholder}
                />
              </div>
              <Button
                onClick={handleSaveConfiguration}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No configuration available. Contact a super admin to set up this integration.
            </p>
          )}
          <div className="text-sm text-muted-foreground mt-4">
            <a
              href={api.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {api.docsText}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
