
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIConfiguration } from "../../../types/providers/ai";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface AIProviderCardProps {
  configuration: AIConfiguration;
}

export function AIProviderCard({ configuration }: AIProviderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {configuration.memorable_name}
        </CardTitle>
        <Switch 
          checked={configuration.is_enabled}
          aria-label="Toggle configuration"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={configuration.validation_status === 'valid' ? 'success' : 'destructive'}>
              {configuration.validation_status}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>

        {configuration.provider_settings.model_preferences && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default Model</p>
            <p className="text-sm">
              {configuration.provider_settings.model_preferences.default_model}
            </p>
          </div>
        )}

        {configuration.provider_settings.assistant_name && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Assistant Name</p>
            <p className="text-sm">{configuration.provider_settings.assistant_name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
