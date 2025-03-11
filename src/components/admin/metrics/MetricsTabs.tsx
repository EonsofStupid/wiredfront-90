
import { cn } from "@/lib/utils";

interface MetricsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
}

export function MetricsTabs({ activeTab, onTabChange, tabs }: MetricsTabsProps) {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-none p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
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
  );
}
