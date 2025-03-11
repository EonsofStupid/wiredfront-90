
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusIndicator } from "../StatusIndicator";
import { useState } from "react";
import { motion } from "framer-motion";
import { generateDetailData } from "@/utils/admin/metrics/sampleData";
import { MetricHeader } from "./MetricHeader";
import { MetricTimeRange, MetricTimeRangeOption } from "./MetricTimeRange";
import { MetricDetailChart } from "./MetricDetailChart";
import { MetricSummaryCards } from "./MetricSummaryCards";

interface MetricDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: {
    id: string;
    label: string;
    value: number;
    unit?: string;
    trend: 'up' | 'down' | 'neutral';
    change: number;
    category: string;
    description?: string;
  } | null;
}

export function MetricDetailsDialog({ open, onOpenChange, metric }: MetricDetailsDialogProps) {
  const [timeRange, setTimeRange] = useState<MetricTimeRangeOption>('14d');
  const [detailData, setDetailData] = useState(() => generateDetailData());
  
  // Update data when time range changes
  const updateTimeRange = (range: MetricTimeRangeOption) => {
    setTimeRange(range);
    const days = parseInt(range.replace('d', ''));
    setDetailData(generateDetailData(days));
  };
  
  if (!metric) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-[#1A1F2C] border-[#8B5CF6]/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]">
              {metric.label}
            </span>
            <StatusIndicator 
              status={metric.trend === 'up' ? 'healthy' : metric.trend === 'down' ? 'critical' : 'warning'} 
              label={metric.trend === 'up' ? 'Increasing' : metric.trend === 'down' ? 'Decreasing' : 'Stable'} 
            />
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Detailed analytics and historical data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Main KPI */}
          <MetricHeader metric={metric} />
          
          {/* Time range selection */}
          <MetricTimeRange 
            selected={timeRange} 
            onChange={updateTimeRange} 
          />
          
          {/* Chart */}
          <MetricDetailChart data={detailData} />
          
          {/* Additional Metrics and Analysis */}
          <MetricSummaryCards 
            data={detailData} 
            unit={metric.unit} 
          />
          
          {/* Description or Notes */}
          {metric.description && (
            <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
              <div className="text-white/70 text-sm mb-2">Analysis</div>
              <p className="text-white/80 text-sm">{metric.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
