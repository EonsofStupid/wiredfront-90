
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";

interface APIKeyCardContentProps {
  config: APIConfiguration;
}

export function APIKeyCardContent({ config }: APIKeyCardContentProps) {
  return (
    <CardContent>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium mb-1">Features</div>
          <div className="flex flex-wrap gap-1">
            {config.feature_bindings && config.feature_bindings.length > 0 ? (
              config.feature_bindings.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="capitalize">
                  {feature.replace('_', ' ')}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No features assigned</span>
            )}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Settings</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">RAG:</span>
              <Badge variant="secondary" className="capitalize">
                {config.rag_preference || 'supabase'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Planning:</span>
              <Badge variant="secondary" className="capitalize">
                {config.planning_mode || 'basic'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {config.usage_metrics && <APIKeyCardMetrics metrics={config.usage_metrics} />}
    </CardContent>
  );
}

interface APIKeyCardMetricsProps {
  metrics: {
    total_calls?: number;
    monthly_usage?: number;
    remaining_quota?: number | string;
  };
}

function APIKeyCardMetrics({ metrics }: APIKeyCardMetricsProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="font-medium mb-2">Usage Metrics</div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="flex flex-col p-2 bg-muted/30 rounded-md">
          <span className="text-muted-foreground">Total Calls</span>
          <span className="font-medium text-sm">{metrics.total_calls || 0}</span>
        </div>
        <div className="flex flex-col p-2 bg-muted/30 rounded-md">
          <span className="text-muted-foreground">Monthly Usage</span>
          <span className="font-medium text-sm">{metrics.monthly_usage || 0}</span>
        </div>
        <div className="flex flex-col p-2 bg-muted/30 rounded-md">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium text-sm">{metrics.remaining_quota || 'Unlimited'}</span>
        </div>
      </div>
    </div>
  );
}
