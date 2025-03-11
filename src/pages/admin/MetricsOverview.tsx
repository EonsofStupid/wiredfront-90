
import { useMetrics } from "@/hooks/admin/metrics/useMetrics";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { DynamicKPICard } from "@/components/admin/metrics/DynamicKPICard";
import { StatusIndicator } from "@/components/admin/metrics/StatusIndicator";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function MetricsOverview() {
  const { data: metrics, isLoading, refetch } = useMetrics();

  // Subscribe to real-time updates for metrics_logs
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'metrics_logs'
        },
        () => {
          refetch();
        }
      )
      .subscribe();   

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Call the sample data function on first load if we have no metrics
  useEffect(() => {
    const initializeSampleData = async () => {
      if (!isLoading && (!metrics || metrics.length === 0)) {
        try {
          const { error } = await supabase.rpc('populate_sample_metrics_data');
          if (error) throw error;
          toast.success("Sample data initialized");
          refetch();
        } catch (error) {
          console.error("Error initializing sample data:", error);
          toast.error("Failed to initialize sample data");
        }
      }
    };

    initializeSampleData();
  }, [isLoading, metrics, refetch]);

  if (isLoading) {
    return (
      <div className="admin-container">
        <SettingsContainer title="Admin Metrics" description="Loading metrics...">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </SettingsContainer>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <SettingsContainer 
        title="Admin Metrics" 
        description="Real-time system metrics and performance indicators"
      >
        <div className="space-y-8">
          {/* Hero Section with KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics && metrics.length > 0 ? (
              metrics.map((metric) => (
                <DynamicKPICard
                  key={metric.id}
                  title={metric.label}
                  value={metric.value}
                  unit={metric.unit}
                  trend={metric.trend}
                  change={metric.change || 0}
                  onClick={() => toast.info(`Viewing details for ${metric.label}`)}
                />
              ))
            ) : (
              <Card className="col-span-3 p-6 text-center">
                <p>No metrics data found. Sample data will be loaded shortly.</p>
              </Card>
            )}
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
    </div>
  );
}
