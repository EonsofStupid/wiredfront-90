
import { StatusIndicator } from "../StatusIndicator";
import { cn } from "@/lib/utils";

interface MetricHeaderProps {
  metric: {
    label: string;
    value: number;
    unit?: string;
    trend: 'up' | 'down' | 'neutral';
    change: number;
  };
}

export function MetricHeader({ metric }: MetricHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm text-white/70">Current Value</h3>
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          {metric.value.toLocaleString()} {metric.unit}
        </div>
        <div className="text-sm mt-1">
          <span className={cn(
            "inline-flex items-center",
            metric.trend === 'up' ? "text-green-500" : 
            metric.trend === 'down' ? "text-red-500" : 
            "text-yellow-500"
          )}>
            {metric.change}% from previous period
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="hover:bg-white/10 p-2 rounded">
          <Download size={16} className="text-white/70" />
        </button>
        <button className="hover:bg-white/10 p-2 rounded">
          <ZoomIn size={16} className="text-white/70" />
        </button>
      </div>
    </div>
  );
}

import { Download, ZoomIn } from "lucide-react";
