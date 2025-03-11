
import { Clock } from "lucide-react";

interface MetricSummaryCardsProps {
  data: Array<{ date: string; value: number }>;
  unit?: string;
}

export function MetricSummaryCards({ data, unit }: MetricSummaryCardsProps) {
  // Calculate metrics
  const maxValue = Math.max(...data.map(d => d.value));
  const avgValue = Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
        <div className="text-white/70 text-sm">Peak Value</div>
        <div className="text-xl font-medium mt-1">
          {maxValue.toLocaleString()} {unit}
        </div>
      </div>
      <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
        <div className="text-white/70 text-sm">Average</div>
        <div className="text-xl font-medium mt-1">
          {avgValue.toLocaleString()} {unit}
        </div>
      </div>
      <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
        <div className="text-white/70 text-sm">Last Updated</div>
        <div className="text-xl font-medium mt-1 flex items-center">
          <Clock size={14} className="mr-1" />
          Just now
        </div>
      </div>
    </div>
  );
}
