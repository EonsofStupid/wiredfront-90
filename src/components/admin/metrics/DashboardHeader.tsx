
import { RefreshCcw } from "lucide-react";
import { TimeRangeSelector, TimeRangeOption } from "@/components/admin/metrics/TimeRangeSelector";
import { toast } from "sonner";

interface DashboardHeaderProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
  onRefresh: () => void;
}

export function DashboardHeader({ 
  timeRange, 
  onTimeRangeChange, 
  onRefresh 
}: DashboardHeaderProps) {
  return (
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
          onChange={onTimeRangeChange} 
        />
        
        <button 
          onClick={onRefresh}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1A1F2C]/60 text-white/70 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all"
        >
          <RefreshCcw size={12} />
          Refresh
        </button>
      </div>
    </div>
  );
}
