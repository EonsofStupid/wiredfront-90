
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type MetricTimeRangeOption = '7d' | '14d' | '30d' | '90d';

interface MetricTimeRangeProps {
  selected: MetricTimeRangeOption;
  onChange: (range: MetricTimeRangeOption) => void;
}

export function MetricTimeRange({ selected, onChange }: MetricTimeRangeProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/70">
        <Calendar size={14} />
        <span className="text-sm">Time Range</span>
      </div>
      
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {(['7d', '14d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={cn(
              "px-3 py-1 text-xs font-medium transition-all",
              selected === range
                ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
            )}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
