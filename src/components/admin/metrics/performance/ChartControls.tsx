
import { cn } from "@/lib/utils";
import { ArrowUpDown, Download, LayoutGrid } from "lucide-react";
import { MetricDefinition, MetricType } from "@/hooks/admin/metrics/usePerformanceChartData";

interface ChartControlsProps {
  metrics: MetricDefinition[];
  activeMetric: MetricType;
  setActiveMetric: (metric: MetricType) => void;
  chartType: 'line' | 'area';
  setChartType: (type: 'line' | 'area') => void;
}

export function ChartControls({
  metrics,
  activeMetric,
  setActiveMetric,
  chartType,
  setChartType
}: ChartControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Metric Selector */}
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={cn(
              "px-3 py-1 text-xs font-medium transition-all",
              activeMetric === metric.id 
                ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
                : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
            )}
            style={{
              boxShadow: activeMetric === metric.id ? `0 0 10px ${metric.color}40` : 'none'
            }}
          >
            {metric.name}
          </button>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        <button
          onClick={() => setChartType('line')}
          className={cn(
            "p-1 transition-all",
            chartType === 'line' 
              ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
              : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
          )}
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>
        <button
          onClick={() => setChartType('area')}
          className={cn(
            "p-1 transition-all",
            chartType === 'area' 
              ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
              : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      {/* Export Button */}
      <button
        className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all"
        onClick={() => {
          // In a real app, this would trigger an export
          alert("Export feature would be implemented here");
        }}
      >
        <Download className="h-3 w-3" />
        Export
      </button>
    </div>
  );
}
