
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
import { AreaChart, Cpu, Database, Server, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetricsOverview() {
  const { data: metrics, isLoading, refetch } = useMetrics();
  const [activeTab, setActiveTab] = useState("overview");

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

  // Get icon for metric
  const getMetricIcon = (metricName: string) => {
    const icons = {
      active_users: <Users className="h-5 w-5" />,
      api_requests: <Zap className="h-5 w-5" />,
      response_time: <AreaChart className="h-5 w-5" />,
      cpu_usage: <Cpu className="h-5 w-5" />,
      memory_usage: <Database className="h-5 w-5" />,
    };
    
    return icons[metricName as keyof typeof icons] || <Server className="h-5 w-5" />;
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
        title={
          <div className="flex items-center space-x-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
              System Metrics
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        } 
        description="Real-time system metrics and performance indicators"
      >
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-none p-1">
          {["overview", "performance", "users", "api", "system"].map((tab) => (
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
                  onClick={() => {
                    toast.info(`Viewing details for ${metric.label}`);
                    // Set active tab based on category
                    const tabMap: Record<string, string> = {
                      users: "users",
                      api: "api",
                      performance: "performance",
                      system: "system",
                    };
                    const newTab = tabMap[metric.category] || "overview";
                    setActiveTab(newTab);
                  }}
                />
              ))
            ) : (
              <AdminCard className="col-span-3 p-6 text-center">
                <p>No metrics data found. Sample data will be loaded shortly.</p>
              </AdminCard>
            )}
          </div>

          {/* Charts Section */}
          <PerformanceChart />

          {/* System Status Section */}
          <SystemStatusPanel />
        </div>
      </SettingsContainer>
    </div>
  );
}
