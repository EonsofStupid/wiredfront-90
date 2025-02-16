
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VectorConfiguration } from "../../../types/providers/vector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface VectorStoreCardProps {
  configuration: VectorConfiguration;
}

export function VectorStoreCard({ configuration }: VectorStoreCardProps) {
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

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Index Name</p>
          <p className="text-sm">{configuration.provider_settings.index_name}</p>
        </div>

        {configuration.provider_settings.environment && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Environment</p>
            <p className="text-sm">{configuration.provider_settings.environment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
