
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimeRangeOption = '24h' | '7d' | '30d' | '90d' | 'all';

interface TimeRangeSelectorProps {
  selected: TimeRangeOption;
  onChange: (range: TimeRangeOption) => void;
  className?: string;
}

export function TimeRangeSelector({ selected, onChange, className }: TimeRangeSelectorProps) {
  const options: { value: TimeRangeOption; label: string }[] = [
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CalendarDays className="h-4 w-4 text-[#8B5CF6]" />
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 py-1 text-xs font-medium transition-all",
              selected === option.value 
                ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
