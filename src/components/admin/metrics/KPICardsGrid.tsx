
import { DynamicKPICard } from "@/components/admin/metrics/DynamicKPICard";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { ReactNode } from "react";

interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  category: string;
  description?: string;
}

interface KPICardsGridProps {
  metrics: Metric[] | null;
  revenueMetric: Metric;
  onMetricClick: (metric: Metric) => void;
  getMetricIcon: (metricName: string) => ReactNode;
}

export function KPICardsGrid({ 
  metrics, 
  revenueMetric, 
  onMetricClick, 
  getMetricIcon 
}: KPICardsGridProps) {
  return (
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
        onClick={() => onMetricClick(revenueMetric)}
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
            onClick={() => onMetricClick(metric)}
          />
        ))
      ) : (
        <AdminCard className="col-span-3 p-6 text-center">
          <p>No metrics data found. Sample data will be loaded shortly.</p>
        </AdminCard>
      )}
    </div>
  );
}
