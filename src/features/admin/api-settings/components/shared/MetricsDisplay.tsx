
import { APIConfiguration } from "../../types/api-config.types";

interface MetricsDisplayProps {
  configuration: APIConfiguration;
}

export function MetricsDisplay({ configuration }: MetricsDisplayProps) {
  const metrics = configuration.provider_settings?.usage_metrics;

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
      <div>
        <p className="text-sm font-medium">Total Requests</p>
        <p className="text-2xl font-bold">{metrics.total_requests}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Total Cost</p>
        <p className="text-2xl font-bold">${metrics.total_cost.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Last Used</p>
        <p className="text-sm text-muted-foreground">
          {new Date(metrics.last_used).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
