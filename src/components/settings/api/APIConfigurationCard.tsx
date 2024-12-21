import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { APIConfigurationCardProps } from "@/types/settings/api-configuration";

export function APIConfigurationCard({ config, api, onConfigurationChange, onSetDefault }: APIConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{api.label}</CardTitle>
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
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">API Key configured</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(config.id)}
              disabled={config.is_default}
            >
              {config.is_default ? 'Default API' : 'Set as Default'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}