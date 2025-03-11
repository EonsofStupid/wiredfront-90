
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { DollarSign } from "lucide-react";

interface FinancialMetric {
  value: number;
}

interface FinancialMetricsPanelProps {
  revenueMetric: FinancialMetric;
}

export function FinancialMetricsPanel({ revenueMetric }: FinancialMetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <AdminCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="h-5 w-5 text-[#8B5CF6] mr-2" />
          Revenue Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm">Subscription Revenue</div>
            <div className="text-2xl font-medium mt-1">
              ${Math.floor(revenueMetric.value * 0.8).toLocaleString()}
            </div>
            <div className="text-xs text-white/50 mt-1">80% of total</div>
          </div>
          <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm">API Usage Revenue</div>
            <div className="text-2xl font-medium mt-1">
              ${Math.floor(revenueMetric.value * 0.15).toLocaleString()}
            </div>
            <div className="text-xs text-white/50 mt-1">15% of total</div>
          </div>
          <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm">Other Revenue</div>
            <div className="text-2xl font-medium mt-1">
              ${Math.floor(revenueMetric.value * 0.05).toLocaleString()}
            </div>
            <div className="text-xs text-white/50 mt-1">5% of total</div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
