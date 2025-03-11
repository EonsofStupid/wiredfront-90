
import { useMetrics } from "@/hooks/admin/metrics/useMetrics";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { DynamicKPICard } from "@/components/admin/metrics/DynamicKPICard";
import { StatusIndicator } from "@/components/admin/metrics/StatusIndicator";
import { SystemStatusPanel } from "@/components/admin/metrics/SystemStatusPanel";
import { PerformanceChart } from "@/components/admin/metrics/PerformanceChart";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AreaChart, ArrowUpDown, Calendar, Cpu, Database, DollarSign, RefreshCcw, Server, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeRangeSelector, TimeRangeOption } from "@/components/admin/metrics/TimeRangeSelector";
import { MetricDetailsDialog } from "@/components/admin/metrics/MetricDetailsDialog";

// Generate sample data with revenue metrics
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
  const { data: metrics, isLoading, refetch } = useMetrics();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('7d');
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [revenueMetric, setRevenueMetric] = useState(generateSampleRevenue());

  // Function to refresh all data
  const refreshData = () => {
    refetch();
    setRevenueMetric(generateSampleRevenue());
    toast.success("Dashboard refreshed");
  };

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

  // Handle metric card click
  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsDetailsOpen(true);
    
    // Set active tab based on category
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

  // Get icon for metric
  const getMetricIcon = (metricName: string) => {
    const icons = {
      active_users: <Users className="h-5 w-5" />,
      api_requests: <Zap className="h-5 w-5" />,
      response_time: <AreaChart className="h-5 w-5" />,
      cpu_usage: <Cpu className="h-5 w-5" />,
      memory_usage: <Database className="h-5 w-5" />,
      revenue: <DollarSign className="h-5 w-5" />,
    };
    
    // Check if metricName contains revenue (case insensitive)
    if (metricName.toLowerCase().includes('revenue')) {
      return icons.revenue;
    }
    
    return icons[metricName.toLowerCase().replace(/\s/g, '_') as keyof typeof icons] || <Server className="h-5 w-5" />;
  };

  // Handle time range change
  const handleTimeRangeChange = (newRange: TimeRangeOption) => {
    setTimeRange(newRange);
    toast.info(`Viewing data for ${newRange}`);
    // In a real app, this would trigger a new data fetch with the selected time range
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

  // All available tabs
  const availableTabs = ["overview", "performance", "users", "api", "system", "financials"];

  return (
    <div className="admin-container">
      <SettingsContainer 
        title="System Metrics"
        description="Real-time system metrics and performance indicators"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
              Live Monitoring
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TimeRangeSelector 
              selected={timeRange} 
              onChange={handleTimeRangeChange} 
            />
            
            <button 
              onClick={refreshData}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1A1F2C]/60 text-white/70 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all"
            >
              <RefreshCcw size={12} />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-none p-1">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "border border-[#8B5CF6]/20 backdrop-blur-sm",
                "hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10",
                activeTab === tab 
                  ? "bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 border-[#8B5CF6]/50 text-white"
                  : "bg-[#1A1F2C]/40 text-white/70"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {/* Hero Section with KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Include the revenue metric */}
            <DynamicKPICard 
              key="revenue-card"
              title={revenueMetric.label}
              value={revenueMetric.value}
              unit={revenueMetric.unit}
              trend={revenueMetric.trend}
              change={revenueMetric.change}
              icon={getMetricIcon('revenue')}
              onClick={() => handleMetricClick(revenueMetric)}
            />
            
            {/* Display other metrics */}
            {metrics && metrics.length > 0 ? (
              metrics.map((metric) => (
                <DynamicKPICard
                  key={metric.id}
                  title={metric.label}
                  value={metric.value}
                  unit={metric.unit}
                  trend={metric.trend}
                  change={metric.change || 0}
                  icon={getMetricIcon(metric.label.toLowerCase().replace(/\s/g, '_'))}
                  onClick={() => handleMetricClick(metric)}
                />
              ))
            ) : (
              <AdminCard className="col-span-3 p-6 text-center">
                <p>No metrics data found. Sample data will be loaded shortly.</p>
              </AdminCard>
            )}
          </div>

          {/* Charts Section - conditionally show based on active tab */}
          {(activeTab === "overview" || activeTab === "performance") && (
            <PerformanceChart />
          )}

          {/* System Status Section - conditionally show based on active tab */}
          {(activeTab === "overview" || activeTab === "system") && (
            <SystemStatusPanel />
          )}
          
          {/* Financial Metrics - shown only on financials tab */}
          {activeTab === "financials" && (
            <div className="grid grid-cols-1 gap-6">
              <AdminCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 text-[#8B5CF6] mr-2" />
                  Revenue Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
                    <div className="text-white/70 text-sm">Subscription Revenue</div>
                    <div className="text-2xl font-medium mt-1">
                      ${Math.floor(revenueMetric.value * 0.8).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">80% of total</div>
                  </div>
                  <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
                    <div className="text-white/70 text-sm">API Usage Revenue</div>
                    <div className="text-2xl font-medium mt-1">
                      ${Math.floor(revenueMetric.value * 0.15).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">15% of total</div>
                  </div>
                  <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
                    <div className="text-white/70 text-sm">Other Revenue</div>
                    <div className="text-2xl font-medium mt-1">
                      ${Math.floor(revenueMetric.value * 0.05).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50 mt-1">5% of total</div>
                  </div>
                </div>
              </AdminCard>
            </div>
          )}
        </div>
      </SettingsContainer>

      {/* Metric Details Dialog */}
      <MetricDetailsDialog 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        metric={selectedMetric}
      />
    </div>
  );
}
