import { useMetrics } from "@/hooks/admin/metrics/useMetrics";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { SystemStatusPanel } from "@/components/admin/metrics/SystemStatusPanel";
import { PerformanceChart } from "@/components/admin/metrics/PerformanceChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TimeRangeOption } from "@/components/admin/metrics/TimeRangeSelector";
import { MetricDetailsDialog } from "@/components/admin/metrics/details/MetricDetailsDialog";
import { DashboardHeader } from "@/components/admin/metrics/DashboardHeader";
import { MetricsTabs } from "@/components/admin/metrics/MetricsTabs";
import { KPICardsGrid } from "@/components/admin/metrics/KPICardsGrid";
import { FinancialMetricsPanel } from "@/components/admin/metrics/FinancialMetricsPanel";
import { getMetricIcon } from "@/utils/admin/metrics/iconUtils";

const generateSampleRevenue = () => {
  const revenueTrend = Math.random() > 0.7 ? 'down' : 'up';
  const revenueChange = revenueTrend === 'up' 
    ? +(Math.random() * 15 + 5).toFixed(1) 
    : -(Math.random() * 10 + 1).toFixed(1);
  
  return {
    id: 'revenue-metric-1',
    label: 'Revenue (7d)',
    value: Math.floor(Math.random() * 25000 + 10000),
    unit: 'USD',
    trend: revenueTrend as 'up' | 'down' | 'neutral',
    change: revenueChange,
    category: 'revenue',
    description: 'Gross revenue from subscriptions and API usage over the past 7 days. This includes recurring revenue and one-time payments.'
  };
};

export default function MetricsOverview() {
  const { data: metrics, isLoading, refetch, isFetching } = useMetrics();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('7d');
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [revenueMetric, setRevenueMetric] = useState(generateSampleRevenue());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableTabs = ["overview", "performance", "users", "api", "system", "financials"];

  const refreshData = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
      setRevenueMetric(generateSampleRevenue());
      toast.success("Dashboard refreshed");
    });
  };

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

  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsDetailsOpen(true);
    
    const tabMap: Record<string, string> = {
      users: "users",
      api: "api",
      performance: "performance",
      system: "system",
      revenue: "financials",
    };
    const newTab = tabMap[metric.category] || "overview";
    setActiveTab(newTab);
  };

  const handleTimeRangeChange = (newRange: TimeRangeOption) => {
    setTimeRange(newRange);
    toast.info(`Viewing data for ${newRange}`);
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <SettingsContainer title="System Metrics" description="Loading metrics...">
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
        title="System Metrics"
        description="Real-time system metrics and performance indicators"
      >
        <DashboardHeader 
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          onRefresh={refreshData}
        />

        <MetricsTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={availableTabs}
        />

        <div className="space-y-8">
          <KPICardsGrid 
            metrics={metrics}
            revenueMetric={revenueMetric}
            onMetricClick={handleMetricClick}
            getMetricIcon={getMetricIcon}
            isLoading={isRefreshing || isFetching}
          />

          {(activeTab === "overview" || activeTab === "performance") && (
            <PerformanceChart />
          )}

          {(activeTab === "overview" || activeTab === "system") && (
            <SystemStatusPanel />
          )}
          
          {activeTab === "financials" && (
            <FinancialMetricsPanel revenueMetric={revenueMetric} />
          )}
        </div>
      </SettingsContainer>

      <MetricDetailsDialog 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        metric={selectedMetric}
      />
    </div>
  );
}
