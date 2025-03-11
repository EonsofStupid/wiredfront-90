
import { useMetrics } from "@/hooks/admin/metrics/useMetrics";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { DynamicKPICard } from "@/components/admin/metrics/DynamicKPICard";
import { StatusIndicator } from "@/components/admin/metrics/StatusIndicator";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetricsOverview() {
  const { data: metrics, isLoading } = useMetrics();

  if (isLoading) {
    return (
      <SettingsContainer title="Admin Metrics" description="Loading metrics...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer 
      title="Admin Metrics" 
      description="Real-time system metrics and performance indicators"
    >
      <div className="space-y-8">
        {/* Hero Section with KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.map((metric) => (
            <DynamicKPICard
              key={metric.id}
              title={metric.label}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              change={10}
              onClick={() => console.log(`Clicked ${metric.label}`)}
            />
          ))}
        </div>

        {/* System Status Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusIndicator status="healthy" label="API Services" />
            <StatusIndicator status="warning" label="Database" />
            <StatusIndicator status="healthy" label="Authentication" />
            <StatusIndicator status="critical" label="Storage" />
          </div>
        </Card>
      </div>
    </SettingsContainer>
  );
}
